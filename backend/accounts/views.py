import logging
import random
import string
from datetime import timedelta

from django.utils import timezone
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Profile, PendingUser, PasswordResetCode, UserActivity
from .permissions import AdminOnlyPermission, UserOnlyPermission
from .serializers import (
    RegisterSerializer,
    VerifyEmailSerializer,
    ResendCodeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    AdminPasswordResetRequestSerializer,
    AdminPasswordResetConfirmSerializer,
    AdminLoginSerializer,
    UserLoginSerializer,
    UserSerializer,
    ProfileUpdateSerializer,
    PasswordChangeSerializer,
    UserActivitySerializer,
    MAX_VERIFICATION_ATTEMPTS,
)
from .email_service import (
    send_verification_email,
    send_password_reset_email,
    send_admin_password_reset_email,
    test_email_connection,
)

logger = logging.getLogger(__name__)

PENDING_USER_EXPIRY_MINUTES = 10


class LoginRateThrottle(AnonRateThrottle):
    rate = '10/minute'


class RegisterThrottle(AnonRateThrottle):
    rate = '5/hour'


class VerifyEmailThrottle(AnonRateThrottle):
    rate = '10/minute'


class PasswordResetThrottle(AnonRateThrottle):
    rate = '5/hour'


class AdminPasswordResetThrottle(AnonRateThrottle):
    rate = '5/hour'


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {'access': str(refresh.access_token)}


def get_client_ip(request):
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    return x_forwarded.split(',')[0].strip() if x_forwarded else request.META.get('REMOTE_ADDR')


def log_user_activity(user, action, request):
    ip = get_client_ip(request)
    UserActivity.objects.create(user=user, action=action, ip_address=ip)


# ============ SHARED ============

@api_view(['GET'])
@permission_classes([AllowAny])
def test_view(request):
    return Response({'message': 'Backend connected successfully'})


@api_view(['GET'])
@permission_classes([AllowAny])
def email_test_view(request):
    ok, msg = test_email_connection()
    return Response({'success': ok, 'message': msg})


