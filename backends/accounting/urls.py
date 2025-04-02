from django.urls import path
from accounting import views
urlpatterns = [
    #FBV
    path('<int:pk>/users/profile/', views.user_profile, name='user-profile'),
    path('users/register/', views.user_register, name='user_register'),
    path('users/login/', views.user_login, name='user_login'),
]