from django.urls import path
from .views import CommentListCreateView

urlpatterns = [
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
]
