from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from django.core.paginator import Paginator

from django.db.models import Q
from myapp.models import Project
from myapp.serializers import ProjectSerializer

class ProjectListAPIView(viewsets.ModelViewSet):
    # 查詢所有專案
    @action(detail=False, methods=["get"])
    def get_projects(self, request):
        status_filter = request.query_params.get("status_filter")
        keyword = request.query_params.get("keyword", "")
        sort_by = request.query_params.get("sortBy", "project_id")
        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("pageSize", 10))

        projects = Project.objects.all()

        # 過濾 status
        if status_filter in ["done", "pending"]:
            projects = projects.filter(status=status_filter)

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
                status=status.HTTP_400_BAD_REQUEST,
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
            status=status.HTTP_200_OK,
        )