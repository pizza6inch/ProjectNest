from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.status import *
from myapp.authenticate import IsJwtTokenValid
from myapp.models import ProjectUser, TrackProjectUser, Project
from myapp.serializers import ProjectSerializer, TrackProjectUserSerializer

class TrackProjectListAPIView(viewsets.ModelViewSet):
    @action(detail=False, methods=["get"])
    def get_trackprojects(self, request):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status = HTTP_401_UNAUTHORIZED)
        user_id = payload.get("user_id")
        
        project_ids = TrackProjectUser.objects.filter(user_id = user_id).values_list("project_id", flat=True)
        projects = Project.objects.filter(project_id__in = project_ids)

        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status = HTTP_200_OK)
        
    @action(detail=False, methods=["post"])
    def create_track(self, request):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status = HTTP_401_UNAUTHORIZED)
        user_id = payload.get("user_id")
        project_id = request.data.get("project_id")
        if not project_id:
            return Response({"error": "project_id is required"}, status=HTTP_400_BAD_REQUEST)

        if TrackProjectUser.objects.filter(user_id=user_id, project_id=project_id).exists():
            return Response({"error": "Already tracking this project"}, status=HTTP_400_BAD_REQUEST)
        
        data = {"user_id": user_id, "project_id": project_id}
        serializer = TrackProjectUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=["delete"])
    def delete_track(self, request):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status = HTTP_401_UNAUTHORIZED)
        user_id = payload.get("user_id")
        project_id = request.data.get("project_id")
        if not project_id:
            return Response({"error": "project_id is required"}, status=HTTP_400_BAD_REQUEST)

        if TrackProjectUser.objects.filter(user_id=user_id, project_id=project_id).exists():
            return Response({"error": "Already tracking this project"}, status=HTTP_400_BAD_REQUEST)
        
        track = TrackProjectUser.objects.filter(user_id=user_id, project_id=project_id)
        if not track.exists():
            return Response({"error": "Not tracking this project"}, status=HTTP_400_BAD_REQUEST)

        track.delete()
        return Response({"success": True}, status=HTTP_200_OK)