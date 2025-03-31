from django.urls import path
from accounting import views

urlpatterns = [
    #FBV
    path('<int:pk>/users/profile/', views.user_profile, name='user-profile'),
    # path('users/profile/login/', views.user_profile, name='user-profile'),
    # path('users/profile/register/', views.user_profile, name='user-profile'),
]