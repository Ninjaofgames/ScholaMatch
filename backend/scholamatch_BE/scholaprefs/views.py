from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Question, AnswerChoice, UserPreferenceSession, UserAnswer, UserPreferenceProfile
from .serializers import QuestionSerializer, UserPreferenceProfileSerializer, UserPreferenceSessionSerializer
from . import services

class QuestionListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        questions = Question.objects.filter(is_active=True).prefetch_related('choices')
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

class StartSessionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        skip = request.data.get('skip', False)
        session = UserPreferenceSession.objects.create(user=request.user, skipped=skip, completed=skip)
        if skip: services.finalize_session_scoring(session)
        return Response({'session_id': session.id})

class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        question_id, answer_id, session_id = request.data.get('question_id'), request.data.get('answer_id'), request.data.get('session_id')
        if not all([question_id, answer_id, session_id]): return Response({'error': 'Missing parameters'}, status=status.HTTP_400_BAD_REQUEST)
        session = get_object_or_404(UserPreferenceSession, id=session_id, user=request.user)
        question = get_object_or_404(Question, id=question_id)
        answer = get_object_or_404(AnswerChoice, id=answer_id, question=question)
        UserAnswer.objects.update_or_create(session=session, question=question, defaults={'answer': answer})
        return Response({'status': 'success'})

class FinishSessionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        session_id = request.data.get('session_id')
        if not session_id: return Response({'error': 'Missing session_id'}, status=status.HTTP_400_BAD_REQUEST)
        session = get_object_or_404(UserPreferenceSession, id=session_id, user=request.user)
        session.completed = True
        session.save()
        scores, tags = services.finalize_session_scoring(session)
        return Response({'status': 'finished', 'scores': scores, 'tags': tags})

class PreferencesMeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        profile, _ = UserPreferenceProfile.objects.get_or_create(user=request.user)
        active_session = UserPreferenceSession.objects.filter(user=request.user, completed=False, skipped=False).order_by('-created_at').first()
        data = UserPreferenceProfileSerializer(profile).data
        if active_session: data['session'] = UserPreferenceSessionSerializer(active_session).data
        return Response(data)
