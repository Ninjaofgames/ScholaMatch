"""
Register School model in Django admin for easy management.
"""
from django.contrib import admin
from .models import School


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'education_level', 'funding_type', 'rating']
    search_fields = ['name', 'location']
    list_filter = ['funding_type', 'education_level', 'teaching_language']
