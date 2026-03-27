"""
LLM Service — Ollama integration for sentiment classification,
aspect-based sentiment analysis, sentiment score calculation,
AI recommendation generation, and smart search query parsing.

Uses the local Ollama server with the Llama3 model.
"""
import json
import logging
from decimal import Decimal

import ollama
from django.db.models import Avg

logger = logging.getLogger(__name__)

# Valid sentiment labels
VALID_SENTIMENTS = {'good', 'bad', 'neutral'}

# Possible keys the LLM might use in its JSON response
_EXPECTED_KEYS = ('sentiment', 'classification', 'label', 'result', 'category')

# Aspect names used throughout the system
ASPECTS = ('teachers', 'facilities', 'administration', 'affordability')

# Default model to use
MODEL_NAME = 'llama3'


# ═══════════════════════════════════════════════════════
#  Sentiment Classification
# ═══════════════════════════════════════════════════════

def _build_prompt(review_text: str) -> str:
    """Build the strict sentiment-classification prompt."""
    return (
        'You are a sentiment classifier.\n\n'
        'Classify the following review as:\n'
        '- good (positive opinion)\n'
        '- bad (negative opinion)\n'
        '- neutral (mixed or unclear opinion)\n\n'
        'Rules:\n'
        '- Return ONLY valid JSON with the key "sentiment"\n'
        '- The value must be exactly one of: good, bad, neutral\n'
        '- Do not explain anything\n'
        '- If the review contains both positive and negative opinions, classify as neutral\n\n'
        'Expected format: {"sentiment": "good"}\n\n'
        f'Review:\n"{review_text}"\n'
    )


def _extract_sentiment(data: dict) -> str | None:
    """Extract the sentiment value from the LLM JSON response."""
    for key in _EXPECTED_KEYS:
        value = data.get(key, '')
        if isinstance(value, str):
            value = value.strip().lower()
            if value in VALID_SENTIMENTS:
                return value

    for value in data.values():
        if isinstance(value, str):
            value = value.strip().lower()
            if value in VALID_SENTIMENTS:
                return value

    return None


def classify_sentiment(review_text: str) -> str:
    """
    Classify a single review comment via Ollama (Llama3).
    Returns one of "good", "bad", or "neutral". Falls back to "neutral" on error.
    """
    if not review_text or not review_text.strip():
        return 'neutral'

    try:
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[
                {
                    'role': 'user',
                    'content': _build_prompt(review_text),
                }
            ],
            format='json',
        )

        raw_content = response['message']['content']
        data = json.loads(raw_content)
        sentiment = _extract_sentiment(data)

        if sentiment:
            return sentiment

        logger.warning(
            'LLM returned unexpected JSON structure: %s — falling back to neutral',
            raw_content,
        )
        return 'neutral'

    except json.JSONDecodeError as exc:
        logger.error('Failed to parse LLM JSON response: %s', exc)
        return 'neutral'
    except Exception as exc:  # noqa: BLE001
        logger.error('LLM service error: %s', exc)
        return 'neutral'


# ═══════════════════════════════════════════════════════
#  Aspect-Based Sentiment Analysis
# ═══════════════════════════════════════════════════════

_SENTIMENT_TO_SCORE = {'positive': 1, 'neutral': 0, 'negative': -1}
_ASPECT_FALLBACK = {aspect: 0 for aspect in ASPECTS}


def _build_aspect_prompt(review_text: str) -> str:
    """Build the ABSA prompt that returns per-aspect sentiment."""
    return (
        'Analyze the following school review and return ONLY JSON with these keys:\n'
        '{"teachers": "positive | negative | neutral", '
        '"facilities": "positive | negative | neutral", '
        '"administration": "positive | negative | neutral", '
        '"affordability": "positive | negative | neutral"}\n\n'
        'Rules:\n'
        '- Return ONLY the JSON object, no explanation\n'
        '- If an aspect is not mentioned in the review, return "neutral"\n'
        '- Values must be exactly one of: positive, negative, neutral\n\n'
        f'Review:\n"{review_text}"\n'
    )


def analyze_review_aspects(review_text: str) -> dict:
    """
    Run Aspect-Based Sentiment Analysis on a review via Ollama.

    Returns a dict of integer scores for each aspect:
        {"teachers": 1, "facilities": 0, "administration": -1, "affordability": 0}
    where: positive=1, neutral=0, negative=-1.
    Falls back to all-zeros on any error.
    """
    if not review_text or not review_text.strip():
        return dict(_ASPECT_FALLBACK)

    try:
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[{'role': 'user', 'content': _build_aspect_prompt(review_text)}],
            format='json',
        )

        raw_content = response['message']['content']
        data = json.loads(raw_content)

        scores = {}
        for aspect in ASPECTS:
            raw_val = data.get(aspect, 'neutral')
            if isinstance(raw_val, str):
                raw_val = raw_val.strip().lower()
            scores[aspect] = _SENTIMENT_TO_SCORE.get(raw_val, 0)

        return scores

    except json.JSONDecodeError as exc:
        logger.error('ABSA: failed to parse JSON: %s', exc)
        return dict(_ASPECT_FALLBACK)
    except Exception as exc:  # noqa: BLE001
        logger.error('ABSA: LLM error: %s', exc)
        return dict(_ASPECT_FALLBACK)


