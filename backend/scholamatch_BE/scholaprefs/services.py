from .models import UserPreferenceProfile, UserAnswer, PreferenceCategory
from django.db.models import Sum

def finalize_session_scoring(session):
    # Calculate scores for each category
    answers = UserAnswer.objects.filter(session=session).select_related('answer', 'answer__category')
    
    cat_scores = {}
    for choice in answers:
        cat_name = choice.answer.category.name.lower()
        weight = choice.answer.weight
        cat_scores[cat_name] = cat_scores.get(cat_name, 0) + weight

    # Max possible base weights (without Q10 multiplier)
    # Location: Q3(1.0) + Q4(2.0) = 3.0
    # Financial: Q5(2.0) + Q6(1.5) = 3.5
    # Pedagogical: Q7(2.0) = 2.0
    # Infrastructure: Q8(2.0) = 2.0
    # Priority (Q10) adds 5.0 to one of them.

    profile, _ = UserPreferenceProfile.objects.get_or_create(user=session.user)
    
    # Normalize: if priority is selected, it should push the score significantly towards 100
    # Each base point is roughly 10-15%, Priority adds 50%
    
    profile.location_score = min(cat_scores.get('location', 0) * 12, 100)
    profile.financial_score = min(cat_scores.get('financial', 0) * 12, 100)
    profile.pedagogical_score = min(cat_scores.get('pedagogical', 0) * 12, 100)
    profile.infrastructure_score = min(cat_scores.get('infrastructure', 0) * 12, 100)
    
    profile.has_completed = True
    profile.save()

    tags = []
    if profile.location_score >= 80: tags.append("City Explorer")
    if profile.financial_score >= 80: tags.append("Scholarship Focused")
    if profile.pedagogical_score >= 80: tags.append("Academic Driven")
    if profile.infrastructure_score >= 80: tags.append("Modern Campus Preference")
    
    return cat_scores, tags
