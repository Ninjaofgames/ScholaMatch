from django.apps import AppConfig


class SchoolsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'schools_app'
    label = 'schools'
    verbose_name = 'School Management'
