from rest_framework import permissions


class EmployeePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.profile == "EMP":
            return True


class PilotPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.profile == "PIL":
            return True


class StudentPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.profile == "STU":
            return True


class InstructorPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.profile == "INS":
            return True
