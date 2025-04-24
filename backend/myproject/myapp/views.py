from rest_framework import generics
from .models import Item
from .serializers import ItemSerializer, ItemNameSerializer


class ItemList(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class ItemNameList(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemNameSerializer
