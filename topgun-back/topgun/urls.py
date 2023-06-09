from django.urls import path

from topgun import views

urlpatterns = [
    path('register',
         views.register_user,
         name='register_user'),

    path('login',
         views.LoginView.as_view(),
         name='login_user'),

    path('create-pilot',
         views.create_user_pilot,
         name='create_pilot'),

    path('create-flight/<int:user_id>',
         views.create_flight,
         name='create_flight'),

    path('users',
         views.get_users,
         name='get_users'),

    path('pilot-data/<int:user_id>',
         views.get_pilot_data,
         name='get_pilot_data'),

    path('instructed-flights/<int:user_id>',
         views.get_instructed_flights,
         name='get_instructed_flights'),

    path('promote/<int:user_id>',
         views.promote_pilot,
         name='promote_pilot'),

    path('graduate/<int:user_id>',
         views.graduate_student,
         name='graduate_student'),

]
