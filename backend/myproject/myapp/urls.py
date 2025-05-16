from django.urls import path
from myapp.views import *

urlpatterns = [
    
    # user api
    path('api/get_users', UserListAPIView.as_view({'get': 'get_users'}), name='user-list'),
    path('api/get_user_by_id/<str:pk>', UserListAPIView.as_view({'get': 'get_user_by_id'}), name='user-list'),
    path('api/create_user', UserListAPIView.as_view({'post': 'create_user'}), name='user-list'),
    path('api/update_user/<str:pk>', UserListAPIView.as_view({'put': 'update_user'}), name='user-list'),
    path('api/delete_user/<str:pk>', UserListAPIView.as_view({'delete': 'delete_user'}), name='user-list'),
    path('api/totalUsers', UserListAPIView.as_view({'get': 'totalUsers'}), name='user-list'),

    # project api
    path('api/get_projects', ProjectListAPIView.as_view({'get': 'get_projects'}), name='project-list'),
    # path('api/get_project_by_id/<str:pk>', ProjectListAPIView.as_view({'get': 'get_project_by_id'}), name='project-list'),
    path('api/create_project', ProjectListAPIView.as_view({'post': 'create_project'}), name='project-list'),
    # path('api/update_project/<str:pk>', ProjectListAPIView.as_view({'put': 'update_project'}), name='project-list'),
    # path('api/delete_project/<str:pk>', ProjectListAPIView.as_view({'delete': 'delete_project'}), name='project-list'),
    path('api/totalProjects', ProjectListAPIView.as_view({'get': 'totalProjects'}), name='project-list'),
    
    # progress api
    path('api/get_progress', ProjectProgressAPIView.as_view({'get': 'myProgress'}), name='project-progress'),
    path('api/create_progress', ProjectProgressAPIView.as_view({'post': 'createProgress'}), name='project-progress'),
]