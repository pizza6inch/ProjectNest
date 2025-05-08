from django.urls import path
from .views import UserListAPIView

urlpatterns = [
    path('api/users', UserListAPIView.as_view({'get': 'users'}), name='user-list'),
    path('api/user/<str:pk>', UserListAPIView.as_view({'get': 'user_id'}), name='user-list'),
]