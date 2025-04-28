from musics.models import Music
from musics.serializers import MusicSerializer

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response


class MusicViewSet(viewsets.ModelViewSet):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer

    # 自訂範例的 CRUD 操作

    # Create (POST)
    @action(detail=False, methods=["post"])
    def create_music(self, request):
        serializer = MusicSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Read (GET)
    @action(detail=True, methods=["get"])
    def get_music(self, request, pk=None):
        music = self.get_object()
        serializer = MusicSerializer(music)
        return Response(serializer.data)

    # Update (PUT/PATCH)
    @action(detail=True, methods=["put", "patch"])
    def update_music(self, request, pk=None):
        music = self.get_object()
        serializer = MusicSerializer(music, data=request.data, partial=("patch" in request.method.lower()))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete (DELETE)
    @action(detail=True, methods=["delete"])
    def delete_music(self, request, pk=None):
        music = self.get_object()
        music.delete()
        return Response({"message": "Music deleted successfully"}, status=status.HTTP_204_NO_CONTENT)