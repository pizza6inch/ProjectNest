from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from django.core.paginator import Paginator
from .models import User
from .serializers import UserSerializer

class UserListAPIView(viewsets.ModelViewSet):
    @action(detail=False, methods=["get"])
    def users(self, request):

        role = request.query_params.get('role')
        sort_by = request.query_params.get('sortBy', 'user_id')
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('pageSize', 10))
        
        users = User.objects.all()
        if role:
            users = users.filter(role=role)
        
        if sort_by:
            if sort_by in [f.name for f in User._meta.fields]:
                users = users.order_by(sort_by)
            else:
                return Response(
                {'error': 'Please enter a valid field.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        paginator = Paginator(users, page_size)
        page_obj = paginator.get_page(page)

        serializer = UserSerializer(page_obj.object_list, many=True)
        return Response({
            "total": paginator.count,
            "page": page,
            "pageSize": page_size,
            "results": serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["get"])
    def user_id(self, request, pk=None):
        try:
            user = User.objects.get(user_id=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
    