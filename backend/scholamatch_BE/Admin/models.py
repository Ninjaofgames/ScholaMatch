from django.db import models

class Analysis(models.Model):
    id_analysis = models.AutoField(primary_key=True)
    polarity = models.TextField(blank=True, null=True)  # This field type is a guess.
    id_comment = models.ForeignKey('Comment', models.DO_NOTHING, db_column='id_comment')       
    id_aspect = models.ForeignKey('Aspect', models.DO_NOTHING, db_column='id_aspect')

    class Meta:
        managed = False
        db_table = 'analysis'


class Aspect(models.Model):
    id_aspect = models.AutoField(primary_key=True)
    aspect_name = models.CharField(max_length=150)

    class Meta:
        managed = False
        db_table = 'aspect'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Choice(models.Model):
    id_choice = models.AutoField(primary_key=True)
    content = models.TextField()
    id_question = models.ForeignKey('TestQuestion', models.DO_NOTHING, db_column='id_question')

    class Meta:
        managed = False
        db_table = 'choice'


class Comment(models.Model):
    id_comment = models.AutoField(primary_key=True)
    data_source = models.CharField(max_length=255, blank=True, null=True)
    comment_date = models.DateTimeField(blank=True, null=True)
    comment_content = models.TextField()
    sentiment_score = models.FloatField(blank=True, null=True)
    sentiment_label = models.TextField(blank=True, null=True)  # This field type is a guess.   

    class Meta:
        managed = False
        db_table = 'comment'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class MotCle(models.Model):
    id_mot_cle = models.AutoField(primary_key=True)
    content = models.CharField(max_length=50)
    id_school = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mot_cle'


class PersonalityTest(models.Model):
    id_test = models.AutoField(primary_key=True)
    criteria = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'personality_test'


class ResponseTest(models.Model):
    id_response = models.AutoField(primary_key=True)
    id_session = models.ForeignKey('SessionTest', models.DO_NOTHING, db_column='id_session')
    id_question = models.ForeignKey('TestQuestion', models.DO_NOTHING, db_column='id_question')
    id_choice = models.ForeignKey(Choice, models.DO_NOTHING, db_column='id_choice')

    class Meta:
        managed = False
        db_table = 'response_test'


class School(models.Model):
    id_school = models.AutoField(primary_key=True)
    school_name = models.CharField(max_length=200)
    place = models.CharField(max_length=500)
    image = models.TextField(blank=True, null=True)
    financial_type = models.TextField()  # This field type is a guess.
    education_type = models.TextField()  # This field type is a guess.
    university_name = models.CharField(max_length=200, blank=True, null=True)
    teaching_language = models.CharField(max_length=100)
    website_link = models.TextField(blank=True, null=True)
    maps_link = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    email = models.CharField(max_length=150, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'school'


class SchoolComment(models.Model):
    id_ecole = models.IntegerField()
    id_comment = models.ForeignKey(Comment, models.DO_NOTHING, db_column='id_comment')

    class Meta:
        managed = False
        db_table = 'school_comment'


class SchoolSpeciality(models.Model):
    id_school = models.ForeignKey(School, models.DO_NOTHING, db_column='id_school')
    id_speciality = models.ForeignKey('Speciality', models.DO_NOTHING, db_column='id_speciality')

    class Meta:
        managed = False
        db_table = 'school_speciality'


class SessionTest(models.Model):
    id_session = models.AutoField(primary_key=True)
    id_utilisateur = models.IntegerField()
    id_test = models.ForeignKey(PersonalityTest, models.DO_NOTHING, db_column='id_test')       
    date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'session_test'


class Speciality(models.Model):
    id_speciality = models.AutoField(primary_key=True)
    speciality_name = models.TextField()

    class Meta:
        managed = False
        db_table = 'speciality'


class TestQuestion(models.Model):
    id_question = models.AutoField(primary_key=True)
    question_content = models.TextField()
    id_test = models.ForeignKey(PersonalityTest, models.DO_NOTHING, db_column='id_test')       

    class Meta:
        managed = False
        db_table = 'test_question'


class User(models.Model):
    id_user = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=500)
    email = models.CharField(unique=True, max_length=150)
    role = models.TextField(blank=True, null=True)  # This field type is a guess.
    prenom = models.CharField(max_length=100, blank=True, null=True)
    nom = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user'