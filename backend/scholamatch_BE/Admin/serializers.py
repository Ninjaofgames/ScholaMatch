from rest_framework import serializers
from .models import Comment, Aspect, Analysis, SchoolComment
from django.db import connection
from .llm_service import extract_aspects_with_polarity

class AspectSerializer(serializers.Serializer):
    aspect = serializers.CharField()
    polarity = serializers.ChoiceField(choices=['positive', 'negative', 'neutral'])

class CommentSerializer(serializers.ModelSerializer):
    aspects = AspectSerializer(many=True, write_only=True, required=False)
    school_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Comment
        fields = ['comment_content', 'data_source', 'comment_date', 'aspects', 'school_id']
        read_only_fields = ['comment_date']

    def create(self, validated_data):
        aspects_data = validated_data.pop('aspects', [])
        school_id = validated_data.pop('school_id', None)

        if not aspects_data:
            # Generate aspects via LLM if not supplied by the frontend
            aspects_data = extract_aspects_with_polarity(validated_data['comment_content'])

        npos = 0
        nneg = 0
        for item in aspects_data:
            if item['polarity'] == 'positive':
                npos += 1
            elif item['polarity'] == 'negative':
                nneg += 1

        # Score formula: (npos - nneg) / total
        if aspects_data:
            score = round((npos - nneg) / len(aspects_data), 2)
        else:
            score = 0.0

        if npos > nneg:
            label = 'positive'
        elif nneg > npos:
            label = 'negative'
        else:
            label = 'neutral'

        comment = Comment.objects.create(
            comment_content=validated_data['comment_content'],
            data_source=validated_data.get('data_source', self.context['request'].user.username),
            sentiment_score=score,
            sentiment_label=label,
        )

        if school_id:
            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO school_comment (id_ecole, id_comment) VALUES (%s, %s)",
                    [school_id, comment.id_comment]
                )

        for item in aspects_data:
            aspect, _ = Aspect.objects.get_or_create(aspect_name=item['aspect'])
            Analysis.objects.create(
                id_comment=comment,
                id_aspect=aspect,
                polarity=item['polarity'],
            )

        return comment
