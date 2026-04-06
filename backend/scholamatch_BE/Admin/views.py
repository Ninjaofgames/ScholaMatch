from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from .email_renderer import send_html_email
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Count, Q
from django.db import connection
import random
from .models import Comment, User, School, Aspect, Analysis, SchoolComment, MotCle, SchoolSpeciality, Speciality
from .serializers import CommentSerializer
import csv
import io
import secrets
from .llm_service import extract_aspects_with_polarity, classify_sentiment, classify_aspect_category

@api_view(['GET'])
def test_connection(request):
    return Response({"message": "Connection successful!"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_comments_csv(request):
    file = request.FILES.get('file')
    if not file:
        return Response({'error': 'No file uploaded'}, status=400)
    decoded = file.read().decode('utf-8-sig')  # utf-8-sig strips BOM from Excel CSVs
    # Auto-detect delimiter (comma or semicolon)
    first_line = decoded.split('\n')[0] if decoded else ''
    delimiter = ';' if first_line.count(';') > first_line.count(',') else ','
    reader = csv.DictReader(io.StringIO(decoded), delimiter=delimiter)
    print(f"[CSV DEBUG] Delimiter: '{delimiter}'")
    print(f"[CSV DEBUG] Fieldnames: {reader.fieldnames}")
    rows = list(reader)
    print(f"[CSV DEBUG] Total rows: {len(rows)}")
    if rows:
        print(f"[CSV DEBUG] First row: {dict(rows[0])}")
    saved = 0
    errors = []
    for i, row in enumerate(rows):
        try:
            comment_content = row.get('comment_content', '').strip()
            school_name = row.get('school_name', '').strip()
            
            if not comment_content:
                errors.append(f"Row {i+2}: missing comment_content")
                continue
            aspects = []
            j = 1
            while f'aspect{j}_name' in row:
                name = row[f'aspect{j}_name'].strip()
                polarity = row[f'aspect{j}_polarity'].strip().lower()
                if name and polarity in ['positive', 'neutral', 'negative']:
                    aspects.append({'aspect': name, 'polarity': polarity})
                j += 1
            npos = sum(1 for a in aspects if a['polarity'] == 'positive')
            nneg = sum(1 for a in aspects if a['polarity'] == 'negative')
            score = round((npos - nneg) / len(aspects), 2) if aspects else 0
            label = 'positive' if score > 0 else ('negative' if score < 0 else 'neutral')
            
            comment = Comment.objects.create(
                comment_content=comment_content,
                data_source='csv',
                sentiment_score=score,
                sentiment_label=label,
            )
            if school_name:
                school = School.objects.filter(school_name__iexact=school_name).first()
                if school:
                    with connection.cursor() as cursor:
                        cursor.execute(
                            "INSERT INTO school_comment (id_ecole, id_comment) VALUES (%s, %s)",
                            [school.id_school, comment.id_comment]
                        )
            for a in aspects:
                aspect, _ = Aspect.objects.get_or_create(aspect_name=a['aspect'])
                Analysis.objects.create(id_comment=comment, id_aspect=aspect, polarity=a['polarity'])
            saved += 1
        except Exception as e:
            import traceback
            traceback.print_exc()
            errors.append(f"Row {i+2}: {str(e)}")
    return Response({'saved': saved, 'errors': errors})

@api_view(['POST'])
def submit_comment(request):
    try:
        serializer = CommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Comment saved!"}, status=201)
        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_comments(request):
    comments = Comment.objects.all()
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=400)
            
        if User.objects.filter(email=email).exists():
            return Response({'error': 'A user with this email already exists'}, status=400)
            
        code = str(random.randint(100000, 999999))
        user = User.objects.create(
            username=email,
            email=email,
            prenom=request.data.get('first_name', ''),
            nom=request.data.get('last_name', ''),
            password=make_password(request.data.get('password')),
            verification_code=code,
            is_verified=False,
            role='user',
        )
        send_html_email(
            subject='Verify your ScholaMatch email',
            template_name='emails/verification_email.html',
            context={ 'code': code, 'email': user.email },
            recipient_list=[user.email],
            from_email='noreply@scholamatch.com',
        )
        return Response({ 'success': True, 'user': { 'email': user.email } })
    
class VerifyEmailView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')
            code = request.data.get('code')
            
            if not email or not code:
                return Response({ 'errors': { 'non_field_errors': ['Email and code are required'] } }, status=400)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({ 'errors': { 'email': ['User not found'] } }, status=400)

            # Ensure both are strings and stripped of whitespace for comparison
            if str(user.verification_code).strip() != str(code).strip():
                return Response({ 'errors': { 'code': ['Invalid code'] } }, status=400)

            user.is_verified = True
            user.verification_code = ''
            user.save()
            
            try:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({ 'success': True, 'token': token.key, 'user': { 'email': user.email } })
            except Exception as token_err:
                # If token creation fails (e.g. model mismatch), we still mark as verified
                # but might need to handle the response differently
                return Response({ 
                    'success': True, 
                    'message': 'Email verified, but session creation failed. Please login.',
                    'user': { 'email': user.email } 
                })
        except Exception as e:
            return Response({ 'errors': { 'non_field_errors': [str(e)] } }, status=500)

class ResendCodeView(APIView):
    def post(self, request):
        user = User.objects.get(email=request.data['email'])
        code = str(random.randint(100000, 999999))
        user.verification_code = code
        user.save()
        send_html_email(
            subject='Verify your ScholaMatch email',
            template_name='emails/verification_email.html',
            context={ 'code': code, 'email': user.email },
            recipient_list=[user.email],
            from_email='noreply@scholamatch.com',
        )
        return Response({ 'success': True })
    
class LoginView(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self, request):
        try:
            user = User.objects.get(email=request.data['email'])
        except User.DoesNotExist:
            return Response({ 'detail': 'Invalid credentials' }, status=400)
        if not check_password(request.data['password'], user.password):
            return Response({ 'detail': 'Invalid credentials' }, status=400)
        if not user.is_verified:
            return Response({ 'detail': 'Email not verified' }, status=403)
        return Response({ 
            'success': True,
            'token': f'user-{user.id_user}',
            'user': {
                'email': user.email,
                'first_name': user.prenom,
                'last_name': user.nom,
                'username': user.prenom + " " + user.nom,
                'created_at': user.created_at,
                'role': user.role,
            }
        })

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        return Response({ 'user': { 'email': user.email, 'first_name': user.first_name } })

class AdminLoginView(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self, request):
        try:
            user = User.objects.get(email=request.data['email'])
        except User.DoesNotExist:
            return Response({ 'detail': 'Invalid credentials' }, status=403)
        if not check_password(request.data['password'], user.password):
            return Response({ 'detail': 'Invalid credentials' }, status=403)
        if user.role != 'admin':
            return Response({ 'detail': 'Unauthorized' }, status=403)
        return Response({ 
            'success': True, 
            'token': f'admin-{user.id_user}', 
            'user': { 
                'email': user.email,
                'prenom': user.prenom,
                'nom': user.nom,
                'role': user.role,
            } 
        })

class AdminDashboardView(APIView):
    authentication_classes = []
    permission_classes = []
    def get(self, request):
        token = request.headers.get('Authorization', '').replace('Token ', '')
        if not token.startswith('admin-'):
            return Response({ 'detail': 'Unauthorized' }, status=403)
        try:
            user_id = token.replace('admin-', '')
            user = User.objects.get(id_user=user_id, role='admin')
        except User.DoesNotExist:
            return Response({ 'detail': 'Unauthorized' }, status=403)
        return Response({
            'data': {
                'admin': {
                    'email': user.email,
                    'prenom': user.prenom,
                    'nom': user.nom,
                    'role': user.role,
                }
            }
        })

@api_view(['GET'])
def search_schools(request):
    query = request.GET.get('q', '')
    active_filters = request.GET.getlist('filter')
    
    # We fetch a larger pool for filtering
    schools = School.objects.filter(school_name__icontains=query)[:50]
    data = []
    
    for s in schools:
        # Get comments linked to this school (raw SQL - table has no 'id' column)
        with connection.cursor() as cursor:
            cursor.execute("SELECT id_comment FROM school_comment WHERE id_ecole = %s", [s.id_school])
            comment_ids = [row[0] for row in cursor.fetchall()]
        
        # Calculate aspect scores using category logic
        aspect_stats = {
            'teachers': {'pos': 0, 'total': 0},
            'facilities': {'pos': 0, 'total': 0},
            'administration': {'pos': 0, 'total': 0},
            'affordability': {'pos': 0, 'total': 0},
        }
        
        analyses = Analysis.objects.filter(id_comment__in=comment_ids).select_related('id_aspect')
        
        global_pos = 0
        global_total = 0
        
        for analysis in analyses:
            asp = analysis.id_aspect
            category = asp.category
            
            # Use same fallback logic as school_detail
            if not category:
                category = classify_aspect_category(asp.aspect_name)
                asp.category = category
                asp.save(update_fields=['category'])
            
            if category in aspect_stats:
                aspect_stats[category]['total'] += 1
                if analysis.polarity == 'positive':
                    aspect_stats[category]['pos'] += 1
            
            if analysis.polarity in ['positive', 'negative']:
                global_total += 1
                if analysis.polarity == 'positive':
                    global_pos += 1
        
        # Compute final percentages
        scores = {
            k: (round((v['pos'] / v['total']) * 100, 1) if v['total'] > 0 else 0)
            for k, v in aspect_stats.items()
        }
        sentiment_score = round((global_pos / global_total) * 100, 1) if global_total > 0 else 0
        
        # ---- Filtering Logic ----
        is_matched = True
        for f in active_filters:
            if f in scores:
                # Require at least 50% positivity for a filter to match
                if scores[f] < 50:
                    is_matched = False
                    break
            elif f == 'recommended':
                 if sentiment_score < 70:
                      is_matched = False
                      break

        if not is_matched:
            continue

        # Assign classification grade
        if sentiment_score >= 80:
            classification = 'Exceptional'
        elif sentiment_score >= 60:
            classification = 'Highly Rated'
        elif sentiment_score >= 40:
            classification = 'Good'
        elif global_total == 0:
            classification = 'No Reviews Yet'
        else:
            classification = 'Improving'

        data.append({
            'id': s.id_school,
            'name': s.school_name,
            'location': s.place or '',
            'location_link': s.maps_link or '',
            'mail': s.email or '',
            'phone': s.phone_number or '',
            'funding_type': s.financial_type or '',
            'education_level': s.education_type or '',
            'teaching_language': s.teaching_language or '',
            'university_name': s.university_name or '',
            'website_link': s.website_link or '',
            'description': s.description or '',
            'image': s.image or '',
            'sentiment_score': sentiment_score,
            'classification': classification,
            'aspect_scores': scores,
            'review_count': len(comment_ids)
        })
    
    # Sort schools by sentiment score (highest first)
    data.sort(key=lambda x: x['sentiment_score'], reverse=True)
    # Return top 10 relevant balanced result
    return Response(data[:10])

@api_view(['POST'])
@permission_classes([])
@authentication_classes([])
def create_school(request):
    try:
        lang = request.data.get('teaching_language', '')
        if lang == 'other':
            lang = request.data.get('teaching_language_other', lang)
        school = School.objects.create(
            school_name=request.data.get('name', ''),
            place=request.data.get('location', ''),
            maps_link=request.data.get('location_link', ''),
            email=request.data.get('mail', ''),
            phone_number=request.data.get('phone', ''),
            financial_type=request.data.get('funding_type', ''),
            education_type=request.data.get('education_level', ''),
            teaching_language=lang,
            university_name=request.data.get('university_name', ''),
            website_link=request.data.get('website_link', ''),
            description=request.data.get('description', ''),
            image=request.data.get('image', ''),
        )
        return Response({'success': True, 'id': school.id_school}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['PUT'])
@permission_classes([])
@authentication_classes([])
def update_school(request, pk):
    try:
        school = School.objects.get(id_school=pk)
    except School.DoesNotExist:
        return Response({'error': 'School not found'}, status=404)
    try:
        lang = request.data.get('teaching_language', school.teaching_language)
        if lang == 'other':
            lang = request.data.get('teaching_language_other', lang)
        school.school_name = request.data.get('name', school.school_name)
        school.place = request.data.get('location', school.place)
        school.maps_link = request.data.get('location_link', school.maps_link)
        school.email = request.data.get('mail', school.email)
        school.phone_number = request.data.get('phone', school.phone_number)
        school.financial_type = request.data.get('funding_type', school.financial_type)
        school.education_type = request.data.get('education_level', school.education_type)
        school.teaching_language = lang
        school.university_name = request.data.get('university_name', school.university_name)
        school.website_link = request.data.get('website_link', school.website_link)
        school.description = request.data.get('description', school.description)
        school.image = request.data.get('image', school.image)
        school.save()
        return Response({'success': True})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['DELETE'])
