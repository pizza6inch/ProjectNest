from django.urls import path
from myapp.views import *

urlpatterns = [
    
    # user api
    path('api/get_users', UserListAPIView.as_view({'get': 'get_users'}), name='user-list'),
    path('api/get_user_by_id/<str:pk>', UserListAPIView.as_view({'get': 'get_user_by_id'}), name='user-list'),
    path('api/create_user', UserListAPIView.as_view({'post': 'create_user'}), name='user-list'),
    path('api/update_user/<str:pk>', UserListAPIView.as_view({'put': 'update_user'}), name='user-list'),
    path('api/delete_user/<str:pk>', UserListAPIView.as_view({'delete': 'delete_user'}), name='user-list'),
]