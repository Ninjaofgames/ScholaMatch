import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scholamatch_BE.settings')
django.setup()

from django.db import connection

try:
    with connection.cursor() as cursor:
        cursor.execute("ALTER TABLE auth_user ADD COLUMN is_verified boolean DEFAULT false NOT NULL;")
        cursor.execute("ALTER TABLE auth_user ADD COLUMN verification_code varchar(6) DEFAULT '' NOT NULL;")
    print("Successfully added columns to auth_user table.")
except Exception as e:
    print("Error:", e)
