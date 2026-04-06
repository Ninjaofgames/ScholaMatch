from rest_framework import serializers
from .models import Comment, Aspect, Analysis, SchoolComment, PersonalityTest, TestQuestion, Choice, SessionTest, ResponseTest

class AspectSerializer(serializers.Serializer):
    aspect = serializers.CharField()
    polarity = serializers.ChoiceField(choices=['positive', 'negative', 'neutral'])

class CommentSerializer(serializers.ModelSerializer):
    aspects = AspectSerializer(many=True, write_only=True)
    school_id = serializers.IntegerField(write_only=True, required=False)
    class Meta:
        model = Comment
        fields = ['comment_content', 'data_source', 'comment_date', 'aspects', 'school_id']
        read_only_fields = ['comment_date']
    def create(self, validated_data):
        aspects_data = validated_data.pop('aspects')
        school_id = validated_data.pop('school_id', None)
        npos = 0
        nneg = 0
        for item in aspects_data:
            if item['polarity'] == 'positive':
                npos += 1
            elif item['polarity'] == 'negative':
                nneg += 1
        #Score formula: npos - nneg / len(aspects_data):
        score = round((npos - nneg) / len(aspects_data), 2)
        if score > 0:
            label = 'positive'
        elif score < 0:
            label = 'negative'
        else:
            label = 'neutral'
        comment = Comment.objects.create(
            comment_content=validated_data['comment_content'],
            data_source=validated_data.get('data_source', 'manual'),
            sentiment_score=score,
            sentiment_label=label,
        )
        if school_id:
            SchoolComment.objects.create(
                id_school=school_id,
                id_comment=comment,
            )
        for item in aspects_data:
            aspect, _ = Aspect.objects.get_or_create(aspect_name=item['aspect'])
            Analysis.objects.create(
                id_comment=comment,
                id_aspect=aspect,
                polarity=item['polarity'],
            )
        return comment

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id_choice', 'content', 'id_question']

class TestQuestionSerializer(serializers.ModelSerializer):
    # Depending on model relations we use '_set' if related_name is not provided.
    choices = ChoiceSerializer(source='choice_set', many=True, read_only=True)
    
    class Meta:
        model = TestQuestion
        fields = ['id_question', 'question_content', 'choices']

class PersonalityTestSerializer(serializers.ModelSerializer):
    questions = TestQuestionSerializer(source='testquestion_set', many=True, read_only=True)
    
    class Meta:
        model = PersonalityTest
        fields = ['id_test', 'criteria', 'questions']
