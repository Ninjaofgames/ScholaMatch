from django.urls import path, include
from . import views

urlpatterns = [
    path('api/test/', views.test_connection),
    path('upload/', views.upload_csv),
    path('', include('Admin.urls'))
]
