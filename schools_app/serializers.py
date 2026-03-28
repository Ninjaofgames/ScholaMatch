from rest_framework import serializers
from .models import School, Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'username', 'text', 'sentiment', 'created_at']

class SchoolListSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = School
        fields = ['id', 'name', 'thumbnail_url', 'rating', 'review_count', 'location']
        
    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None

class SchoolDetailSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()
    funding_type_display = serializers.CharField(source='get_funding_type_display', read_only=True)
    education_level_display = serializers.CharField(source='get_education_level_display', read_only=True)
    programs_list = serializers.ListField(source='get_programs_list', read_only=True)
    ai_recommendation_list = serializers.ListField(source='get_ai_recommendation_list', read_only=True)
    keywords_list = serializers.ListField(source='get_keywords_list', read_only=True)
    aspectPositivity = serializers.SerializerMethodField()

    class Meta:
        model = School
        fields = [
            'id', 'name', 'thumbnail_url', 'website_link', 'location_link', 
            'location', 'mail', 'phone', 'university_name', 'funding_type_display', 
            'education_level_display', 'recommended_for', 'description', 
            'rating', 'review_count', 'sentiment_score', 'programs_list', 
            'ai_recommendation_list', 'keywords_list', 'aspectPositivity'
        ]

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None
        
    def get_aspectPositivity(self, obj):
        # Convert -1.0/1.0 float scores to 0-100 percentage for UI pie charts
        def to_pct(score):
            # Map -1.0 to 1.0 -> 0 to 100
            # score + 1.0 -> 0.0 to 2.0 -> / 2.0 -> 0.0 to 1.0 -> * 100
            val = (score + 1.0) / 2.0 * 100
            return int(max(0, min(100, val)))
            
        return {
            'teachers': to_pct(obj.teachers_score),
            'facilities': to_pct(obj.facilities_score),
            'administration': to_pct(obj.administration_score),
            'affordability': to_pct(obj.affordability_score)
        }
