from rest_framework import serializers

from .models import (
    Question,
    AnswerChoice,
    UserPreferenceSession,
    UserAnswer,
    AspectScore,
    UserPreferenceProfile,
)
from .services import finalize_session_scoring


class AnswerChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerChoice
        fields = ("id", "text", "value_score", "weight_modifier")


class QuestionSerializer(serializers.ModelSerializer):
    choices = AnswerChoiceSerializer(many=True, read_only=True)
    aspect_code = serializers.CharField(source="aspect.code", read_only=True)

    class Meta:
        model = Question
        fields = (
            "id",
            "code",
            "text",
            "aspect_code",
            "weight",
            "order",
            "choices",
        )


class StartSessionSerializer(serializers.Serializer):
    skip = serializers.BooleanField(required=False, default=False)

    def create(self, validated_data):
        user = self.context["request"].user
        skip = validated_data.get("skip", False)
        session = UserPreferenceSession.objects.create(
            user=user,
            skipped=skip,
            completed=False,
        )
        return session


class AnswerSubmitSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer_id = serializers.IntegerField()
    session_id = serializers.IntegerField(required=False)

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user

        session_id = attrs.get("session_id")
        if session_id:
            try:
                session = UserPreferenceSession.objects.get(
                    id=session_id, user=user
                )
            except UserPreferenceSession.DoesNotExist:
                raise serializers.ValidationError("Invalid session_id")
        else:
            session = (
                UserPreferenceSession.objects
                .filter(user=user, completed=False, skipped=False)
                .order_by("-created_at")
                .first()
            )
            if not session:
                session = UserPreferenceSession.objects.create(user=user)

        if session.completed or session.skipped:
            raise serializers.ValidationError("Session is already finalized")

        attrs["session"] = session

        try:
            question = Question.objects.get(id=attrs["question_id"], is_active=True)
        except Question.DoesNotExist:
            raise serializers.ValidationError("Invalid question_id")

        try:
            answer = AnswerChoice.objects.get(
                id=attrs["answer_id"], question=question
            )
        except AnswerChoice.DoesNotExist:
            raise serializers.ValidationError("Invalid answer_id for question")

        attrs["question"] = question
        attrs["answer"] = answer

        if UserAnswer.objects.filter(session=session, question=question).exists():
            raise serializers.ValidationError("Question already answered in this session")

        return attrs

    def create(self, validated_data):
        session = validated_data["session"]
        question = validated_data["question"]
        answer = validated_data["answer"]
        ua = UserAnswer.objects.create(
            session=session,
            question=question,
            answer=answer,
        )
        return ua


class FinishSessionSerializer(serializers.Serializer):
    session_id = serializers.IntegerField(required=False)

    def validate(self, attrs):
        user = self.context["request"].user
        session_id = attrs.get("session_id")
        if session_id:
            try:
                session = UserPreferenceSession.objects.get(
                    id=session_id, user=user
                )
            except UserPreferenceSession.DoesNotExist:
                raise serializers.ValidationError("Invalid session_id")
        else:
            session = (
                UserPreferenceSession.objects
                .filter(user=user, completed=False, skipped=False)
                .order_by("-created_at")
                .first()
            )
            if not session:
                raise serializers.ValidationError("No active session to finish")
        if not session.answers.exists():
            raise serializers.ValidationError("Cannot finish empty session")
        attrs["session"] = session
        return attrs

    def create(self, validated_data):
        session: UserPreferenceSession = validated_data["session"]
        session.completed = True
        session.skipped = False
        session.save(update_fields=["completed", "skipped", "updated_at"])
        scores, tags = finalize_session_scoring(session)
        return {"session": session, "scores": scores, "tags": tags}


class UpdateAnswerSerializer(serializers.Serializer):
    session_id = serializers.IntegerField()
    question_id = serializers.IntegerField()
    answer_id = serializers.IntegerField()

    def validate(self, attrs):
        user = self.context["request"].user
        try:
            session = UserPreferenceSession.objects.get(
                id=attrs["session_id"], user=user
            )
        except UserPreferenceSession.DoesNotExist:
            raise serializers.ValidationError("Invalid session_id")
        try:
            question = Question.objects.get(id=attrs["question_id"])
        except Question.DoesNotExist:
            raise serializers.ValidationError("Invalid question_id")
        try:
            answer = AnswerChoice.objects.get(
                id=attrs["answer_id"], question=question
            )
        except AnswerChoice.DoesNotExist:
            raise serializers.ValidationError("Invalid answer_id for question")
        attrs["session"] = session
        attrs["question"] = question
        attrs["answer"] = answer
        return attrs

    def create(self, validated_data):
        session: UserPreferenceSession = validated_data["session"]
        question = validated_data["question"]
        answer = validated_data["answer"]
        ua, _ = UserAnswer.objects.update_or_create(
            session=session,
            question=question,
            defaults={"answer": answer},
        )
        if session.completed and not session.skipped:
            finalize_session_scoring(session)
        return ua


class AspectScoreSerializer(serializers.ModelSerializer):
    aspect_code = serializers.CharField(source="aspect.code")
    aspect_name = serializers.CharField(source="aspect.name")

    class Meta:
        model = AspectScore
        fields = ("aspect_code", "aspect_name", "score")


class PreferenceProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferenceProfile
        fields = (
            "answers",
            "location_score",
            "financial_score",
            "pedagogical_score",
            "infrastructure_score",
            "primary_priority",
            "completed",
            "skipped",
        )

