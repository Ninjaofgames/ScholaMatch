from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_view),
    path('email-test/', views.email_test_view),
    path('register/', views.register),
    path('verify-email/', views.verify_email),
    path('resend-code/', views.resend_verification_code),
    path('user/login/', views.user_login),
    path('user/profile/', views.user_profile),
    path('user/profile/update/', views.user_profile_update),
    path('user/change-password/', views.user_change_password),
    path('password-reset/request/', views.password_reset_request),
    path('password-reset/confirm/', views.password_reset_confirm),
    path('admin/login/', views.admin_login),
    path('admin/password-reset/request/', views.admin_password_reset_request),
    path('admin/password-reset/confirm/', views.admin_password_reset_confirm),
    path('admin/dashboard/', views.admin_dashboard),
    path('admin/activity-logs/', views.admin_activity_logs),
]
