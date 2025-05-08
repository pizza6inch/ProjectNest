from django.urls import path
from .views import UserListAPIView

urlpatterns = [
    path('api/users', UserListAPIView.as_view({'get': 'users'}), name='user-list'),
]