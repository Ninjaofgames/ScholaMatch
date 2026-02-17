import random
import string
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone


def generate_six_digit_code():
    return ''.join(random.choices(string.digits, k=6))


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email


class PendingUser(models.Model):
    email = models.EmailField(db_index=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    password_hash = models.CharField(max_length=128)
    verification_code = models.CharField(max_length=6)
    expires_at = models.DateTimeField(db_index=True)
    verification_attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def is_expired(self):
        return timezone.now() > self.expires_at


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.FileField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class EmailVerificationCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_verification_codes')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def is_expired(self, minutes=10):
        return (timezone.now() - self.created_at).total_seconds() > (minutes * 60)


class PasswordResetCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_codes')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def is_expired(self, minutes=10):
        return (timezone.now() - self.created_at).total_seconds() > (minutes * 60)


class UserActivity(models.Model):
    ACTION_CHOICES = [
        ('password_change', 'Password Change'),
        ('profile_update', 'Profile Update'),
        ('email_change', 'Email Change'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
