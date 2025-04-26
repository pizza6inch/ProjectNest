from rest_framework import serializers
from .models import Item


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "name", "description", "quantity", "price"]
        read_only_fields = ["id", "price"]  # price 欄位為唯讀，不由前端設定
