from django.urls import path
from .views import UserListAPIView

urlpatterns = [
    path('api/users', UserListAPIView.as_view({'get': 'users', 'post': 'check'}), name='user-list'),
    path('api/user/<str:pk>', UserListAPIView.as_view({'get': 'user_id'}), name='user-detail'),
    path('api/token', UserListAPIView.as_view({'post': 'obtain_token'}), name='token-obtain'),
]
