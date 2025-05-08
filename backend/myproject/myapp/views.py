from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from .models import User
from .serializers import UserSerializer

class UserListAPIView(viewsets.ModelViewSet):
    @action(detail=True, methods=["get"])
    def users(self, request):

        filter_param = request.query_params.get('filter')
        sort_by = request.query_params.get('sortBy')
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('pageSize', 10))
        
        # print(filter_param, sort_by, page, page_size)

        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["get"])
    def users_id(self, request, pk=None):
        print(pk)
        try:
            user = User.objects.get(user_id=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)