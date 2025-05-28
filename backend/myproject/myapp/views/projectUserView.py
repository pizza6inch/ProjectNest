from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status as st, viewsets
from django.core.paginator import Paginator
from myapp.authenticate import IsJwtTokenValid

from myapp.models import ProjectUser, User, Project, ProjectProgress, Comment
from myapp.serializers import ProjectUserSerializer, ProjectSerializer, ProjectProgressSerializer

class ProjectUserAPIView(viewsets.ModelViewSet):
    # 查詢使用者所有關聯專案
    @action(detail=True, methods=["get"], url_path="my_projects")
    def my_projects(self, request, pk=None):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status=st.HTTP_401_UNAUTHORIZED)
        elif payload.get("role") != "admin" and payload.get("user_id") != pk:
            return Response({"error": "Permission denied"}, status=st.HTTP_403_FORBIDDEN)

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

    # 查詢專案詳細資訊
    @action(detail=True, methods=["get"], url_path="project_detail")
    def project_detail(self, request, pk=None):
        try:
            project = Project.objects.get(project_id=pk)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=st.HTTP_404_NOT_FOUND)

        # Project base data
        project_data = ProjectSerializer(project).data

        # Project Users
        project_users = ProjectUser.objects.filter(project=project).select_related("user")
        students = []
        professors = []
        for pu in project_users:
            if pu.user.role == "student":
                students.append({"user_id": pu.user.user_id, "name": pu.user.name,"email":pu.user.email,"image_url":pu.user.image_url})
            elif pu.user.role == "professor":
                professors.append({"user_id": pu.user.user_id, "name": pu.user.name,"email":pu.user.email})

        # Project Progresses with comments
        progresses = ProjectProgress.objects.filter(project=project).order_by("create_at")
        progress_list = []
        for progress in progresses:
            comments = Comment.objects.filter(progress=progress).order_by("create_at").select_related("user")


            comment_list = []
            for comment in comments:
                comment_list.append({
                    "comment_id": comment.comment_id,
                    "author": {
                        "user_id": comment.user.user_id if comment.user else None,
                        "name": comment.user.name if comment.user else None,
                        "image_url":comment.user.image_url if comment.user else None,
                    },
                    "content": comment.content,
                    "create_at": comment.create_at,
                })

            progress_list.append({
                "progress_id": progress.progress_id,
                "status": progress.status,
                "estimated_time": progress.estimated_time,
                "progress_note": progress.progress_note,
                "create_at": progress.create_at,
                "update_at": progress.update_at,
                "comments": comment_list,
                "author":{
                    "user_id":progress.user.user_id,
                    "name":progress.user.name,
                    "image_url":progress.user.image_url,
                },
                "title":progress.title
            })

        return Response({
            "project": project_data,
            "students": students,
            "professors": professors,
            "progresses": progress_list,
        }, status=st.HTTP_200_OK)

