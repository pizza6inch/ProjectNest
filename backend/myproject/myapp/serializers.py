from rest_framework import serializers
from .models import Item


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "name", "description"]


# Additional serializer example: only serialize id and name fields
class ItemNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "name"]
