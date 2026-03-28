from rest_framework import generics, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, F, ExpressionWrapper, FloatField
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import School, Comment
from .serializers import SchoolListSerializer, SchoolDetailSerializer, CommentSerializer
from .services.llm_service import (
    classify_sentiment,
    calculate_sentiment_score,
    generate_ai_recommendation,
    extract_search_keywords,
    analyze_review_aspects,
    update_school_aspect_scores,
    parse_search_query,
)

class SchoolListAPIView(generics.ListAPIView):
    serializer_class = SchoolListSerializer
    
    def list(self, request, *args, **kwargs):
        query = request.query_params.get('q', '').strip()
        active_filters = [f.strip() for f in request.query_params.getlist('filter') if f.strip()]
        queryset = School.objects.all()
        search_mode = None

        if active_filters:
            filter_q = Q()
            for f_val in active_filters:
                filter_q |= Q(comments__text__icontains=f_val)
            queryset = queryset.filter(filter_q).distinct()
            search_mode = 'filter'

        elif query:
            # Basic field search fallback
            basic_matches = queryset.filter(
                Q(name__icontains=query) | 
                Q(location__icontains=query) |
                Q(keywords__icontains=query)
            )

            # LLM parse
            aspect_filters = parse_search_query(query)
            active_aspects = {k: v for k, v in aspect_filters.items() if v is not None}

            if active_aspects:
                keywords = extract_search_keywords(query)
                comment_q = Q()
                for kw in keywords:
                    comment_q |= Q(comments__text__icontains=kw)

                aspect_q = Q()
                for aspect, sentiment in active_aspects.items():
                    field = f'{aspect}_score'
                    if sentiment == 'positive':
                        aspect_q |= Q(**{f'{field}__gt': 0})
                    else:
                        aspect_q |= Q(**{f'{field}__lt': 0})

                queryset = queryset.filter(
                    Q(id__in=aspect_q) | 
                    Q(id__in=basic_matches) |
                    Q(comments__id__in=Comment.objects.filter(comment_q))
                ).distinct()

                # Ranking
                score_expr = None
                for aspect in active_aspects:
                    field_expr = ExpressionWrapper(F(f'{aspect}_score'), output_field=FloatField())
                    score_expr = field_expr if score_expr is None else score_expr + field_expr
                if score_expr is not None:
                    queryset = queryset.annotate(
                        relevance_score=ExpressionWrapper(score_expr, output_field=FloatField())
                    ).order_by('-relevance_score', 'name')
                
                search_mode = 'smart'
            else:
                keywords = extract_search_keywords(query)
                comment_q = Q()
                for kw in keywords:
                    comment_q |= Q(comments__text__icontains=kw)
                
                if comment_q:
                    queryset = queryset.filter(
                        Q(id__in=basic_matches) |
                        Q(comments__id__in=Comment.objects.filter(comment_q))
                    ).distinct()
                    search_mode = 'smart'
                else:
                    queryset = basic_matches
                    search_mode = 'basic'

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'search_mode': search_mode
        })

class SchoolDetailAPIView(generics.RetrieveAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolDetailSerializer

@method_decorator(csrf_exempt, name='dispatch')
class SchoolCommentsAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    
    def get_queryset(self):
        school_id = self.kwargs['pk']
        return Comment.objects.filter(school_id=school_id)
        
    def perform_create(self, serializer):
        school_id = self.kwargs['pk']
        school = School.objects.get(id=school_id)
        text = serializer.validated_data.get('text', '')
        
        if text:
            # 1. Classify overall sentiment
            sentiment = classify_sentiment(text)
            # 2. Run Aspect-Based Sentiment Analysis
            aspect_scores = analyze_review_aspects(text)
            
            # Save the comment with AI analyzed scores
            comment = serializer.save(
                school=school,
                sentiment=sentiment,
                teachers_score=aspect_scores.get('teachers', 0),
                facilities_score=aspect_scores.get('facilities', 0),
                administration_score=aspect_scores.get('administration', 0),
                affordability_score=aspect_scores.get('affordability', 0),
            )
            
            # Recalculate school sentiment score
            school.sentiment_score = calculate_sentiment_score(school)
            school.save(update_fields=['sentiment_score'])
            
            # Update school aspect score averages
            update_school_aspect_scores(school)
            
            # Regenerate AI recommendation
            recommendation = generate_ai_recommendation(school)
            if recommendation:
                school.ai_recommendation = recommendation
                school.save(update_fields=['ai_recommendation'])
