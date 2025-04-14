from django.urls import path
from accounting import views
from .views import TransactionListView,StatisticsAPIView
urlpatterns = [
    #FBV
    path('<int:pk>/users/profile/', views.user_profile, name='user-profile'),
    path('users/register/', views.user_register, name='user_register'),
    path('users/login/', views.user_login, name='user_login'),
    path('transaction/create/', views.transaction_create, name='transaction_create'),
    path('transaction/get/', TransactionListView.as_view(), name='transaction-list'),
    path('stats/', StatisticsAPIView.as_view(), name='stats'),
]