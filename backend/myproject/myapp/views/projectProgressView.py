from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from django.core.paginator import Paginator

from myapp.models import ProjectProgress, ProjectUser, Project
from myapp.serializers import ProjectProgressSerializer, ProjectUserSerializer
from myapp.authenticate import *
from django.db.models import Subquery

class ProjectProgressAPIView(viewsets.ModelViewSet):
    @action(detail=False, methods=["get"])
    def myProgress(self, request):

        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status=status.HTTP_401_UNAUTHORIZED)

        # get userId
        userId = payload.get("user_id")
        if not userId:
            return Response({"error": "User ID not found in token"}, status=status.HTTP_400_BAD_REQUEST)

        # query
        subquery = ProjectUser.objects.filter(user_id=userId).values("project_id")
        progressQuery = ProjectProgress.objects.filter(project_id__in=Subquery(subquery))

        # serialize
        progress = ProjectProgressSerializer(progressQuery, many=True).data

        return Response({"progress": progress}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def createProgress(self, request):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status=status.HTTP_401_UNAUTHORIZED)

        projectId = payload.get("project_id")
        estimatedTime = payload.get("estimated_time")
        progressNote = payload.get("progress_note")
        
        
        if not projectId or not estimatedTime or not progressNote:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        if not Project.objects.filter(project_id=projectId).exists():
            return Response({"error": "Project does not exist"}, status=status.HTTP_404_NOT_FOUND)

        newProgressdata = {
            "project" : projectId,
            "status" : "pending",
            "estimated_time" : estimatedTime,
            "progress_note" : progressNote
        }
        serializer = ProjectProgressSerializer(data=newProgressdata)
        
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response({"message": "Progress created successfully"}, status=status.HTTP_201_CREATED)
