"""
Views for the main public-facing page.
Displays all schools in a scrollable card grid and individual school detail pages.
"""
from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import Q
from django.contrib import messages

from schools_app.models import School, Comment


def home(request):
    """
    Homepage — lists all schools with optional search filtering.
    Supports ?q= query parameter to filter by name, location, or keywords.
    """
    query = request.GET.get('q', '').strip()
    schools = School.objects.all()

    if query:
        schools = schools.filter(
            Q(name__icontains=query)
            | Q(location__icontains=query)
            | Q(keywords__icontains=query)
        )

    context = {
        'schools': schools,
        'query': query,
    }
    return render(request, 'main_page/index.html', context)


def school_detail(request, school_id):
    """
    School detail page — shows all information about a school.
    Handles comment submission via POST.
    """
    school = get_object_or_404(School, pk=school_id)

    if request.method == 'POST':
        username = request.POST.get('username', '').strip() or 'Anonymous'
        text = request.POST.get('comment_text', '').strip()
        if text:
            Comment.objects.create(school=school, username=username, text=text)
            messages.success(request, 'Comment posted!')
            return redirect('school_detail', school_id=school.id)
        else:
            messages.error(request, 'Comment cannot be empty.')

    comments = school.comments.all()

    context = {
        'school': school,
        'comments': comments,
    }
    return render(request, 'main_page/school_detail.html', context)
