"""
URL configuration for the main page app.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('school/<int:school_id>/', views.school_detail, name='school_detail'),
]