@permission_classes([])
@authentication_classes([])
def delete_school(request, pk):
    try:
        school = School.objects.get(id_school=pk)
    except School.DoesNotExist:
        return Response({'error': 'School not found'}, status=404)
    try:
        school.delete()
        return Response({'success': True})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
def platformStats(request):
    from .models import User, School, Comment, SessionTest
    return Response({
        'users': User.objects.count(),
        'schools': School.objects.count(),
        'comments': Comment.objects.count(),
        'tests': SessionTest.objects.count(),
    })

@api_view(['GET'])
def sentiment_stats(request):
    positive = Comment.objects.filter(sentiment_label='positive').count()
    neutral = Comment.objects.filter(sentiment_label='neutral').count()
    negative = Comment.objects.filter(sentiment_label='negative').count()
    return Response([
        { 'name': 'Positive', 'value': positive },
        { 'name': 'Neutral', 'value': neutral },
        { 'name': 'Negative', 'value': negative },
    ])

@api_view(['GET'])
def aspects_stats(request):
    aspects = Aspect.objects.all()
    data = []
    for aspect in aspects:
        positive = Analysis.objects.filter(id_aspect=aspect, polarity='positive').count()
        neutral = Analysis.objects.filter(id_aspect=aspect, polarity='neutral').count()
        negative = Analysis.objects.filter(id_aspect=aspect, polarity='negative').count()
        if positive + neutral + negative > 0:
            data.append({
                'aspect': aspect.aspect_name,
                'positive': positive,
                'neutral': neutral,
                'negative': negative,
            })
    return Response(data)

