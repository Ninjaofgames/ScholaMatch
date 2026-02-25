from django.db import migrations


def seed_questions(apps, schema_editor):
    Aspect = apps.get_model("preferences", "Aspect")
    Question = apps.get_model("preferences", "Question")
    AnswerChoice = apps.get_model("preferences", "AnswerChoice")

    location = Aspect.objects.create(code="location", name="Location")
    financial = Aspect.objects.create(code="financial", name="Financial")
    pedagogical = Aspect.objects.create(code="pedagogical", name="Pedagogical")
    infrastructure = Aspect.objects.create(code="infrastructure", name="Infrastructure")

    def add_q(code, text, aspect, order, weight=1.0):
        return Question.objects.create(
            code=code,
            text=text,
            aspect=aspect,
            order=order,
            weight=weight,
        )

    q1 = add_q("Q1", "What is your age range?", None, 1)
    q2 = add_q("Q2", "What is your current education level?", pedagogical, 2)
    q3 = add_q("Q3", "Where do you currently live?", location, 3)
    q4 = add_q("Q4", "How important is school location to you?", location, 4)
    q5 = add_q("Q5", "How important are tuition costs to you?", financial, 5)
    q6 = add_q("Q6", "What is your approximate annual budget?", financial, 6)
    q7 = add_q("Q7", "How important is education quality?", pedagogical, 7)
    q8 = add_q("Q8", "How important is school infrastructure and facilities?", infrastructure, 8)
    q9 = add_q("Q9", "What type of school do you prefer?", pedagogical, 9)
    q10 = add_q("Q10", "What is your main priority when choosing a school?", None, 10)

    def add_answers(question, choices):
        for text, value_score, weight_modifier in choices:
            AnswerChoice.objects.create(
                question=question,
                text=text,
                value_score=value_score,
                weight_modifier=weight_modifier,
            )

    importance_choices = [
        ("Very important", 1.0, 1.0),
        ("Important", 0.75, 1.0),
        ("Neutral", 0.5, 1.0),
        ("Not important", 0.25, 1.0),
    ]

    add_answers(q4, importance_choices)
    add_answers(q5, importance_choices)
    add_answers(q7, importance_choices)
    add_answers(q8, importance_choices)

    add_answers(q1, [
        ("Under 13", 0.3, 1.0),
        ("13-15", 0.6, 1.0),
        ("16-18", 0.8, 1.0),
        ("18+", 1.0, 1.0),
    ])

    add_answers(q2, [
        ("Middle school", 0.3, 1.0),
        ("High school", 0.6, 1.0),
        ("College prep", 0.8, 1.0),
    ])

    add_answers(q3, [
        ("Urban", 1.0, 1.0),
        ("Suburban", 0.8, 1.0),
        ("Rural", 0.5, 1.0),
    ])

    add_answers(q6, [
        ("Low budget", 1.0, 1.0),
        ("Medium budget", 0.7, 1.0),
        ("High budget", 0.4, 1.0),
    ])

    add_answers(q9, [
        ("Public", 0.6, 1.0),
        ("Private", 0.9, 1.0),
        ("Boarding", 0.7, 1.0),
        ("Online", 0.5, 1.0),
    ])

    add_answers(q10, [
        ("Location priority", 1.0, 1.0),
        ("Budget friendly", 1.0, 1.0),
        ("Education quality", 1.0, 1.0),
        ("Infrastructure & campus life", 1.0, 1.0),
    ])


def unseed_questions(apps, schema_editor):
    Question = apps.get_model("preferences", "Question")
    Aspect = apps.get_model("preferences", "Aspect")
    Question.objects.all().delete()
    Aspect.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("preferences", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_questions, unseed_questions),
    ]

