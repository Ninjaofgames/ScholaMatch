from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Aspect",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=64)),
                ("code", models.CharField(max_length=32, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name="UserPreferenceSession",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("completed", models.BooleanField(default=False)),
                ("skipped", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="preference_sessions", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="Question",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.CharField(max_length=16, unique=True)),
                ("text", models.TextField()),
                ("weight", models.FloatField(default=1.0)),
                ("order", models.PositiveIntegerField(default=0)),
                ("is_active", models.BooleanField(default=True)),
                ("aspect", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="questions", to="preferences.aspect")),
            ],
            options={"ordering": ["order"]},
        ),
        migrations.CreateModel(
            name="AnswerChoice",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("text", models.CharField(max_length=255)),
                ("value_score", models.FloatField()),
                ("weight_modifier", models.FloatField(default=1.0)),
                ("question", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="choices", to="preferences.question")),
            ],
        ),
        migrations.CreateModel(
            name="UserAnswer",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("answer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="user_answers", to="preferences.answerchoice")),
                ("question", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="user_answers", to="preferences.question")),
                ("session", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="answers", to="preferences.userpreferencesession")),
            ],
        ),
        migrations.CreateModel(
            name="AspectScore",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("score", models.FloatField()),
                ("aspect", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="aspect_scores", to="preferences.aspect")),
                ("session", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="aspect_scores", to="preferences.userpreferencesession")),
            ],
        ),
        migrations.CreateModel(
            name="UserPreferenceProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("answers", models.JSONField(blank=True, default=dict)),
                ("location_score", models.FloatField(default=0)),
                ("financial_score", models.FloatField(default=0)),
                ("pedagogical_score", models.FloatField(default=0)),
                ("infrastructure_score", models.FloatField(default=0)),
                ("primary_priority", models.CharField(blank=True, max_length=64)),
                ("completed", models.BooleanField(default=False)),
                ("skipped", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("latest_session", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="+", to="preferences.userpreferencesession")),
                ("user", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="preference_profile", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddIndex(
            model_name="userpreferencesession",
            index=models.Index(fields=["user", "created_at"], name="preferences_user_crea_idx"),
        ),
        migrations.AddIndex(
            model_name="useranswer",
            index=models.Index(fields=["session"], name="preferences_sess_idx"),
        ),
        migrations.AddIndex(
            model_name="useranswer",
            index=models.Index(fields=["question"], name="preferences_quest_idx"),
        ),
        migrations.AddIndex(
            model_name="userpreferenceprofile",
            index=models.Index(fields=["completed"], name="preferences_comp_idx"),
        ),
        migrations.AddConstraint(
            model_name="useranswer",
            constraint=models.UniqueConstraint(fields=("session", "question"), name="unique_session_question"),
        ),
        migrations.AddConstraint(
            model_name="aspectscore",
            constraint=models.UniqueConstraint(fields=("session", "aspect"), name="unique_session_aspect"),
        ),
        migrations.AddConstraint(
            model_name="answerchoice",
            constraint=models.UniqueConstraint(fields=("question", "text"), name="unique_question_text"),
        ),
    ]

