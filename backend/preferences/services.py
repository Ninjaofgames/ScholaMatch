from collections import defaultdict
from typing import Dict, Tuple

from django.db import transaction

from .models import (
    UserPreferenceSession,
    AspectScore,
    Aspect,
    Question,
    UserPreferenceProfile,
    UserAnswer,
)


def _compute_raw_aspect_scores(session: UserPreferenceSession) -> Dict[int, float]:
    scores = defaultdict(float)
    answers = session.answers.select_related("question__aspect", "answer")
    for ua in answers:
        question = ua.question
        answer = ua.answer
        if not question.aspect:
            continue
        contribution = (
            answer.value_score * question.weight * answer.weight_modifier
        )
        scores[question.aspect_id] += contribution
    return scores


def _compute_aspect_max_scores() -> Dict[int, float]:
    max_scores: Dict[int, float] = defaultdict(float)
    questions = (
        Question.objects
        .select_related("aspect")
        .prefetch_related("choices")
        .filter(is_active=True, aspect__isnull=False)
    )
    for q in questions:
        if not q.aspect or not q.choices.exists():
            continue
        best_choice = max(
            q.choices.all(),
            key=lambda c: c.value_score * c.weight_modifier,
        )
        max_scores[q.aspect_id] += (
            best_choice.value_score * best_choice.weight_modifier * q.weight
        )
    for aspect_id, value in max_scores.items():
        if value <= 0:
            max_scores[aspect_id] = 1.0
    return max_scores


_ASPECT_MAX_CACHE: Dict[int, float] | None = None


def _get_aspect_max_scores() -> Dict[int, float]:
    global _ASPECT_MAX_CACHE
    if _ASPECT_MAX_CACHE is None:
        _ASPECT_MAX_CACHE = _compute_aspect_max_scores()
    return _ASPECT_MAX_CACHE


def _normalize_scores(raw_scores: Dict[int, float]) -> Dict[int, float]:
    max_scores = _get_aspect_max_scores()
    normalized: Dict[int, float] = {}
    for aspect_id, raw in raw_scores.items():
        max_raw = max_scores.get(aspect_id) or 1.0
        normalized[aspect_id] = max(0.0, min(100.0, (raw / max_raw) * 100.0))
    return normalized


def _tags_from_scores(scores_by_code: Dict[str, float]) -> Dict[str, str]:
    tags: Dict[str, str] = {}
    for code, score in scores_by_code.items():
        if score >= 80:
            label = "High"
        elif score >= 50:
            label = "Medium"
        else:
            label = "Low"
        tags[code] = label
    return tags


@transaction.atomic
def finalize_session_scoring(
    session: UserPreferenceSession,
) -> Tuple[Dict[str, float], Dict[str, str]]:
    if session.skipped:
        return {}, {}

    raw_scores = _compute_raw_aspect_scores(session)
    norm_by_id = _normalize_scores(raw_scores)

    # persist AspectScore
    session.aspect_scores.all().delete()
    aspect_map = {a.id: a for a in Aspect.objects.all()}
    for aspect_id, value in norm_by_id.items():
        aspect = aspect_map.get(aspect_id)
        if not aspect:
            continue
        AspectScore.objects.create(
            session=session,
            aspect=aspect,
            score=value,
        )

    scores_by_code: Dict[str, float] = {}
    for aspect_id, value in norm_by_id.items():
        aspect = aspect_map.get(aspect_id)
        if aspect:
            scores_by_code[aspect.code] = value

    tags = _tags_from_scores(scores_by_code)

    # snapshot on profile
    answers_snapshot = {
        ua.question.code: ua.answer_id
        for ua in session.answers.select_related("question")
    }

    primary_priority = ""
    try:
        q10 = Question.objects.get(code="Q10")
        ua = UserAnswer.objects.get(session=session, question=q10)
        primary_priority = ua.answer.text
    except (Question.DoesNotExist, UserAnswer.DoesNotExist):
        primary_priority = ""

    profile, _ = UserPreferenceProfile.objects.get_or_create(user=session.user)
    profile.latest_session = session
    profile.answers = answers_snapshot
    profile.completed = session.completed
    profile.skipped = session.skipped
    profile.location_score = scores_by_code.get("location", 0.0)
    profile.financial_score = scores_by_code.get("financial", 0.0)
    profile.pedagogical_score = scores_by_code.get("pedagogical", 0.0)
    profile.infrastructure_score = scores_by_code.get("infrastructure", 0.0)
    profile.primary_priority = primary_priority
    profile.save(
        update_fields=[
            "latest_session",
            "answers",
            "completed",
            "skipped",
            "location_score",
            "financial_score",
            "pedagogical_score",
            "infrastructure_score",
            "primary_priority",
            "updated_at",
        ]
    )

    return scores_by_code, tags

