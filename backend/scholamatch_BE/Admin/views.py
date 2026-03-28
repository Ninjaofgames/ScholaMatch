from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from .email_renderer import send_html_email
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Count
import random
from .models import Comment, User, School, Aspect, Analysis, SchoolComment
from .serializers import CommentSerializer
import csv
import io
import secrets

@api_view(['GET'])
def test_connection(request):
    return Response({"message": "Connection successful!"})

@api_view(['POST'])
@permission_classes([])
@authentication_classes([])
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
                    SchoolComment.objects.create(id_ecole=school.id_school, id_comment=comment)
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
        serializer = CommentSerializer(data=request.data)
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
    def post(self, request):
        try:
            user = User.objects.get(email=request.data['email'])
        except User.DoesNotExist:
            return Response({ 'detail': 'Invalid credentials' }, status=400)
        if not check_password(request.data['password'], user.password):
            return Response({ 'detail': 'Invalid credentials' }, status=400)
        if not user.is_verified:
            return Response({ 'detail': 'Email not verified' }, status=403)
        return Response({ 'success': True, 'token': f'user-{user.id_user}', 'user': { 'email': user.email } })

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        return Response({ 'user': { 'email': user.email, 'first_name': user.first_name } })

class AdminLoginView(APIView):
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
    schools = School.objects.filter(school_name__icontains=query)[:10]
    data = [{
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
    } for s in schools]
    return Response(data)

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
    from django.db import connection
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
    user_id = token.replace('admin-', '')
    user = User.objects.get(id_user=user_id)
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
    user_id = token.replace('admin-', '')
    user = User.objects.get(id_user=user_id)
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