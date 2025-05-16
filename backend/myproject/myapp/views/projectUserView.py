from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from django.core.paginator import Paginator

from myapp.models import ProjectUser
from myapp.serializers import ProjectUserSerializer

class ProjectUserListAPIView(viewsets.ModelViewSet):
    pass