# ═══════════════════════════════════════════════════════
#  School Aggregated Aspect Score Update
# ═══════════════════════════════════════════════════════

def update_school_aspect_scores(school) -> None:
    """
    Recompute the school's four aspect score averages from all its comments
    and save them in a single DB write.

    Called after each new comment is added to the school.
    """
    agg = school.comments.aggregate(
        avg_teachers=Avg('teachers_score'),
        avg_facilities=Avg('facilities_score'),
        avg_administration=Avg('administration_score'),
        avg_affordability=Avg('affordability_score'),
    )

    school.teachers_score = agg['avg_teachers'] or 0.0
    school.facilities_score = agg['avg_facilities'] or 0.0
    school.administration_score = agg['avg_administration'] or 0.0
    school.affordability_score = agg['avg_affordability'] or 0.0

    school.save(update_fields=[
        'teachers_score',
        'facilities_score',
        'administration_score',
        'affordability_score',
    ])


# ═══════════════════════════════════════════════════════
#  Sentiment Score Calculation
# ═══════════════════════════════════════════════════════

def calculate_sentiment_score(school) -> Decimal:
    """
    Compute the sentiment score for a school as a percentage (0–100).
    Formula: (good_count / total_count) * 100
    Returns 0 if there are no comments.
    """
    comments = school.comments.all()
    total = comments.count()

    if total == 0:
        return Decimal('0.0')

    good_count = comments.filter(sentiment='good').count()
    score = (good_count / total) * 100
    return Decimal(str(round(score, 1)))


# ═══════════════════════════════════════════════════════
#  AI Recommendation Generation
# ═══════════════════════════════════════════════════════

def _build_recommendation_prompt(school) -> str:
    """Build a prompt for AI recommendation bullet points."""
    info_parts = [f'School name: {school.name}']
    if school.location:
        info_parts.append(f'Location: {school.location}')
    if school.programs:
        info_parts.append(f'Programs: {school.programs}')
    if school.tuition:
        info_parts.append(f'Tuition: {school.tuition}')
    if school.acceptance_rate:
        info_parts.append(f'Acceptance rate: {school.acceptance_rate}')
    if school.student_count:
        info_parts.append(f'Student count: {school.student_count}')
    if school.ranking:
        info_parts.append(f'Ranking: {school.ranking}')
    if school.job_acceptance_rate:
        info_parts.append(f'Job acceptance rate: {school.job_acceptance_rate}')
    if school.description:
        info_parts.append(f'Description: {school.description[:300]}')

    school_info = '\n'.join(info_parts)

    recent_comments = school.comments.order_by('-created_at')[:10]
    if recent_comments:
        comment_lines = [f'- [{c.sentiment}] {c.text[:100]}' for c in recent_comments]
        comments_section = '\n'.join(comment_lines)
    else:
        comments_section = 'No student reviews yet.'

    return (
        'You are an educational advisor AI.\n\n'
        'Based on the following school information and student reviews, '
        'generate 4-5 short bullet points explaining why a student might '
        'want to consider this school.\n\n'
        'Rules:\n'
        '- Return ONLY valid JSON with the key "recommendations"\n'
        '- The value must be a list of 4-5 short strings (one sentence each)\n'
        '- Be specific and based on the data provided\n'
        '- If reviews are mostly negative, be honest but constructive\n'
        '- Do not explain anything outside the JSON\n\n'
        'Expected format: {"recommendations": ["Point 1", "Point 2", "Point 3", "Point 4"]}\n\n'
        f'School Information:\n{school_info}\n\n'
        f'Student Reviews:\n{comments_section}\n'
    )


def generate_ai_recommendation(school) -> str:
    """
    Generate AI recommendation bullet points for a school using Ollama.
    Returns a newline-separated string. Falls back to '' on error.
    """
    try:
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[
                {
                    'role': 'user',
                    'content': _build_recommendation_prompt(school),
                }
            ],
            format='json',
        )

        raw_content = response['message']['content']
        data = json.loads(raw_content)

        recommendations = None
        for key in ('recommendations', 'bullet_points', 'points', 'reasons'):
            if key in data and isinstance(data[key], list):
                recommendations = data[key]
                break

        if recommendations is None:
            for value in data.values():
                if isinstance(value, list):
                    recommendations = value
                    break

        if recommendations:
            lines = [str(item).strip() for item in recommendations if item]
            return '\n'.join(lines)

        logger.warning('LLM recommendation response had unexpected structure: %s', raw_content)
        return ''

    except json.JSONDecodeError as exc:
        logger.error('Failed to parse LLM recommendation JSON: %s', exc)
        return ''
    except Exception as exc:  # noqa: BLE001
        logger.error('LLM recommendation error: %s', exc)
        return ''


