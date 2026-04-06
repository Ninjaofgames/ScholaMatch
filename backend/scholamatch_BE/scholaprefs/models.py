from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class PreferenceCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Question(models.Model):
    text = models.TextField()
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.text[:50]

class AnswerChoice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    category = models.ForeignKey(PreferenceCategory, on_delete=models.CASCADE)
    weight = models.FloatField(default=1.0)

    def __str__(self):
        return f"{self.question.text[:20]} - {self.text}"

class UserPreferenceSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    skipped = models.BooleanField(default=False)

class UserAnswer(models.Model):
    session = models.ForeignKey(UserPreferenceSession, related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.ForeignKey(AnswerChoice, on_delete=models.CASCADE)

class UserPreferenceProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preference_profile')
    location_score = models.FloatField(default=0)
    financial_score = models.FloatField(default=0)
    pedagogical_score = models.FloatField(default=0)
    infrastructure_score = models.FloatField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    has_completed = models.BooleanField(default=False)
