from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_add_role'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='role',
        ),
    ]
