from django.urls import path
from .api_views import SchoolListAPIView, SchoolDetailAPIView, SchoolCommentsAPIView

urlpatterns = [
    path('schools/', SchoolListAPIView.as_view(), name='api_schools_list'),
    path('schools/<int:pk>/', SchoolDetailAPIView.as_view(), name='api_school_detail'),
    path('schools/<int:pk>/comments/', SchoolCommentsAPIView.as_view(), name='api_school_comments'),
]
