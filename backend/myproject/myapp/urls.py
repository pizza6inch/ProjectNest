from django.urls import path
from .views import UserListAPIView

urlpatterns = [
    path('api/users', UserListAPIView.as_view({'get': 'users'}), name='user-list'),
    path('api/users/<str:pk>', UserListAPIView.as_view({'get': 'users_id'}), name='user-list'),
]