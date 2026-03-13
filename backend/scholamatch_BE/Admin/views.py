from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from .email_renderer import send_html_email
from django.contrib.auth.hashers import make_password, check_password
import random
from .models import Comment, User
from .serializers import CommentSerializer
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
        email, code = request.data['email'], request.data['code']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({ 'errors': { 'email': ['User not found'] } }, status=400)
        if user.verification_code != code:
            return Response({ 'errors': { 'code': ['Invalid code'] } }, status=400)
        user.is_verified = True
        user.verification_code = ''
        user.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({ 'success': True, 'token': token.key, 'user': { 'email': user.email } })

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
        if not user.check_password(request.data['password'], user.password):
            return Response({ 'detail': 'Invalid credentials' }, status=400)
        if not user.is_verified:
            return Response({ 'detail': 'Email not verified' }, status=403)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({ 'success': True, 'token': token.key, 'user': { 'email': user.email } })

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
            return Response({ 'detail': 'Unauthorized' }, status=403)
        if not user.check_password(request.data['password']):
            return Response({ 'detail': 'Unauthorized' }, status=403)
        if not user.is_staff:
            return Response({ 'detail': 'Unauthorized' }, status=403)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({ 'success': True, 'token': token.key, 'user': { 'email': user.email } })

class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        return Response({ 'data': { 'admin': { 'email': request.user.email } } })