@api_view(['GET'])
def comments_week(request):
    from datetime import datetime, timedelta
    from django.utils import timezone
    
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    today = timezone.now()
    data = []
    
    with connection.cursor() as cursor:
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            cursor.execute(
                "SELECT COUNT(*) FROM comment WHERE DATE(comment_date) = %s",
                [day.date()]
            )
            count = cursor.fetchone()[0]
            data.append({ 'date': days[day.weekday()], 'comments': count })
    
    return Response(data)

@api_view(['GET'])
def keywords_stats(request):
    aspects = Analysis.objects.values('id_aspect__aspect_name').annotate(
        count=Count('id_aspect')
    ).order_by('-count')[:20]
    data = [{ 'text': a['id_aspect__aspect_name'], 'size': a['count'] * 100 } for a in aspects]
    return Response(data)

@api_view(['PUT'])
@permission_classes([])
@authentication_classes([])
def change_password(request):
    token = request.headers.get('Authorization', '').replace('Token ', '')
    if token.startswith('admin-'):
        user_id = token.replace('admin-', '')
    elif token.startswith('user-'):
        user_id = token.replace('user-', '')
    else:
        return Response({'detail': 'Invalid token'}, status=400)
        
    try:
        user = User.objects.get(id_user=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)
        
    if not check_password(request.data['current_password'], user.password):
        return Response({ 'detail': 'The password given is incorrect!'}, status=400)
    user.password = make_password(request.data['new_password'])
    user.save()
    return Response({ 'success': True })

