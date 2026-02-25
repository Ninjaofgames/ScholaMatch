from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Question, UserPreferenceSession, UserPreferenceProfile
from .serializers import (
    QuestionSerializer,
    StartSessionSerializer,
    AnswerSubmitSerializer,
    FinishSessionSerializer,
    UpdateAnswerSerializer,
    AspectScoreSerializer,
    PreferenceProfileSerializer,
)
from .services import finalize_session_scoring


class QuestionListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QuestionSerializer

    def get_queryset(self):
        return Question.objects.filter(is_active=True).order_by("order")


class StartSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = StartSessionSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        session = serializer.save()
        return Response(
            {"session_id": session.id, "skipped": session.skipped},
            status=status.HTTP_201_CREATED,
        )


class SubmitAnswerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AnswerSubmitSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        ua = serializer.save()
        return Response(
            {
                "session_id": ua.session_id,
                "question_id": ua.question_id,
                "answer_id": ua.answer_id,
            },
            status=status.HTTP_201_CREATED,
        )


class FinishSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = FinishSessionSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        session = result["session"]
        scores = result["scores"]
        tags = result["tags"]
        return Response(
            {"session_id": session.id, "scores": scores, "tags": tags},
            status=status.HTTP_200_OK,
        )


class UpdateAnswerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        serializer = UpdateAnswerSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        ua = serializer.save()
        session = ua.session
        if session.completed and not session.skipped:
            finalize_session_scoring(session)
        profile = UserPreferenceProfile.objects.filter(user=request.user).first()
        return Response(
            {
                "session_id": session.id,
                "profile": PreferenceProfileSerializer(profile).data
                if profile
                else None,
            }
        )


class PreferencesMeView(APIView):
    """
    GET /api/preferences/me/
    Returns last session + scores + reminder flags.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        latest_session = (
            UserPreferenceSession.objects.filter(user=user)
            .order_by("-created_at")
            .first()
        )
        profile = getattr(user, "preference_profile", None)

        if not latest_session or not profile:
            return Response(
                {
                    "session": None,
                    "answers": {},
                    "aspect_scores": [],
                    "tags": {},
                    "has_completed": False,
                    "has_skipped": False,
                    "requires_reminder": True,
                }
            )

        aspect_scores = latest_session.aspect_scores.select_related("aspect")
        aspect_data = AspectScoreSerializer(aspect_scores, many=True).data

        tags = {}
        for s in aspect_scores:
            if s.score >= 80:
                level = "High"
            elif s.score >= 50:
                level = "Medium"
            else:
                level = "Low"
            tags[s.aspect.code] = level

        return Response(
            {
                "session": {
                    "id": latest_session.id,
                    "completed": latest_session.completed,
                    "skipped": latest_session.skipped,
                },
                "answers": profile.answers,
                "aspect_scores": aspect_data,
                "tags": tags,
                "has_completed": profile.completed,
                "has_skipped": profile.skipped,
                "requires_reminder": not profile.completed,
            }
        )

