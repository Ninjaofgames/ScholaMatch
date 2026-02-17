# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_profile_emailverificationcode_passwordresetcode_useractivity'),
    ]

    operations = [
        migrations.CreateModel(
            name='PendingUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(db_index=True, max_length=254)),
                ('first_name', models.CharField(max_length=150)),
                ('last_name', models.CharField(max_length=150)),
                ('password_hash', models.CharField(max_length=128)),
                ('verification_code', models.CharField(max_length=6)),
                ('expires_at', models.DateTimeField(db_index=True)),
                ('verification_attempts', models.PositiveSmallIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
