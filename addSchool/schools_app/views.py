"""
Views for the School Management admin page.
"""
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse

from .models import School
from .forms import SchoolAddForm, SchoolModifyForm


def admin_page(request):
    """
    Main admin page - displays the Add/Modify/Delete school interface.
    Handles form submissions for all three operations.
    """
    add_form = SchoolAddForm()
    modify_form = SchoolModifyForm()
    
    # Get most recently added school for overview sidebar
    overview_school = School.objects.order_by('-created_at').first()
    
    # Handle Add School form submission
    if request.method == 'POST':
        if 'add_school' in request.POST:
            add_form = SchoolAddForm(request.POST, request.FILES)
            if add_form.is_valid():
                add_form.save()
                messages.success(request, 'School added successfully!')
                return redirect('admin_page')
            else:
                messages.error(request, 'Please fix the errors below.')
        
        elif 'modify_school' in request.POST:
            school_id = request.POST.get('school_id')
            if school_id:
                school = get_object_or_404(School, pk=school_id)
                modify_form = SchoolModifyForm(request.POST, request.FILES, instance=school)
                if modify_form.is_valid():
                    modify_form.save()
                    messages.success(request, f'School "{school.name}" updated successfully!')
                    return redirect('admin_page')
                else:
                    messages.error(request, 'Please fix the errors below.')
            else:
                messages.error(request, 'Please enter a school ID to modify.')
        
        elif 'delete_school' in request.POST:
            school_id = request.POST.get('delete_school_id')
            if school_id:
                school = get_object_or_404(School, pk=school_id)
                school_name = school.name
                school.delete()
                messages.success(request, f'School "{school_name}" deleted successfully!')
                return redirect('admin_page')
            else:
                messages.error(request, 'Please enter a school ID to delete.')
    
    context = {
        'add_form': add_form,
        'modify_form': modify_form,
        'overview_school': overview_school,
    }
    return render(request, 'schools/admin_page.html', context)


def search_school(request):
    """
    API endpoint to search school by ID - returns JSON for AJAX.
    Used when user enters ID in modify section to load school data.
    """
    school_id = request.GET.get('id')
    if not school_id:
        return JsonResponse({'error': 'No ID provided'}, status=400)
    
    try:
        school = School.objects.get(pk=school_id)
        return JsonResponse({
            'id': school.id,
            'name': school.name,
            'website_link': school.website_link or '',
            'location': school.location or '',
            'location_link': school.location_link or '',
            'mail': school.mail or '',
            'phone': school.phone or '',
            'funding_type': school.funding_type,
            'education_level': school.education_level,
            'teaching_language': school.teaching_language,
            'teaching_language_other': school.teaching_language_other or '',
            'university_name': school.university_name or '',
            'keywords': school.keywords or '',
        })
    except School.DoesNotExist:
        return JsonResponse({'error': 'School not found'}, status=404)
