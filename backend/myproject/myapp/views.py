from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from django.core.paginator import Paginator
from .models import User
from .serializers import UserSerializer
import jwt
from django.conf import settings
from django.contrib.auth.hashers import check_password

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

    def _get_user_id_from_token(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None, Response({'error': 'Authorization header missing'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            token = auth_header.split(' ')[1] if ' ' in auth_header else auth_header
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get('user_id')
            role = payload.get('role')
            if not user_id or not role:
                return None, Response({'error': 'user_id or role not found in token'}, status=status.HTTP_401_UNAUTHORIZED)
            return {"user_id":user_id,"role":role}, None
        except jwt.ExpiredSignatureError:
            return None, Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return None, Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    def check(self, request, *args, **kwargs):
        user, error_response = self._get_user_id_from_token(request)
        print(user)
        if error_response:
            return error_response
        return Response({'user':user["user_id"],"role":user["role"]})

    @action(detail=False, methods=["post"])
    def obtain_token(self, request):
        user_id = request.data.get('user_id')
        password = request.data.get('password')
        if not user_id or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(user_id=user_id)

            # if not check_password(password, user.password):
            #     return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            if password != user.password:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            payload = {
                'user_id': user.user_id,
                'role':user.role
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            return Response({'token': token}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
