from django.urls import path
from . import views

urlpatterns = [
    path('api/comments/', views.submit_comment),
    path('api/comments/list/', views.get_comments),
]