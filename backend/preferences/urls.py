from django.urls import path

from . import views

urlpatterns = [
    path("questions/", views.QuestionListView.as_view(), name="preferences-questions"),
    path("start/", views.StartSessionView.as_view(), name="preferences-start"),
    path("answer/", views.SubmitAnswerView.as_view(), name="preferences-answer"),
    path("finish/", views.FinishSessionView.as_view(), name="preferences-finish"),
    path("update/", views.UpdateAnswerView.as_view(), name="preferences-update"),
    path("me/", views.PreferencesMeView.as_view(), name="preferences-me"),
]

