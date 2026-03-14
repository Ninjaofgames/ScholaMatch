"""
Register School and Comment models in Django admin for easy management.
"""
from django.contrib import admin
from .models import School, Comment


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    readonly_fields = ['created_at']


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'education_level', 'funding_type', 'rating', 'sentiment_score']
    search_fields = ['name', 'location']
    list_filter = ['funding_type', 'education_level', 'teaching_language']
    inlines = [CommentInline]


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'school', 'username', 'created_at']
    search_fields = ['username', 'text']
    list_filter = ['created_at']
