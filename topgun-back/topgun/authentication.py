from rest_framework import permissions


class EmployeePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.profile == "EMP":
            return True


class PilotPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.profile == "PIL":
            return True


class StudentPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.profile == "STU":
            return True


class InstructorPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.profile == "INS":
            return True
