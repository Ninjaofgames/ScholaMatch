from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Comment, School
from .serializers import CommentSerializer, SchoolSerializer
from django.shortcuts import get_object_or_404
import csv
import io

@api_view(['GET'])
def test_connection(request):
    return Response({"message": "Connection successful!"})

@api_view(['POST'])
def upload_csv(request):
    file = request.FILES.get('file')
    if not file:
        return Response({"error": "No file uploaded"}, status=400)
    if not file.name.endswith('.csv'):
        return Response({"error": "File must be a CSV"}, status=400)
    decoded_file = file.read().decode('utf-8')
    reader = csv.reader(io.StringIO(decoded_file))
    rows = []
    for row in reader:
        rows.append(row)
    return Response({
        "message": "File uploaded successfully!",
        "filename": file.name,
        "rows": len(rows)
    })

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

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def school_list(request):
    if request.method == 'GET':
        schools = School.objects.all()
        serializer = SchoolSerializer(schools, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        mapped_data = {
            'school_name': data.get('name'),
            'website_link': data.get('website_link'),
            'place': data.get('location'),
            'maps_link': data.get('location_link'),
            'email': data.get('mail'),
            'phone_number': data.get('phone'),
            'financial_type': 'hybrid' if data.get('funding_type') == 'semi-public' else data.get('funding_type', 'public'),
            'education_type': 'high school' if data.get('education_level') == 'high' else ('secondary' if data.get('education_level') == 'middle' else data.get('education_level', 'primary')),
            'teaching_language': data.get('teaching_language_other') if data.get('teaching_language') == 'other' else data.get('teaching_language'),
            'university_name': data.get('university_name'),
            'description': data.get('keywords', ''),
        }
        if 'thumbnail' in request.FILES:
            mapped_data['image'] = request.FILES['thumbnail'].name
            
        serializer = SchoolSerializer(data=mapped_data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=201)
            except Exception as e:
                import traceback
                print("DB SAVE ERROR:", traceback.format_exc())
                return Response({"error": f"Database error: {str(e)}"}, status=500)
        
        print("SERIALIZER ERRORS:", serializer.errors)
        # Return a nicely formatted error string
        error_msgs = []
        for field, errors in serializer.errors.items():
            error_msgs.append(f"{field}: {', '.join(errors)}")
        return Response({"error": " | ".join(error_msgs)}, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
def school_detail(request, school_id):
    school = get_object_or_404(School, id_school=school_id)
    if request.method == 'GET':
        data = {
            'name': school.school_name,
            'website_link': school.website_link,
            'location': school.place,
            'location_link': school.maps_link,
            'mail': school.email,
            'phone': school.phone_number,
            'funding_type': school.financial_type,
            'education_level': school.education_type,
            'teaching_language': school.teaching_language,
            'university_name': school.university_name,
            'keywords': school.description,
        }
        return Response(data)
    elif request.method == 'PUT':
        data = request.data
        mapped_data = {
            'school_name': data.get('name', school.school_name),
            'website_link': data.get('website_link', school.website_link),
            'place': data.get('location', school.place),
            'maps_link': data.get('location_link', school.maps_link),
            'email': data.get('mail', school.email),
            'phone_number': data.get('phone', school.phone_number),
            'financial_type': 'hybrid' if data.get('funding_type') == 'semi-public' else data.get('funding_type', school.financial_type),
            'education_type': 'high school' if data.get('education_level') == 'high' else ('secondary' if data.get('education_level') == 'middle' else data.get('education_level', school.education_type)),
            'teaching_language': data.get('teaching_language_other') if data.get('teaching_language') == 'other' else data.get('teaching_language', school.teaching_language),
            'university_name': data.get('university_name', school.university_name),
            'description': data.get('keywords', school.description),
        }
        serializer = SchoolSerializer(school, data=mapped_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        school.delete()
        return Response({'message': 'School deleted'}, status=204)