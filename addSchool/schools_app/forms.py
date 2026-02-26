"""
Forms for adding, modifying, and deleting schools.
"""
from django import forms
from .models import School


class SchoolAddForm(forms.ModelForm):
    """Form for adding a new school."""
    
    class Meta:
        model = School
        fields = [
            'thumbnail', 'name', 'website_link', 'location', 'location_link',
            'mail', 'phone', 'funding_type', 'education_level', 'teaching_language',
            'teaching_language_other', 'university_name', 'keywords'
        ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Allow empty URL/email - user may leave them blank
        self.fields['website_link'].required = False
        self.fields['location_link'].required = False
        self.fields['mail'].required = False
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': "School's name", 'class': 'form-input'}),
            'website_link': forms.URLInput(attrs={'placeholder': 'Link', 'class': 'form-input'}),
            'location': forms.TextInput(attrs={'placeholder': 'Location', 'class': 'form-input'}),
            'location_link': forms.URLInput(attrs={'placeholder': 'Link', 'class': 'form-input'}),
            'mail': forms.EmailInput(attrs={'placeholder': 'schoolmail@example.com', 'class': 'form-input'}),
            'phone': forms.TextInput(attrs={'placeholder': '+X XXX-XXXXXX', 'class': 'form-input'}),
            'university_name': forms.TextInput(attrs={'placeholder': 'optional', 'class': 'form-input'}),
            'keywords': forms.TextInput(attrs={'placeholder': 'optional (max 4 keywords)', 'class': 'form-input'}),
            'teaching_language_other': forms.TextInput(attrs={'placeholder': 'Specify', 'class': 'form-input'}),
        }


class SchoolModifyForm(forms.ModelForm):
    """Form for modifying an existing school."""
    
    class Meta:
        model = School
        fields = [
            'thumbnail', 'name', 'website_link', 'location', 'location_link',
            'mail', 'phone', 'funding_type', 'education_level', 'teaching_language',
            'teaching_language_other', 'university_name', 'keywords'
        ]
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': "School's name", 'class': 'form-input'}),
            'website_link': forms.URLInput(attrs={'placeholder': 'Link', 'class': 'form-input'}),
            'location': forms.TextInput(attrs={'placeholder': 'Location', 'class': 'form-input'}),
            'location_link': forms.URLInput(attrs={'placeholder': 'Link', 'class': 'form-input'}),
            'mail': forms.EmailInput(attrs={'placeholder': 'schoolmail@example.com', 'class': 'form-input'}),
            'phone': forms.TextInput(attrs={'placeholder': '+X XXX-XXXXXX', 'class': 'form-input'}),
            'university_name': forms.TextInput(attrs={'placeholder': 'optional', 'class': 'form-input'}),
            'keywords': forms.TextInput(attrs={'placeholder': 'optional (max 4 keywords)', 'class': 'form-input'}),
            'teaching_language_other': forms.TextInput(attrs={'placeholder': 'Specify', 'class': 'form-input'}),
        }
