from django.urls import path
from topgun import views

urlpatterns = [
    path('auth/signup',
         views.register_user,
         name='register_user')
]
