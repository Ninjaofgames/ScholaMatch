from django.urls import path
from . import views

urlpatterns = [
    path('api/comments/', views.submit_comment),
    path('api/comments/list/', views.get_comments),
    path('schools/', views.school_list),
    path('schools/<int:school_id>/', views.school_detail),
]