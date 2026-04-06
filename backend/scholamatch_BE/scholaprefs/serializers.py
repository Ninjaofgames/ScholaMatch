from rest_framework import serializers
from .models import Question, AnswerChoice, UserPreferenceSession, UserPreferenceProfile

class AnswerChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerChoice
        fields = ['id', 'text', 'weight']

class QuestionSerializer(serializers.ModelSerializer):
    choices = AnswerChoiceSerializer(many=True, read_only=True)
    class Meta:
        model = Question
        fields = ['id', 'text', 'choices', 'order']

class UserPreferenceSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferenceSession
        fields = ['id', 'created_at', 'completed', 'skipped']

class UserPreferenceProfileSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    class Meta:
        model = UserPreferenceProfile
        fields = ['location_score', 'financial_score', 'pedagogical_score', 'infrastructure_score', 'has_completed', 'tags']
    def get_tags(self, obj):
        tags = []
        if obj.location_score >= 70: tags.append("City Lover")
        if obj.financial_score >= 70: tags.append("Budget Conscious")
        if obj.pedagogical_score >= 70: tags.append("Academic Enthusiast")
        if obj.infrastructure_score >= 70: tags.append("Modern Campus Preference")
        return tags
