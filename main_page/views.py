"""
Views for the main public-facing page.
Displays all schools in a scrollable card grid and individual school detail pages.
"""
from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import Q, F, ExpressionWrapper, FloatField, Value
from django.contrib import messages

from schools_app.models import School, Comment
from schools_app.services.llm_service import (
    classify_sentiment,
    calculate_sentiment_score,
    generate_ai_recommendation,
    extract_search_keywords,
    analyze_review_aspects,
    update_school_aspect_scores,
    parse_search_query,
    ASPECTS,
)


def home(request):
    """
    Homepage — lists all schools with optional search filtering.

    Supports:
    - ?q= : Natural language query → LLM parses aspect intent → filters by
             school aspect scores AND falls back to keyword comment search.
    - ?filter= : Quick-filter chip → searches comment text directly (no LLM).
    """
    query = request.GET.get('q', '').strip()
    active_filters = [f.strip() for f in request.GET.getlist('filter') if f.strip()]
    schools = School.objects.all()
    search_mode = None  # 'basic', 'smart', or 'filter'

    if active_filters:
        # ── Quick-filter: search comments directly (no LLM, supports multiple) ──
        filter_q = Q()
        for f_val in active_filters:
            filter_q |= Q(text__icontains=f_val)

        matching_school_ids = (
            Comment.objects
            .filter(filter_q)
            .values_list('school_id', flat=True)
            .distinct()
        )
        schools = schools.filter(id__in=matching_school_ids)
        search_mode = 'filter'

    elif query:
        # ── Smart search: aspect-score filters + LLM keyword comment search ──

        # 1. Basic field search (fast, no LLM)
        basic_matches = schools.filter(
            Q(name__icontains=query)
            | Q(location__icontains=query)
            | Q(keywords__icontains=query)
        )

        # 2. LLM — parse which aspects the user cares about
        aspect_filters = parse_search_query(query)
        active_aspects = {k: v for k, v in aspect_filters.items() if v is not None}

        if active_aspects:
            # ── Keyword search in comments for this query ──
            keywords = extract_search_keywords(query)
            comment_q = Q()
            for kw in keywords:
                comment_q |= Q(text__icontains=kw)

            comment_school_ids = set()
            if comment_q:
                comment_school_ids = set(
                    Comment.objects
                    .filter(comment_q)
                    .values_list('school_id', flat=True)
                    .distinct()
                )

            # ── Aspect score matches (strictly better than neutral) ──
            aspect_q = Q()
            for aspect, sentiment in active_aspects.items():
                field = f'{aspect}_score'
                if sentiment == 'positive':
                    aspect_q |= Q(**{f'{field}__gt': 0})
                else:  # negative
                    aspect_q |= Q(**{f'{field}__lt': 0})

            aspect_school_ids = set(schools.filter(aspect_q).values_list('id', flat=True))

            # ── UNION: show ALL schools that match any of the three signals ──
            # aspect scores | basic field match | comment keyword match
            combined_ids = (
                aspect_school_ids
                | set(basic_matches.values_list('id', flat=True))
                | comment_school_ids
            )

            # If none of the targeted signals matched, show ALL schools (ranked)
            if not combined_ids:
                combined_ids = set(schools.values_list('id', flat=True))

            schools = schools.filter(id__in=combined_ids)

            # ── Rank: schools with better aspect scores float to top ──
            score_expr = None
            for aspect in active_aspects:
                field_expr = ExpressionWrapper(F(f'{aspect}_score'), output_field=FloatField())
                score_expr = field_expr if score_expr is None else score_expr + field_expr

            if score_expr is not None:
                schools = schools.annotate(
                    relevance_score=ExpressionWrapper(score_expr, output_field=FloatField())
                ).order_by('-relevance_score', 'name')

            search_mode = 'smart'


        else:
            # No aspect intent detected — fall back to LLM keyword + basic search
            keywords = extract_search_keywords(query)
            comment_q = Q()
            for kw in keywords:
                comment_q |= Q(text__icontains=kw)

            if comment_q:
                comment_school_ids = (
                    Comment.objects
                    .filter(comment_q)
                    .values_list('school_id', flat=True)
                    .distinct()
                )
                schools = schools.filter(
                    Q(id__in=basic_matches.values_list('id', flat=True))
                    | Q(id__in=comment_school_ids)
                )
                search_mode = 'smart'
            else:
                schools = basic_matches
                search_mode = 'basic'

    context = {
        'schools': schools,
        'query': query,
        'active_filters': active_filters,
        'search_mode': search_mode,
    }
    return render(request, 'main_page/index.html', context)


def school_detail(request, school_id):
    """
    School detail page — shows all information about a school.
    Handles comment submission via POST.
    On submission the comment is classified by the LLM (overall sentiment +
    aspect scores), then the school's scores are recalculated.
    """
    school = get_object_or_404(School, pk=school_id)

    if request.method == 'POST':
        username = request.POST.get('username', '').strip() or 'Anonymous'
        text = request.POST.get('comment_text', '').strip()
        if text:
            # 1. Classify overall sentiment
            sentiment = classify_sentiment(text)

            # 2. Run Aspect-Based Sentiment Analysis
            aspect_scores = analyze_review_aspects(text)

            # 3. Create the comment with all scores
            Comment.objects.create(
                school=school,
                username=username,
                text=text,
                sentiment=sentiment,
                teachers_score=aspect_scores.get('teachers', 0),
                facilities_score=aspect_scores.get('facilities', 0),
                administration_score=aspect_scores.get('administration', 0),
                affordability_score=aspect_scores.get('affordability', 0),
            )

            # 4. Recalculate school sentiment score
            school.sentiment_score = calculate_sentiment_score(school)

            # 5. Update school aspect score averages
            school.save(update_fields=['sentiment_score'])
            update_school_aspect_scores(school)

            # 6. Regenerate AI recommendation
            recommendation = generate_ai_recommendation(school)
            if recommendation:
                school.ai_recommendation = recommendation
                school.save(update_fields=['ai_recommendation'])

            messages.success(request, 'Comment posted!')
            return redirect('school_detail', school_id=school.id)
        else:
            messages.error(request, 'Comment cannot be empty.')

    comments = school.comments.all()

    # Convert aspect scores (-1.0 to 1.0) → display percentage (0 to 100%)
    def aspect_pct(score):
        return round(((score + 1) / 2) * 100, 1)

    aspect_positivity = {
        'teachers':       aspect_pct(school.teachers_score),
        'facilities':     aspect_pct(school.facilities_score),
        'administration': aspect_pct(school.administration_score),
        'affordability':  aspect_pct(school.affordability_score),
    }

    context = {
        'school': school,
        'comments': comments,
        'aspect_positivity': aspect_positivity,
    }
    return render(request, 'main_page/school_detail.html', context)
