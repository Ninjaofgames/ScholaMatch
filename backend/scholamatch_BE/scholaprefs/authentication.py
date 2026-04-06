from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from Admin.models import User as AdminUser
from django.contrib.auth import get_user_model

AuthUser = get_user_model()

class CustomTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header: return None
        parts = auth_header.split()
        if len(parts) != 2: return None
        prefix, token = parts[0].lower(), parts[1]
        if prefix not in ['token', 'bearer']: return None
        
        user_id = None
        if token.startswith('admin-'): user_id = token.replace('admin-', '')
        elif token.startswith('user-'): user_id = token.replace('user-', '')
        else:
            from rest_framework.authtoken.models import Token
            try:
                dt = Token.objects.get(key=token)
                return (dt.user, dt)
            except: return None

        if user_id:
            try:
                au = AdminUser.objects.get(id_user=user_id)
                u, _ = AuthUser.objects.get_or_create(email=au.email, defaults={'username': au.email, 'first_name': au.prenom, 'last_name': au.nom})
                return (u, None)
            except AdminUser.DoesNotExist: raise AuthenticationFailed('User not found')
        return None

    def authenticate_header(self, request): return 'Token'
