from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from django.core.paginator import Paginator

from myapp.models import User
from myapp.serializers import UserSerializer

class UserListAPIView(viewsets.ModelViewSet):
    # 查詢所有使用者
    @action(detail=False, methods=["get"])
    def get_users(self, request):

        role = request.query_params.get("role")
        sort_by = request.query_params.get("sortBy", "user_id")
        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("pageSize", 10))

        users = User.objects.all()
        if role:
            users = users.filter(role=role)

        if sort_by in [f.name for f in User._meta.fields if f.name != "password"]:
            users = users.order_by(sort_by)
        else:
            return Response(
                {"error": "Please enter a valid field."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        paginator = Paginator(users, page_size)
        page_obj = paginator.get_page(page)

        serializer = UserSerializer(page_obj.object_list, many=True)
        return Response(
            {
                "total": paginator.count,
                "page": page,
                "pageSize": page_size,
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    # 查詢單一使用者
    @action(detail=True, methods=["get"])
    def get_user_by_id(self, request, pk=None):
        try:
            user = User.objects.get(user_id=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

    # 新增使用者
    @action(detail=False, methods=["post"])
    def create_user(self, request):
        serializer = UserSerializer(data=request.data)
        print(request.data, serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 更新使用者
    @action(detail=True, methods=["put"])
    def update_user(self, request, pk=None):
        try:
            user = User.objects.get(user_id=pk)
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

    # 刪除使用者
    @action(detail=True, methods=["delete"])
    def delete_user(self, request, pk=None):
        try:
            user = User.objects.get(user_id=pk)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

    @action(detail=False, methods=["get"])
    def totalUsers(self, request):
        totalUserCount = User.objects.count()
        return Response({"total_user_count": totalUserCount}, status=status.HTTP_200_OK)