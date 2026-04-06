from django.urls import path, include
from . import views
from django.contrib import admin

urlpatterns = [
    path('api/test/', views.test_connection),
    path('admin/', admin.site.urls),
    path('', include('Admin.urls')),
    path('api/preferences/', include('scholaprefs.urls')),
]