# ============ USER AUTH ============

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([RegisterThrottle])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    data = serializer.validated_data
    email = data['email'].strip().lower()
    first_name = data['first_name'].strip()[:150]
    last_name = data['last_name'].strip()[:150]
    from django.contrib.auth.hashers import make_password
    password_hash = make_password(data['password'])
    code = ''.join(random.choices(string.digits, k=6))
    expires_at = timezone.now() + timedelta(minutes=PENDING_USER_EXPIRY_MINUTES)
    PendingUser.objects.filter(email=email).delete()
    pending = PendingUser.objects.create(
        email=email,
        first_name=first_name,
        last_name=last_name,
        password_hash=password_hash,
        verification_code=code,
        expires_at=expires_at,
    )
    if not send_verification_email(email, code):
        logger.warning('Failed to send verification email to %s', email)
        pending.delete()
        return Response({'success': False, 'errors': {'email': 'Failed to send email. Try again.'}}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    return Response({
        'success': True,
        'message': 'Verification code sent to your email',
        'user': {'email': email},
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([VerifyEmailThrottle])
def verify_email(request):
    serializer = VerifyEmailSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    data = serializer.validated_data
    email = data['email'].strip().lower()
    code = data['code'].strip()
    pending = PendingUser.objects.filter(email=email).order_by('-created_at').first()
    if not pending:
        return Response({'success': False, 'errors': {'email': 'No pending registration found'}}, status=status.HTTP_400_BAD_REQUEST)
    if pending.verification_attempts >= MAX_VERIFICATION_ATTEMPTS:
        pending.delete()
        return Response({'success': False, 'errors': {'code': 'Too many attempts. Please register again.'}}, status=status.HTTP_400_BAD_REQUEST)
    if pending.is_expired():
        pending.delete()
        return Response({'success': False, 'errors': {'code': 'Code has expired. Please register again.'}}, status=status.HTTP_400_BAD_REQUEST)
    pending.verification_attempts += 1
    pending.save()
    if pending.verification_code != code:
        return Response({'success': False, 'errors': {'code': 'Invalid code'}}, status=status.HTTP_400_BAD_REQUEST)
    user = User(
        email=pending.email,
        first_name=pending.first_name,
        last_name=pending.last_name,
        is_active=True,
    )
    user.password = pending.password_hash
    user.save()
    pending.delete()
    tokens = get_tokens_for_user(user)
    return Response({
        'success': True,
        'user': UserSerializer(user).data,
        'token': tokens['access'],
    })


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([RegisterThrottle])
def resend_verification_code(request):
    serializer = ResendCodeSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    email = serializer.validated_data['email'].strip().lower()
    pending = PendingUser.objects.filter(email=email).order_by('-created_at').first()
    if not pending:
        return Response({'success': False, 'errors': {'email': 'No pending registration found'}}, status=status.HTTP_400_BAD_REQUEST)
    if pending.is_expired():
        pending.delete()
        return Response({'success': False, 'errors': {'email': 'Registration expired. Please register again.'}}, status=status.HTTP_400_BAD_REQUEST)
    code = ''.join(random.choices(string.digits, k=6))
    pending.verification_code = code
    pending.expires_at = timezone.now() + timedelta(minutes=PENDING_USER_EXPIRY_MINUTES)
    pending.verification_attempts = 0
    pending.save()
    if not send_verification_email(email, code):
        return Response({'success': False, 'errors': {'email': 'Failed to send email'}}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    return Response({'success': True, 'message': 'Verification code sent'})


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginRateThrottle])
def user_login(request):
    serializer = UserLoginSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    user = serializer.validated_data['user']
    tokens = get_tokens_for_user(user)
    return Response({'success': True, 'user': UserSerializer(user).data, 'token': tokens['access']})


@api_view(['GET'])
@permission_classes([UserOnlyPermission])
def user_profile(request):
    user = User.objects.select_related('profile').get(pk=request.user.pk)
    return Response({'success': True, 'user': UserSerializer(user).data})


@api_view(['PATCH'])
@permission_classes([UserOnlyPermission])
def user_profile_update(request):
    user = request.user
    serializer = ProfileUpdateSerializer(instance=user, data=request.data, partial=True, context={'request': request})
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    if 'email' in serializer.validated_data:
        log_user_activity(user, 'email_change', request)
    else:
        log_user_activity(user, 'profile_update', request)
    user.refresh_from_db()
    return Response({'success': True, 'user': UserSerializer(user).data})


@api_view(['POST'])
@permission_classes([UserOnlyPermission])
def user_change_password(request):
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    user = request.user
    user.set_password(serializer.validated_data['new_password'])
    user.save()
    log_user_activity(user, 'password_change', request)
    return Response({'success': True, 'message': 'Password updated'})


# ============ PASSWORD RESET ============

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([PasswordResetThrottle])
def password_reset_request(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    email = serializer.validated_data['email']
    user = User.objects.filter(email=email, is_staff=False).first()
    if user:
        code = ''.join(random.choices(string.digits, k=6))
        PasswordResetCode.objects.create(user=user, code=code)
        send_password_reset_email(user.email, code)
    return Response({'success': True, 'message': 'If account exists, code sent to email'})


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([PasswordResetThrottle])
def password_reset_confirm(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    data = serializer.validated_data
    user = User.objects.filter(email=data['email'], is_staff=False).first()
    if not user:
        return Response({'success': False, 'errors': {'email': 'Invalid email'}}, status=status.HTTP_400_BAD_REQUEST)
    latest = PasswordResetCode.objects.filter(user=user).order_by('-created_at').first()
    if not latest or latest.code != data['code']:
        return Response({'success': False, 'errors': {'code': 'Invalid or expired code'}}, status=status.HTTP_400_BAD_REQUEST)
    if latest.is_expired(10):
        latest.delete()
        return Response({'success': False, 'errors': {'code': 'Code has expired'}}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(data['new_password'])
    user.save()
    latest.delete()
    log_user_activity(user, 'password_change', request)
    return Response({'success': True, 'message': 'Password reset successful'})


# ============ ADMIN ============

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AdminPasswordResetThrottle])
def admin_password_reset_request(request):
    serializer = AdminPasswordResetRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    email = serializer.validated_data['email']
    user = User.objects.get(email=email, is_staff=True)
    code = ''.join(random.choices(string.digits, k=6))
    PasswordResetCode.objects.create(user=user, code=code)
    send_admin_password_reset_email(user.email, code)
    return Response({'success': True, 'message': 'Code sent to your admin email'})


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AdminPasswordResetThrottle])
def admin_password_reset_confirm(request):
    serializer = AdminPasswordResetConfirmSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    data = serializer.validated_data
    user = User.objects.get(email=data['email'], is_staff=True)
    latest = PasswordResetCode.objects.filter(user=user).order_by('-created_at').first()
    if not latest or latest.code != data['code']:
        return Response({'success': False, 'errors': {'code': 'Invalid or expired code'}}, status=status.HTTP_400_BAD_REQUEST)
    if latest.is_expired(10):
        latest.delete()
        return Response({'success': False, 'errors': {'code': 'Code has expired'}}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(data['new_password'])
    user.save()
    latest.delete()
    log_user_activity(user, 'password_change', request)
    return Response({'success': True, 'message': 'Password reset successful'})


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginRateThrottle])
def admin_login(request):
    serializer = AdminLoginSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    user = serializer.validated_data['user']
    tokens = get_tokens_for_user(user)
    return Response({'success': True, 'user': UserSerializer(user).data, 'token': tokens['access']})


@api_view(['GET'])
@permission_classes([AdminOnlyPermission])
def admin_dashboard(request):
    total_users = User.objects.count()
    today_count = User.objects.filter(date_joined__date=timezone.now().date()).count()
    active_count = User.objects.filter(is_active=True).count()
    staff_count = User.objects.filter(is_staff=True).count()
    last_users = User.objects.select_related('profile').order_by('-date_joined')[:10]
    return Response({
        'success': True,
        'data': {
            'admin': UserSerializer(request.user).data,
            'total_users': total_users,
            'active_users': active_count,
            'staff_count': staff_count,
            'registered_today': today_count,
            'last_registered': UserSerializer(last_users, many=True).data,
        },
    })


@api_view(['GET'])
@permission_classes([AdminOnlyPermission])
def admin_activity_logs(request):
    logs = UserActivity.objects.select_related('user').order_by('-created_at')[:100]
    serializer = UserActivitySerializer(logs, many=True)
    return Response({'success': True, 'data': serializer.data})
