from rest_framework.permissions import BasePermission


class AdminOnlyPermission(BasePermission):
    message = 'Admin access required.'

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )


class UserOnlyPermission(BasePermission):
    message = 'User access only. Admins must use admin portal.'

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and not request.user.is_staff
        )
