from django.urls import path
from . import views
from .views import (
    RegisterView,
    VerifyEmailView,
    ResendCodeView,
    LoginView,
    ProfileView,
    AdminLoginView,
    AdminDashboardView,
)

urlpatterns = [
    path('api/comments/', views.submit_comment),
    path('api/comments/list/', views.get_comments),
    path('api/auth/register/',      RegisterView.as_view()),
    path('api/auth/verify-email/',  VerifyEmailView.as_view()),
    path('api/auth/resend-code/',   ResendCodeView.as_view()),
    path('api/auth/login/',         LoginView.as_view()),
    path('api/auth/profile/',       ProfileView.as_view()),
    path('api/auth/admin/login/',   AdminLoginView.as_view()),
    path('api/admin/dashboard/',    AdminDashboardView.as_view()),
]