"""
School model - Stores all school information from the form.
"""
from django.db import models


class School(models.Model):
    """Model representing a school in the database."""
    
    # Choices for the radio button fields
    FUNDING_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('hybrid', 'Hybrid'),
    ]
    
    EDUCATION_LEVEL_CHOICES = [
        ('primary', 'Primary'),
        ('secondary', 'Secondary'),
        ('high_school', 'High school'),
        ('college', 'College'),
    ]
    
    TEACHING_LANGUAGE_CHOICES = [
        ('bilingual', 'Bilingual'),
        ('french_mission', 'French Mission'),
        ('spanish_mission', 'Spanish Mission'),
        ('other', 'Other'),
    ]
    
    # Thumbnail image
    thumbnail = models.ImageField(upload_to='schools/thumbnails/', blank=True, null=True)
    
    # Basic info
    name = models.CharField(max_length=255)
    website_link = models.URLField(max_length=500, blank=True)
    location = models.CharField(max_length=255, blank=True)
    location_link = models.URLField(max_length=500, blank=True)
    mail = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    
    # Radio button fields
    funding_type = models.CharField(max_length=20, choices=FUNDING_CHOICES, default='public')
    education_level = models.CharField(max_length=20, choices=EDUCATION_LEVEL_CHOICES, default='primary')
    teaching_language = models.CharField(max_length=30, choices=TEACHING_LANGUAGE_CHOICES, default='bilingual')
    teaching_language_other = models.CharField(max_length=100, blank=True)  # For "Other" option
    
    # Optional fields
    university_name = models.CharField(max_length=255, blank=True)  # For college level
    keywords = models.CharField(max_length=255, blank=True)  # Max 4 keywords, comma-separated
    
    # For ratings (used in overview card)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=4.0)
    review_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
