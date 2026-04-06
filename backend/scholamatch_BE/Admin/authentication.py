from rest_framework import authentication
from rest_framework import exceptions
from .models import User

class ManualTokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
            return None

        # Extract the token (e.g. 'user-5' or 'admin-7')
        token = auth_header.replace('Token ', '').strip()
        
        # Check for our manual format
        if not (token.startswith('user-') or token.startswith('admin-')):
            return None

        try:
            # Format: 'user-ID'
            parts = token.split('-')
            if len(parts) < 2:
                return None
                
            user_id = parts[1]
            user = User.objects.get(id_user=user_id)
            
            # Manually set authentication attributes for compatibility with DRF permissions
            user.is_authenticated = True
            
            return (user, None)
        except (User.DoesNotExist, IndexError, ValueError):
            # If the token is specifically formatted as ours but invalid
            raise exceptions.AuthenticationFailed('Invalid token.')
        except Exception:
            # Fallback for other issues
            return None