# ═══════════════════════════════════════════════════════
#  Smart Search — Keyword Extraction (legacy)
# ═══════════════════════════════════════════════════════

def extract_search_keywords(query: str) -> list[str]:
    """
    Extract search keywords from a natural language query using Ollama.
    Falls back to simple word splitting on error.
    """
    if not query or not query.strip():
        return []

    try:
        prompt = (
            'You are a search keyword extractor.\n\n'
            'Given the following user search query about schools, extract '
            '2-5 short keyword phrases that should be searched for in '
            'student review comments.\n\n'
            'Rules:\n'
            '- Return ONLY valid JSON with the key "keywords"\n'
            '- The value must be a list of 2-5 short strings\n'
            '- Each keyword should be 1-3 words\n'
            '- Focus on traits, qualities, and aspects mentioned\n'
            '- Do not include generic words like "good school"\n'
            '- Do not explain anything\n\n'
            'Expected format: {"keywords": ["affordable tuition", "great teachers"]}\n\n'
            f'Search query: "{query}"\n'
        )

        response = ollama.chat(
            model=MODEL_NAME,
            messages=[{'role': 'user', 'content': prompt}],
            format='json',
        )

        raw_content = response['message']['content']
        data = json.loads(raw_content)

        keywords = None
        for key in ('keywords', 'search_terms', 'terms', 'phrases'):
            if key in data and isinstance(data[key], list):
                keywords = data[key]
                break

        if keywords is None:
            for value in data.values():
                if isinstance(value, list):
                    keywords = value
                    break

        if keywords:
            return [str(k).strip().lower() for k in keywords if k and str(k).strip()]

        logger.warning('LLM keyword extraction returned unexpected structure: %s', raw_content)

    except Exception as exc:  # noqa: BLE001
        logger.error('LLM keyword extraction error: %s', exc)

    # Fallback: split by common connectors and filter short words
    fallback_words = []
    for word in query.lower().replace(',', ' ').replace(' and ', ' ').replace(' with ', ' ').split():
        if len(word) > 2 and word not in ('the', 'for', 'good', 'bad', 'school', 'schools'):
            fallback_words.append(word)
    return fallback_words


# ═══════════════════════════════════════════════════════
#  Smart Search — Aspect-Based Query Parser
# ═══════════════════════════════════════════════════════

_VALID_SEARCH_SENTIMENTS = {'positive', 'negative'}
_NULL_SEARCH_RESULT = {aspect: None for aspect in ASPECTS}


def _build_search_query_prompt(query: str) -> str:
    """Build the prompt that converts a natural language query to aspect filters."""
    return (
        'Convert the following school search query into aspect-based filters.\n'
        'Return ONLY JSON with these exact keys:\n'
        '{"teachers": "positive | negative | null", '
        '"facilities": "positive | negative | null", '
        '"administration": "positive | negative | null", '
        '"affordability": "positive | negative | null"}\n\n'
        'Rules:\n'
        '- positive = user wants good quality for that aspect\n'
        '- negative = user wants to avoid bad quality / find cheap options\n'
        '- null = aspect not mentioned in the query\n'
        '- Return ONLY the JSON, no explanation\n\n'
        f'Search query: "{query}"\n'
    )


def parse_search_query(query: str) -> dict:
    """
    Parse a natural language school search query into aspect-based filters.

    Returns a dict like:
        {"teachers": "positive", "facilities": None, "administration": None, "affordability": "positive"}

    Values are "positive", "negative", or None.
    Falls back to all-None dict on any error (no filtering applied).
    """
    if not query or not query.strip():
        return dict(_NULL_SEARCH_RESULT)

    try:
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[{'role': 'user', 'content': _build_search_query_prompt(query)}],
            format='json',
        )

        raw_content = response['message']['content']
        data = json.loads(raw_content)

        result = {}
        for aspect in ASPECTS:
            raw_val = data.get(aspect, 'null')
            if isinstance(raw_val, str):
                raw_val = raw_val.strip().lower()
            if raw_val in _VALID_SEARCH_SENTIMENTS:
                result[aspect] = raw_val
            else:
                result[aspect] = None

        return result

    except json.JSONDecodeError as exc:
        logger.error('Search query parser: failed to parse JSON: %s', exc)
        return dict(_NULL_SEARCH_RESULT)
    except Exception as exc:  # noqa: BLE001
        logger.error('Search query parser: LLM error: %s', exc)
        return dict(_NULL_SEARCH_RESULT)
