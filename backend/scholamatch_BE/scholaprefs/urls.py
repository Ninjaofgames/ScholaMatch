from django.urls import path
from . import views

urlpatterns = [
    path('questions/', views.QuestionListView.as_view()),
    path('start/', views.StartSessionView.as_view()),
    path('answer/', views.SubmitAnswerView.as_view()),
    path('finish/', views.FinishSessionView.as_view()),
    path('me/', views.PreferencesMeView.as_view()),
]
