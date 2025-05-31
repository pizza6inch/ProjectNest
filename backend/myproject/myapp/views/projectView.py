from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status as st, viewsets
from django.core.paginator import Paginator
from myapp.authenticate import IsJwtTokenValid

from django.db import transaction
from django.db.models import Q, Count
from myapp.models import Project, ProjectUser, User
from myapp.serializers import ProjectSerializer, ProjectUserSerializer

class ProjectListAPIView(viewsets.ModelViewSet):
    # 查詢所有專案
    @action(detail=False, methods=["get"])
    def get_projects(self, request):
        status = request.query_params.get("status")
        keyword = request.query_params.get("keyword", "")
        sort_by = request.query_params.get("sortBy", "project_id")
        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("pageSize", 10))

        # 加上 annotate 統計每個 project 被幾個 user 關聯
        from django.db.models import Prefetch
        projects = Project.objects.annotate(user_count=Count("projectuser")).prefetch_related(
            Prefetch(
                'projectuser_set',
                queryset=ProjectUser.objects.filter(user__role='professor').select_related('user'),
                to_attr='professor_projectuser'
            )
        )

        # 過濾 status
        if status in ["done", "pending","in_progress"]:
            projects = projects.filter(status=status)

        # 關鍵字模糊搜尋 title 和 description
        if keyword:
            projects = projects.filter(
                Q(title__icontains=keyword) | Q(description__icontains=keyword)
            )

        # 排序欄位檢查
        if sort_by in [f.name for f in Project._meta.fields]:
            projects = projects.order_by(sort_by)
        else:
            return Response(
                {"error": "Please enter a valid field."},
                status=st.HTTP_400_BAD_REQUEST,
            )

        # 分頁
        paginator = Paginator(projects, page_size)
        page_obj = paginator.get_page(page)

        # 傳 user_count 需要擴充 Serializer
        serializer = ProjectSerializer(page_obj.object_list, many=True)
        return Response(
            {
                "total": paginator.count,
                "page": page,
                "pageSize": page_size,
                "results": serializer.data,
            },
            status=st.HTTP_200_OK,
        )
    
    # 新增專案
    @action(detail=False, methods=["post"])
    def create_project(self, request):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status=st.HTTP_401_UNAUTHORIZED)

        users = request.data.pop("users", [])

        project_serializer = ProjectSerializer(data=request.data)
        if project_serializer.is_valid():
            project = project_serializer.save()  # 儲存 project
        
            # 為每個 user ID 建立 ProjectUser 關聯
            for user_id in users:
                try:
                   user = User.objects.get(user_id=user_id)
                   ProjectUser.objects.create(user=user, project=project)
                except User.DoesNotExist:
                    # 可選：你也可以選擇回滾 transaction 或是略過錯誤
                    continue
            
            return Response(project_serializer.data, status=st.HTTP_201_CREATED)
        return Response(project_serializer.errors, status=st.HTTP_400_BAD_REQUEST)
    
    # 計算專案總數
    @action(detail=True, methods=["get"])
    def totalProjects(self, request):
        
        status = request.query_params.get("status")

        total_projects = Project.objects.filter(status=status).count()
        return Response({"total_projects": total_projects}, status=st.HTTP_200_OK)
    
    # 更新專案
    @action(detail=True, methods=["put"])
    def update_project(self, request, pk=None):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status=st.HTTP_401_UNAUTHORIZED)

        is_member = ProjectUser.objects.filter(user_id=payload.get("user_id"), project=pk).exists()
        
        if payload.get("role") != "admin" and not is_member:
            return Response({"error": "Permission denied"}, status=st.HTTP_403_FORBIDDEN)
        
        try:
            project = Project.objects.get(project_id=pk)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=st.HTTP_404_NOT_FOUND)

        users = request.data.pop("users", [])  # 拿掉 users，剩下的是 project 欄位

        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    # 更新專案基本欄位
                    updated_project = serializer.save()

                    # 刪除舊的關聯
                    ProjectUser.objects.filter(project=updated_project).delete()

                    # 建立新的關聯
                    for user_id in users:
                        try:
                            user = User.objects.get(user_id=user_id)
                            ProjectUser.objects.create(user=user, project=updated_project)
                        except User.DoesNotExist:
                            continue  # 可以改為丟錯誤，視需求

                return Response(serializer.data, status=st.HTTP_200_OK)

            except Exception as e:
                return Response({"error": str(e)}, status=st.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=st.HTTP_400_BAD_REQUEST)
        
    # 刪除專案
    @action(detail=True, methods=["delete"])   
    def delete_project(self, request, pk=None):
        valid, payload = IsJwtTokenValid(request)
        if not valid:
            return Response({"error": payload}, status=st.HTTP_401_UNAUTHORIZED)
        print(payload.get("role"), payload.get("user_id"), pk)
        is_member = ProjectUser.objects.filter(user_id=payload.get("user_id"), project=pk).exists()
        
        if payload.get("role") != "admin" and not is_member:
            return Response({"error": "Permission denied"}, status=st.HTTP_403_FORBIDDEN)
        
        try:
            project = Project.objects.get(project_id=pk)

            # 先刪除所有與該 project 的關聯
            ProjectUser.objects.filter(project=project).delete()

            # 再刪除專案本身
            project.delete()

            return Response(status=st.HTTP_204_NO_CONTENT)

        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=st.HTTP_404_NOT_FOUND)
