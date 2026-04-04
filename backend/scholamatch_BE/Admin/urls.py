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
    path('api/schools/search/',     views.search_schools),
    path('api/schools/create/',     views.create_school),
    path('api/schools/<int:pk>/update/', views.update_school),
    path('api/schools/<int:pk>/delete/', views.delete_school),
    path('api/stats/', views.platformStats),
    path('api/stats/sentiment/', views.sentiment_stats),
    path('api/stats/aspects/', views.aspects_stats),
    path('api/stats/comments-week/', views.comments_week),
    path('api/stats/keywords/', views.keywords_stats),
    path('api/auth/update-profile/', views.update_profile),
    path('api/auth/change-password/', views.change_password),
    path('api/stats/users-growth/', views.users_growth),
    path('api/comments/upload-csv/', views.upload_comments_csv),
    path('api/schools/<int:pk>/', views.school_detail),
    path('api/schools/<int:pk>/comments/', views.school_comments),
]