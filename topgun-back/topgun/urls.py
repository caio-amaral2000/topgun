from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token

from topgun import views

urlpatterns = [
    path('register',
         views.register_user,
         name='register_user'),

    # path('login',
    #      views.LoginView.as_view(),
    #      name='login_user'),
    path('login', obtain_jwt_token),
]
