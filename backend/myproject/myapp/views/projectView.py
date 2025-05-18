from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status as st, viewsets
from django.core.paginator import Paginator

from django.db.models import Q
from myapp.models import Project
from myapp.serializers import ProjectSerializer

class ProjectListAPIView(viewsets.ModelViewSet):
    # 查詢所有專案
    @action(detail=False, methods=["get"])
    def get_projects(self, request):
        status = request.query_params.get("status")
        keyword = request.query_params.get("keyword", "")
        sort_by = request.query_params.get("sortBy", "project_id")
        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("pageSize", 10))

        projects = Project.objects.all()

        # 過濾 status
        if status in ["done", "pending"]:
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
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=st.HTTP_201_CREATED)
        return Response(serializer.errors, status=st.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=["get"])
    def totalProjects(self, request):
        
        status = request.query_params.get("status")

        total_projects = Project.objects.filter(status=status).count()
        return Response({"total_projects": total_projects}, status=st.HTTP_200_OK)
    
    # 更新專案
    @action(detail=True, methods=["put"])
    def update_project(self, request, pk=None):
        try:
            project = Project.objects.get(project_id=pk)
            serializer = ProjectSerializer(project, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=st.HTTP_200_OK)
            return Response(serializer.errors, status=st.HTTP_400_BAD_REQUEST)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)
        
    # 刪除專案
    @action(detail=True, methods=["delete"])   
    def delete_project(self, request, pk=None):
        try:
            project = Project.objects.get(project_id=pk)
            project.delete()
            return Response(status=st.HTTP_204_NO_CONTENT)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)