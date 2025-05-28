from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from django.core.paginator import Paginator

from myapp.models import Comment
from myapp.serializers import CommentSerializer
from myapp.authenticate import IsJwtTokenValid

class CommentListAPIView(viewsets.ModelViewSet):
    @action(detail=False, methods=["post"])
    def create_comment(self, request):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status=status.HTTP_401_UNAUTHORIZED)

        # Enforce user from token and require progress in data
        data = request.data.copy()
        data['user'] = payload.get("user_id")
        if 'progress' not in data:
            return Response({"error": "progress field is required"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["put"])
    def update_comment(self, request, pk=None):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            comment = Comment.objects.get(comment_id=pk)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)

        # Only allow the comment owner or admin to update
        if payload.get("role") != "admin" and comment.user.user_id != payload.get("user_id"):
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["delete"])
    def delete_comment(self, request, pk=None):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            comment = Comment.objects.get(comment_id=pk)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)

        # Only allow the comment owner or admin to delete
        if payload.get("role") != "admin" and comment.user.user_id != payload.get("user_id"):
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
