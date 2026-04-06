import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scholamatch_BE.settings')
django.setup()

from django.db import connection

queries = [
    "CREATE SCHEMA IF NOT EXISTS test;",
    "CREATE TABLE IF NOT EXISTS personality_test (id_test SERIAL PRIMARY KEY, criteria VARCHAR(255));",
    "CREATE TABLE IF NOT EXISTS test_question (id_question SERIAL PRIMARY KEY, question_content TEXT, id_test INTEGER);",
    "CREATE TABLE IF NOT EXISTS choice (id_choice SERIAL PRIMARY KEY, content TEXT, id_question INTEGER);",
    "CREATE TABLE IF NOT EXISTS session_test (id_session SERIAL PRIMARY KEY, id_utilisateur INTEGER, id_test INTEGER, date DATE);",
    "CREATE TABLE IF NOT EXISTS response_test (id_response SERIAL PRIMARY KEY, id_session INTEGER, id_question INTEGER, id_choice INTEGER);"
]

try:
    with connection.cursor() as cursor:
        for q in queries:
            cursor.execute(q)
        
        # insert a default test if none exists
        cursor.execute("SELECT COUNT(*) FROM personality_test;")
        if cursor.fetchone()[0] == 0:
            print("Populating initial personality test data...")
            cursor.execute("INSERT INTO personality_test (criteria) VALUES ('General Personality') RETURNING id_test;")
            test_id = cursor.fetchone()[0]
            
            # sample questions
            questions = [
                "You regularly make new friends.",
                "You spend a lot of your free time exploring various random topics that pique your interest.",
                "Seeing other people cry can easily make you feel like you want to cry too.",
                "You often make a backup plan for a backup plan."
            ]
            options = ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
            
            for q in questions:
                cursor.execute("INSERT INTO test_question (question_content, id_test) VALUES (%s, %s) RETURNING id_question;", [q, test_id])
                q_id = cursor.fetchone()[0]
                for opt in options:
                    cursor.execute("INSERT INTO choice (content, id_question) VALUES (%s, %s);", [opt, q_id])
    print("Database synced successfully with the Personality Test schema and starter data!")
except Exception as e:
    print(f"Error executing database queries: {e}")
