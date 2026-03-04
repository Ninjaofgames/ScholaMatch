from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['comment_content', 'sentiment_label', 'sentiment_score', 'data_source', 'comment_date']