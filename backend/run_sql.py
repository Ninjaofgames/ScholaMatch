import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def run_sql_file():
    filepath = 'init_db.sql'
    with open(filepath, 'r', encoding='utf-8') as f:
        sql = f.read()

    with connection.cursor() as cursor:
        cursor.execute(sql)
        print("SQL dump applied successfully!")

if __name__ == '__main__':
    run_sql_file()
