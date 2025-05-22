from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status as st, viewsets
from django.core.paginator import Paginator

from myapp.models import ProjectUser, User, Project
from myapp.serializers import ProjectUserSerializer, ProjectSerializer

class ProjectUserAPIView(viewsets.ModelViewSet):
    # 查詢使用者所有關聯專案
    @action(detail=True, methods=["get"], url_path="my_projects")
    def my_projects(self, request, pk=None):
        try:
            user = User.objects.get(user_id=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=st.HTTP_404_NOT_FOUND)

        # 找出與該 user 有關聯的 projects
        project_ids = ProjectUser.objects.filter(user=user).values_list("project_id", flat=True)
        projects = Project.objects.filter(project_id__in=project_ids)

        # 原始序列化資料
        serializer = ProjectSerializer(projects, many=True)
        project_data = serializer.data

        # 加上 user_count 欄位
        for item in project_data:
            project_id = item["project_id"]
            count = ProjectUser.objects.filter(project_id=project_id).count()
            item["user_count"] = count

        return Response(project_data, status=st.HTTP_200_OK)
        