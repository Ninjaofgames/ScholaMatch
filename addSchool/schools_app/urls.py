"""
URL configuration for the schools app.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.admin_page, name='admin_page'),
    path('search-school/', views.search_school, name='search_school'),
]
