import re
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .models import User, Profile, PendingUser, PasswordResetCode, UserActivity


EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
MAX_VERIFICATION_ATTEMPTS = 5


def validate_email_format(value):
    if not value or not isinstance(value, str):
        raise serializers.ValidationError('Invalid email format')
    value = value.strip().lower()
    if len(value) > 254:
        raise serializers.ValidationError('Email too long')
    if not EMAIL_REGEX.match(value):
        raise serializers.ValidationError('Invalid email format')
    return value


def sanitize_string(value, max_len=150):
    if value is None:
        return ''
    s = str(value).strip()
    s = s[:max_len]
    return s


class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, max_length=128, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate_email(self, value):
        value = validate_email_format(value)
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already registered')
        return value

    def validate_first_name(self, value):
        v = sanitize_string(value, 150)
        if len(v) > 150:
            raise serializers.ValidationError('First name too long')
        return v

    def validate_last_name(self, value):
        v = sanitize_string(value, 150)
        if len(v) > 150:
            raise serializers.ValidationError('Last name too long')
        return v

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters')
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match'})
        return data


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6, min_length=6)

    def validate_code(self, value):
        if not value or not value.isdigit():
            raise serializers.ValidationError('Invalid code format')
        return value.strip()


class ResendCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        value = validate_email_format(value)
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already verified')
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        value = validate_email_format(value)
        try:
            user = User.objects.get(email=value)
            if user.is_staff:
                raise serializers.ValidationError('Use admin portal for password reset')
        except User.DoesNotExist:
            pass
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(min_length=8, max_length=128, write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match'})
        return data


class AdminPasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        value = validate_email_format(value)
        try:
            user = User.objects.get(email=value)
            if not user.is_staff:
                raise serializers.ValidationError('Admin account not found')
        except User.DoesNotExist:
            raise serializers.ValidationError('Admin account not found')
        return value


class AdminPasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(min_length=8, max_length=128, write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        value = validate_email_format(value)
        try:
            user = User.objects.get(email=value)
            if not user.is_staff:
                raise serializers.ValidationError('Admin account not found')
        except User.DoesNotExist:
            raise serializers.ValidationError('Admin account not found')
        return value

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match'})
        return data


class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        return validate_email_format(value)

    def validate(self, data):
        user = authenticate(
            request=self.context.get('request'),
            email=data['email'],
            password=data['password'],
        )
        if user is None:
            raise serializers.ValidationError({'email': 'Invalid credentials'})
        if not user.is_staff:
            raise serializers.ValidationError({'email': 'Admin access required'})
        data['user'] = user
        return data


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        return validate_email_format(value)

    def validate(self, data):
        user = authenticate(
            request=self.context.get('request'),
            email=data['email'],
            password=data['password'],
        )
        if user is None:
            raise serializers.ValidationError({'email': 'Invalid email or password'})
        if not user.is_active:
            raise serializers.ValidationError({'email': 'Please verify your email first'})
        if user.is_staff:
            raise serializers.ValidationError({'email': 'Use admin portal to sign in'})
        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'avatar_url')
        read_only_fields = fields

    def get_avatar_url(self, obj):
        profile = getattr(obj, 'profile', None)
        if profile and profile.avatar:
            return profile.avatar.url
        return None


ALLOWED_AVATAR_TYPES = ('image/jpeg', 'image/png', 'image/gif', 'image/webp')
MAX_AVATAR_SIZE = 5 * 1024 * 1024


class ProfileUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    avatar = serializers.FileField(required=False, allow_null=True)

    def validate_first_name(self, value):
        return sanitize_string(value or '', 150)

    def validate_last_name(self, value):
        return sanitize_string(value or '', 150)

    def validate_avatar(self, value):
        if not value:
            return value
        if value.size > MAX_AVATAR_SIZE:
            raise serializers.ValidationError('Image must be under 5MB')
        content_type = getattr(value, 'content_type', '') or ''
        if content_type not in ALLOWED_AVATAR_TYPES:
            raise serializers.ValidationError('Only JPEG, PNG, GIF, WebP allowed')
        return value

    def validate_email(self, value):
        value = validate_email_format(value)
        if User.objects.filter(email=value).exclude(pk=self.context['request'].user.pk).exists():
            raise serializers.ValidationError('Email already in use')
        return value

    def update(self, instance, validated_data):
        for attr in ('first_name', 'last_name', 'email'):
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])
        instance.save()
        if 'avatar' in validated_data and validated_data['avatar']:
            profile, _ = Profile.objects.get_or_create(user=instance)
            profile.avatar = validated_data['avatar']
            profile.save()
        return instance


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(min_length=8, max_length=128, write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect')
        return value

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match'})
        return data


class UserActivitySerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserActivity
        fields = ('id', 'user', 'user_email', 'action', 'ip_address', 'created_at')
