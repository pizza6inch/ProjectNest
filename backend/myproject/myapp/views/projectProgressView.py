from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets

from myapp.models import ProjectProgress, ProjectUser, Project
from myapp.serializers import ProjectProgressSerializer
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

        userId = payload.get("user_id")
        if not userId:
            return Response({"error": "User ID not found in token"}, status=status.HTTP_400_BAD_REQUEST)

        projectId = request.data.get("project_id")
        estimatedTime = request.data.get("estimated_time")
        progressNote = request.data.get("progress_note")
        title = request.data.get("title")


        if not projectId or not estimatedTime or not progressNote or not title:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        if not Project.objects.filter(project_id=projectId).exists():
            return Response({"error": "Project does not exist"}, status=status.HTTP_404_NOT_FOUND)

        newProgressdata = {
            "project" : projectId,
            "user":userId,
            "status" : "pending",
            "estimated_time" : estimatedTime,
            "progress_note" : progressNote,
            "title":title
        }
        serializer = ProjectProgressSerializer(data=newProgressdata)

        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(
            {"message": "add progress success"}, status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=["put"])
    def updateProgress(self, request):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status=status.HTTP_401_UNAUTHORIZED)


        userId = payload.get("user_id")
        if not userId:
            return Response({"error": "User ID not found in token"}, status=status.HTTP_400_BAD_REQUEST)

        progressId = request.data.get("progress_id")
        if not progressId:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            progress = ProjectProgress.objects.get(progress_id=progressId)

            progress.estimated_time = request.data.get("estimated_time")
            progress.progress_note = request.data.get("progress_note")
            progress.status = request.data.get("status")
            progress.progress_note = request.data.get("progress_note")
            progress.user = userId
            progress.save()

        except ProjectProgress.DoesNotExist:
            return Response({"error": "Progress does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {"message": f"modify progress {progressId} success"}, status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["delete"])
    def deleteProgress(self, request, progressId=None):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            progress = ProjectProgress.objects.get(progress_id=progressId)
            progress.delete()
        except ProjectProgress.DoesNotExist:
            return Response({"error": "Progress does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {"message": f"delete project {progressId} success"}, status=status.HTTP_200_OK
        )
