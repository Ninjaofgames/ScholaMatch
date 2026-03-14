"""
School and Comment models - Stores school information and user comments.
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

    # ── Detail page fields ──
    description = models.TextField(blank=True, help_text='Detailed information about the school')
    programs = models.CharField(max_length=500, blank=True, help_text='Comma-separated programs/majors')
    recommended_for = models.CharField(max_length=255, blank=True, help_text='e.g. Recommended for technicians')

    # Key Stats
    tuition = models.CharField(max_length=50, blank=True, help_text='e.g. XX.XX$')
    acceptance_rate = models.CharField(max_length=50, blank=True, help_text='e.g. XX.XX%')
    student_count = models.CharField(max_length=50, blank=True, help_text='e.g. XX student')
    ranking = models.CharField(max_length=50, blank=True, help_text='e.g. #X')
    job_acceptance_rate = models.CharField(max_length=50, blank=True, help_text='e.g. XX.XX%')

    # Sentiment & AI
    sentiment_score = models.DecimalField(max_digits=4, decimal_places=1, default=0.0, help_text='Percentage 0-100')
    ai_recommendation = models.TextField(blank=True, help_text='AI recommendation bullet points, one per line')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_programs_list(self):
        """Return programs as a list."""
        if not self.programs:
            return []
        return [p.strip() for p in self.programs.split(',') if p.strip()]

    def get_ai_recommendation_list(self):
        """Return AI recommendations as a list of bullet points."""
        if not self.ai_recommendation:
            return []
        return [line.strip() for line in self.ai_recommendation.splitlines() if line.strip()]

    def get_keywords_list(self):
        """Return keywords as a list."""
        if not self.keywords:
            return []
        return [k.strip() for k in self.keywords.split(',') if k.strip()]


class Comment(models.Model):
    """User comment on a school."""
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='comments')
    username = models.CharField(max_length=100, default='Anonymous')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.username} on {self.school.name}'
