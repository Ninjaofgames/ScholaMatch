# Email Setup

## WinError 10060 (Connection Timeout)

When SMTP times out (smtp.gmail.com port 587), the app now **falls back to console**: the verification/reset code is printed in the terminal where you run `python manage.py runserver`. Check the console output to get the code during development.

## To Fix Real Email Sending

1. **Use Gmail App Password** (not your regular password):
   - Google Account → Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"

2. **Try port 465 with SSL** (if 587 is blocked by firewall/ISP):
   - In `.env`: `EMAIL_PORT=465` and `EMAIL_USE_TLS=false`
   - In `settings.py` you may need `EMAIL_USE_SSL=True` for port 465

3. **Firewall**: Allow Python outbound on ports 587 (or 465)

4. **Disable console fallback** (production): Set `USE_CONSOLE_EMAIL_FALLBACK=false` in `.env`
