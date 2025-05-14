from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from django.core.paginator import Paginator

from myapp.models import ProjectProgress
from myapp.serializers import ProjectProgressSerializer

class ProjectProgressAPIView(viewsets.ModelViewSet):
    pass
