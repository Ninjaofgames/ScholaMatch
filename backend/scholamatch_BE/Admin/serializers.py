from rest_framework import serializers
from .models import Comment, Aspect, Analysis

class AspectSerializer(serializers.Serializer):
    aspect = serializers.CharField()
    polarity = serializers.ChoiceField(choices=['positive', 'negative', 'neutral'])

class CommentSerializer(serializers.ModelSerializer):
    aspects = AspectSerializer(many=True, write_only=True)
    class Meta:
        model = Comment
        fields = ['comment_content', 'data_source', 'comment_date', 'aspects']
        read_only_fields = ['comment_date']
    def create(self, validated_data):
        aspects_data = validated_data.pop('aspects')
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
        for item in aspects_data:
            aspect, _ = Aspect.objects.get_or_create(aspect_name=item['aspect'])
            Analysis.objects.create(
                id_comment=comment,
                id_aspect=aspect,
                polarity=item['polarity'],
            )
        return comment
