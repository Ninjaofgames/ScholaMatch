import logging
import smtplib
from django.core.mail import get_connection
from django.conf import settings

from .email_renderer import render_email_html, render_email_text

logger = logging.getLogger(__name__)

VERIFICATION_CODE_MINUTES = 10
USE_CONSOLE_FALLBACK = getattr(settings, 'USE_CONSOLE_EMAIL_FALLBACK', True)


def _get_mail_connection():
    if settings.EMAIL_BACKEND != 'django.core.mail.backends.smtp.EmailBackend':
        return get_connection(backend=settings.EMAIL_BACKEND)
    conn_kw = dict(
        backend=settings.EMAIL_BACKEND,
        host=settings.EMAIL_HOST,
        port=settings.EMAIL_PORT,
        username=settings.EMAIL_HOST_USER,
        password=settings.EMAIL_HOST_PASSWORD,
        fail_silently=False,
        timeout=getattr(settings, 'EMAIL_TIMEOUT', 60),
    )
    conn_kw['use_tls'] = getattr(settings, 'EMAIL_USE_TLS', True)
    conn_kw['use_ssl'] = getattr(settings, 'EMAIL_USE_SSL', False)
    return get_connection(**conn_kw)


def _console_fallback(subject, recipient_list, code):
    sep = '\n' + '-' * 40 + '\n'
    message = f'Your code is: {code}\n\nThis code expires in 10 minutes.'
    console_msg = (
        f'{sep}CONSOLE EMAIL (SMTP failed - printed for dev){sep}'
        f'To: {recipient_list}\nSubject: {subject}\n\n{message}{sep}'
    )
    print(console_msg)
    logger.warning('Email printed to console (SMTP unavailable): %s', recipient_list)


def _send_with_fallback(subject, template_name, context, recipient_list, from_email):
    try:
        from django.core.mail import EmailMultiAlternatives
        from .email_renderer import render_email_html, render_email_text

        html_content = render_email_html(template_name, context)
        text_content = render_email_text(html_content)
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=from_email,
            to=recipient_list,
        )
        msg.attach_alternative(html_content, 'text/html')
        msg.connection = _get_mail_connection()
        return msg.send() > 0
    except (TimeoutError, OSError, smtplib.SMTPException) as e:
        logger.error('SMTP failed: %s', e)
        if USE_CONSOLE_FALLBACK:
            _console_fallback(subject, recipient_list, context.get('code', ''))
            return True
        raise
    except Exception as e:
        logger.error('Email send failed: %s', e, exc_info=True)
        if USE_CONSOLE_FALLBACK:
            _console_fallback(subject, recipient_list, context.get('code', ''))
            return True
        raise


def test_email_connection():
    if settings.EMAIL_BACKEND != 'django.core.mail.backends.smtp.EmailBackend':
        return True, 'Using console backend (no SMTP)'
    try:
        conn = _get_mail_connection()
        conn.open()
        conn.close()
        logger.info('SMTP connection test succeeded')
        return True, 'SMTP connection OK'
    except (TimeoutError, OSError) as e:
        msg = f'SMTP connection failed: {e}. Using console fallback when sending.'
        logger.warning(msg)
        return False, msg
    except Exception as e:
        msg = f'SMTP test failed: {type(e).__name__}: {e}'
        logger.error(msg)
        return False, msg


def send_verification_email(email, code):
    subject = 'ScholaMatch — Verify your email'
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@scholamatch.com')
    logger.info('Sending verification email to %s', email)
    try:
        return _send_with_fallback(
            subject,
            'accounts/emails/verification_email.html',
            {'code': code},
            [email],
            from_email,
        )
    except Exception:
        return False


def send_password_reset_email(email, code):
    subject = 'ScholaMatch — Reset Password'
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@scholamatch.com')
    logger.info('Sending password reset email to %s', email)
    try:
        return _send_with_fallback(
            subject,
            'accounts/emails/password_reset_email.html',
            {'code': code},
            [email],
            from_email,
        )
    except Exception:
        return False


def send_admin_password_reset_email(email, code):
    subject = 'ScholaMatch Admin — Reset Password'
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@scholamatch.com')
    logger.info('Sending admin password reset email to %s', email)
    try:
        return _send_with_fallback(
            subject,
            'accounts/emails/admin_password_reset_email.html',
            {'code': code},
            [email],
            from_email,
        )
    except Exception:
        return False
