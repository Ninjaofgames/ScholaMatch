# Generated data migration - adds sample school for overview

from django.db import migrations


def create_sample_school(apps, schema_editor):
    School = apps.get_model('schools', 'School')
    School.objects.get_or_create(
        name='Higher School of Technology',
        defaults={
            'location': 'N 1, KM 7, Casablanca',
            'funding_type': 'public',
            'education_level': 'college',
            'teaching_language': 'bilingual',
            'rating': 4.0,
            'review_count': 140,
        }
    )


def reverse_sample_school(apps, schema_editor):
    School = apps.get_model('schools', 'School')
    School.objects.filter(name='Higher School of Technology').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('schools', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_sample_school, reverse_sample_school),
    ]
