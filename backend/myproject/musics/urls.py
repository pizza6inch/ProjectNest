# news/urls.py
from django.urls import path, include
from musics.views import MusicViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'music', MusicViewSet, basename='music')

# 自訂路由
custom_urls = [
    path('music/create_music/', MusicViewSet.as_view({'post': 'create_music'}), name='create-music'),
    path('music/<int:pk>/get_music/', MusicViewSet.as_view({'get': 'get_music'}), name='get-music'),
    path('music/<int:pk>/update_music/', MusicViewSet.as_view({'put': 'update_music', 'patch': 'update_music'}), name='update-music'),
    path('music/<int:pk>/delete_music/', MusicViewSet.as_view({'delete': 'delete_music'}), name='delete-music'),
]

# 合併路由
urlpatterns = router.urls + custom_urls