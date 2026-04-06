from django.template.loader import render_to_string
from django.utils.html import strip_tags


def render_email_html(template_name, context):
    """Render HTML email from template."""
    return render_to_string(template_name, context)


def render_email_text(html_content):
    """Strip HTML for plain-text fallback."""
    return strip_tags(html_content).replace('\n\n\n', '\n\n').strip()


def send_html_email(subject, template_name, context, recipient_list, from_email):
    """
    Send email with HTML and plain-text fallback.
    Returns (success: bool).
    """
    from django.core.mail import EmailMultiAlternatives
    html_content = render_email_html(template_name, context)
    text_content = render_email_text(html_content)
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=from_email,
        to=recipient_list,
    )
    msg.attach_alternative(html_content, 'text/html')
    return msg.send() > 0