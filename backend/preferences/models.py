from django.conf import settings
from django.db import models
from django.utils import timezone


class Aspect(models.Model):
    name = models.CharField(max_length=64)
    code = models.CharField(max_length=32, unique=True)

    class Meta:
        verbose_name = "Aspect"
        verbose_name_plural = "Aspects"

    def __str__(self) -> str:
        return self.name


class Question(models.Model):
    code = models.CharField(max_length=16, unique=True)  # Q1, Q2...
    text = models.TextField()
    aspect = models.ForeignKey(
        Aspect, null=True, blank=True, on_delete=models.SET_NULL, related_name="questions"
    )
    weight = models.FloatField(default=1.0)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.code}: {self.text[:40]}"


class AnswerChoice(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="choices"
    )
    text = models.CharField(max_length=255)
    value_score = models.FloatField()
    weight_modifier = models.FloatField(default=1.0)

    class Meta:
        unique_together = ("question", "text")

    def __str__(self) -> str:
        return f"{self.question.code} - {self.text}"


class UserPreferenceSession(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="preference_sessions",
    )
    completed = models.BooleanField(default=False)
    skipped = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"PreferenceSession#{self.id} for {self.user_id}"


class UserAnswer(models.Model):
    session = models.ForeignKey(
        UserPreferenceSession,
        on_delete=models.CASCADE,
        related_name="answers",
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="user_answers",
    )
    answer = models.ForeignKey(
        AnswerChoice,
        on_delete=models.CASCADE,
        related_name="user_answers",
    )
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("session", "question")
        indexes = [
            models.Index(fields=["session"]),
            models.Index(fields=["question"]),
        ]

    def __str__(self) -> str:
        return f"Session {self.session_id} - {self.question.code} -> {self.answer_id}"


class AspectScore(models.Model):
    session = models.ForeignKey(
        UserPreferenceSession,
        on_delete=models.CASCADE,
        related_name="aspect_scores",
    )
    aspect = models.ForeignKey(
        Aspect,
        on_delete=models.CASCADE,
        related_name="aspect_scores",
    )
    score = models.FloatField()  # 0–100 normalized

    class Meta:
        unique_together = ("session", "aspect")
        indexes = [
            models.Index(fields=["session", "aspect"]),
        ]

    def __str__(self) -> str:
        return f"{self.session_id} - {self.aspect.code}: {self.score}"


class UserPreferenceProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="preference_profile",
    )
    latest_session = models.ForeignKey(
        UserPreferenceSession,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    answers = models.JSONField(default=dict, blank=True)
    location_score = models.FloatField(default=0)
    financial_score = models.FloatField(default=0)
    pedagogical_score = models.FloatField(default=0)
    infrastructure_score = models.FloatField(default=0)
    primary_priority = models.CharField(max_length=64, blank=True)
    completed = models.BooleanField(default=False)
    skipped = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["completed"]),
        ]

    def __str__(self) -> str:
        return f"PreferenceProfile for {self.user_id}"

