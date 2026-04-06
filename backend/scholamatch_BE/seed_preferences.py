import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scholamatch_BE.settings')
django.setup()

from scholaprefs.models import PreferenceCategory, Question, AnswerChoice

def seed():
    # Clear existing to avoid duplicates
    AnswerChoice.objects.all().delete()
    Question.objects.all().delete()
    PreferenceCategory.objects.all().delete()

    # Categories
    gen = PreferenceCategory.objects.create(name='General', description='General information')
    loc = PreferenceCategory.objects.create(name='Location', description='Social and geographic preferences')
    fin = PreferenceCategory.objects.create(name='Financial', description='Budget and scholarship needs')
    ped = PreferenceCategory.objects.create(name='Pedagogical', description='Teaching style and academic rigor')
    ins = PreferenceCategory.objects.create(name='Infrastructure', description='Campus facilities and modern tech')

    # Q1: Age range
    q1 = Question.objects.create(text="What is your age range?", order=1)
    AnswerChoice.objects.create(question=q1, text="Under 12", category=gen, weight=0)
    AnswerChoice.objects.create(question=q1, text="12 – 15", category=gen, weight=0)
    AnswerChoice.objects.create(question=q1, text="16 – 18", category=gen, weight=0)
    AnswerChoice.objects.create(question=q1, text="Over 18", category=gen, weight=0)

    # Q2: Current education level
    q2 = Question.objects.create(text="What is the current education level?", order=2)
    AnswerChoice.objects.create(question=q2, text="Primary school", category=gen, weight=0)
    AnswerChoice.objects.create(question=q2, text="Middle school", category=gen, weight=0)
    AnswerChoice.objects.create(question=q2, text="High school", category=gen, weight=0)
    AnswerChoice.objects.create(question=q2, text="University / Higher education", category=gen, weight=0)

    # Q3: Where do you currently live?
    q3 = Question.objects.create(text="Where do you currently live?", order=3)
    AnswerChoice.objects.create(question=q3, text="City center", category=loc, weight=1.0)
    AnswerChoice.objects.create(question=q3, text="Suburban area", category=loc, weight=0.5)
    AnswerChoice.objects.create(question=q3, text="Rural area", category=loc, weight=0.2)

    # Q4: Importance of school location
    q4 = Question.objects.create(text="How important is the school’s location for you?", order=4)
    AnswerChoice.objects.create(question=q4, text="Very important (close to home)", category=loc, weight=2.0)
    AnswerChoice.objects.create(question=q4, text="Important", category=loc, weight=1.0)
    AnswerChoice.objects.create(question=q4, text="Not important", category=loc, weight=0.0)

    # Q5: Importance of cost
    q5 = Question.objects.create(text="How important is the cost of the school for you?", order=5)
    AnswerChoice.objects.create(question=q5, text="Very important", category=fin, weight=2.0)
    AnswerChoice.objects.create(question=q5, text="Important", category=fin, weight=1.0)
    AnswerChoice.objects.create(question=q5, text="Neutral", category=fin, weight=0.5)
    AnswerChoice.objects.create(question=q5, text="Not important", category=fin, weight=0.0)

    # Q6: Budget range
    q6 = Question.objects.create(text="What is your budget range?", order=6)
    AnswerChoice.objects.create(question=q6, text="Low budget", category=fin, weight=1.5)
    AnswerChoice.objects.create(question=q6, text="Medium budget", category=fin, weight=1.0)
    AnswerChoice.objects.create(question=q6, text="High budget", category=fin, weight=0.5)
    AnswerChoice.objects.create(question=q6, text="No constraint", category=fin, weight=0.0)

    # Q7: Education quality
    q7 = Question.objects.create(text="What matters most to you in education quality?", order=7)
    AnswerChoice.objects.create(question=q7, text="Quality of teachers", category=ped, weight=1.5)
    AnswerChoice.objects.create(question=q7, text="Teaching methods", category=ped, weight=1.5)
    AnswerChoice.objects.create(question=q7, text="Academic results", category=ped, weight=1.0)
    AnswerChoice.objects.create(question=q7, text="All of the above", category=ped, weight=2.0)

    # Q8: Infrastructure
    q8 = Question.objects.create(text="How important are school facilities and infrastructure?", order=8)
    AnswerChoice.objects.create(question=q8, text="Very important", category=ins, weight=2.0)
    AnswerChoice.objects.create(question=q8, text="Important", category=ins, weight=1.0)
    AnswerChoice.objects.create(question=q8, text="Slightly important", category=ins, weight=0.5)
    AnswerChoice.objects.create(question=q8, text="Not important", category=ins, weight=0.0)

    # Q9: Type of school
    q9 = Question.objects.create(text="Which type of school are you looking for?", order=9)
    AnswerChoice.objects.create(question=q9, text="Public", category=gen, weight=0)
    AnswerChoice.objects.create(question=q9, text="Private", category=gen, weight=0)
    AnswerChoice.objects.create(question=q9, text="No preference", category=gen, weight=0)

    # Q10: Priority
    q10 = Question.objects.create(text="If you had to choose ONE priority, what would it be?", order=10)
    AnswerChoice.objects.create(question=q10, text="Cost", category=fin, weight=5.0)
    AnswerChoice.objects.create(question=q10, text="Education quality", category=ped, weight=5.0)
    AnswerChoice.objects.create(question=q10, text="Location", category=loc, weight=5.0)
    AnswerChoice.objects.create(question=q10, text="Infrastructure", category=ins, weight=5.0)

    print("Successfully seeded all 10 custom preference questions with aspects.")

if __name__ == "__main__":
    seed()