@api_view(['PUT'])
@permission_classes([])
@authentication_classes([])
def update_profile(request):
    token = request.headers.get('Authorization', '').replace('Token ', '')
    if token.startswith('admin-'):
        user_id = token.replace('admin-', '')
    elif token.startswith('user-'):
        user_id = token.replace('user-', '')
    else:
        return Response({'detail': 'Invalid token'}, status=400)
        
    try:
        user = User.objects.get(id_user=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)
        
    user.prenom = request.data.get('prenom', user.prenom)
    user.nom = request.data.get('nom', user.nom)
    user.email = request.data.get('email', user.email)
    user.save()
    return Response({ 'success': True })

@api_view(['GET'])
def users_growth(request):
    from django.db import connection
    data = []
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'Mon'), COUNT(*)
            FROM "user"
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY DATE_TRUNC('month', created_at)
        """)
        for row in cursor.fetchall():
            data.append({ 'date': row[0], 'users': row[1] })
    return Response(data)

@api_view(['GET'])
@permission_classes([])
@authentication_classes([])
def school_detail(request, pk):
    try:
        school = School.objects.get(id_school=pk)
    except School.DoesNotExist:
        return Response({'error': 'School not found'}, status=404)

    # Get all comments linked to this school (raw SQL - table has no 'id' column)
    with connection.cursor() as cursor:
        cursor.execute("SELECT id_comment FROM school_comment WHERE id_ecole = %s", [school.id_school])
        comment_ids = [row[0] for row in cursor.fetchall()]
    comments = Comment.objects.filter(id_comment__in=comment_ids)
    total_comments = comments.count()

    # Get all analysis records for these comments to compute overall sentiment score from aspects
    all_analyses = Analysis.objects.filter(id_comment__in=comment_ids)
    
    total_aspects = all_analyses.filter(polarity__in=['positive', 'negative']).count()
    if total_aspects > 0:
        positive_aspects = all_analyses.filter(polarity='positive').count()
        # Sentiment score is % of positive aspects
        sentiment_score = round((positive_aspects / total_aspects) * 100, 1)
    else:
        sentiment_score = 0

    # Compute rating from sentiment score (map 0-100 to 1-5)
    rating = round(sentiment_score / 20) if total_comments > 0 else 0
    rating = max(0, min(5, rating))

    # Compute aspect positivity
    aspect_positivity = {
        'teachers': {'pos': 0, 'total': 0},
        'facilities': {'pos': 0, 'total': 0},
        'administration': {'pos': 0, 'total': 0},
        'affordability': {'pos': 0, 'total': 0},
    }

    analyses = Analysis.objects.filter(
        id_comment__in=comment_ids
    ).select_related('id_aspect')

    for analysis in analyses:
        asp = analysis.id_aspect
        
        if not asp.category:
            asp.category = classify_aspect_category(asp.aspect_name)
            asp.save(update_fields=['category'])
        
        category = asp.category
        if category in aspect_positivity:
            aspect_positivity[category]['total'] += 1
            if analysis.polarity == 'positive':
                aspect_positivity[category]['pos'] += 1

    aspect_positivity = {
        k: round((v['pos'] / v['total']) * 100, 1) if v['total'] > 0 else 0
        for k, v in aspect_positivity.items()
    }

    # Get keywords from mot_cle table
    keywords_qs = MotCle.objects.filter(id_school=school.id_school)
    keywords_list = [kw.content for kw in keywords_qs]

    # Get specialities (raw SQL since table has no id column)
    with connection.cursor() as cursor:
        cursor.execute("SELECT id_speciality FROM school_speciality WHERE id_school = %s", [school.id_school])
        speciality_ids = [row[0] for row in cursor.fetchall()]
        
    programs_list = []
    for spec_id in speciality_ids:
        try:
            spec = Speciality.objects.get(id_speciality=spec_id)
            programs_list.append(spec.speciality_name)
        except Speciality.DoesNotExist:
            pass

    data = {
        'id': school.id_school,
        'name': school.school_name,
        'location': school.place or '',
        'location_link': school.maps_link or '',
        'mail': school.email or '',
        'phone': school.phone_number or '',
        'funding_type': school.financial_type or '',
        'funding_type_display': school.financial_type or '',
        'education_level': school.education_type or '',
        'education_level_display': school.education_type or '',
        'teaching_language': school.teaching_language or '',
        'university_name': school.university_name or '',
        'website_link': school.website_link or '',
        'description': school.description or '',
        'thumbnail_url': school.image or '',
        'image': school.image or '',
        'sentiment_score': sentiment_score,
        'rating': rating,
        'review_count': total_comments,
        'aspectPositivity': aspect_positivity,
        'keywords_list': keywords_list,
        'programs_list': programs_list,
    }
    return Response(data)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def school_comments(request, pk):
    try:
        school = School.objects.get(id_school=pk)
    except School.DoesNotExist:
        return Response({'error': 'School not found'}, status=404)

    if request.method == 'GET':
        with connection.cursor() as cursor:
            cursor.execute("SELECT id_comment FROM school_comment WHERE id_ecole = %s", [school.id_school])
            comment_ids = [row[0] for row in cursor.fetchall()]
        comments = Comment.objects.filter(id_comment__in=comment_ids).order_by('-comment_date')

        results = []
        for c in comments:
            if c.sentiment_label == 'positive':
                sentiment = 'good'
            elif c.sentiment_label == 'negative':
                sentiment = 'bad'
            else:
                sentiment = 'neutral'

            results.append({
                'id': c.id_comment,
                'username': c.data_source or 'Anonymous',
                'text': c.comment_content,
                'sentiment': sentiment,
                'date': c.comment_date.isoformat() if c.comment_date else None,
            })
        return Response(results)

    if request.method == 'POST':
        text = request.data.get('text', '')
        username = request.data.get('username', 'Anonymous')
        
        if not text:
            return Response({'error': 'Comment text is required'}, status=400)

        # Use LLM to extract aspects and polarities
        extracted_aspects = extract_aspects_with_polarity(text)
        
        pos_count = sum(1 for a in extracted_aspects if a['polarity'] == 'positive')
        neg_count = sum(1 for a in extracted_aspects if a['polarity'] == 'negative')
        total_aspects = len(extracted_aspects)
        
        # Formula confirmed by USER: (positive - negative) / total
        if total_aspects > 0:
            sentiment_score = round((pos_count - neg_count) / total_aspects, 2)
        else:
            sentiment_score = 0.0
            
        # Manually derive label (LLM should not classify overall score)
        if pos_count > neg_count:
            sentiment_label = 'positive'
        elif neg_count > pos_count:
            sentiment_label = 'negative'
        else:
            sentiment_label = 'neutral'

        comment = Comment.objects.create(
            comment_content=text,
            data_source=username,
            sentiment_score=sentiment_score,
            sentiment_label=sentiment_label,
        )

        # Save Analysis and Aspect records
        for a in extracted_aspects:
            aspect, _ = Aspect.objects.get_or_create(aspect_name=a['aspect'])
            Analysis.objects.create(
                id_comment=comment,
                id_aspect=aspect,
                polarity=a['polarity']
            )

        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO school_comment (id_ecole, id_comment) VALUES (%s, %s)",
                [school.id_school, comment.id_comment]
            )

        if sentiment_label == 'positive':
            display_sentiment = 'good'
        elif sentiment_label == 'negative':
            display_sentiment = 'bad'
        else:
            display_sentiment = 'neutral'

        return Response({
            'id': comment.id_comment,
            'username': username,
            'text': comment.comment_content,
            'sentiment': display_sentiment,
            'date': comment.comment_date.isoformat() if comment.comment_date else None,
        }, status=201)
