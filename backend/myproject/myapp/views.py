from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Item
from .serializers import ItemSerializer
from django.shortcuts import get_object_or_404


@api_view(["GET", "POST"])
def item_list_create(request):
    if request.method == "GET":
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = request.data
        # 範例：根據 quantity 計算 price
        quantity = data.get("quantity", 0)
        price_per_unit = 10.0
        total_price = quantity * price_per_unit
        data["price"] = total_price

        serializer = ItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def item_detail(request, pk):
    item = get_object_or_404(Item, pk=pk)

    if request.method == "GET":
        serializer = ItemSerializer(item)
        return Response(serializer.data)

    elif request.method == "PUT":
        data = request.data
        quantity = data.get("quantity", item.quantity)
        price_per_unit = 10.0
        total_price = quantity * price_per_unit
        data["price"] = total_price

        serializer = ItemSerializer(item, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PATCH":
        data = request.data
        if "quantity" in data:
            quantity = data["quantity"]
            price_per_unit = 10.0
            total_price = quantity * price_per_unit
            data["price"] = total_price

        serializer = ItemSerializer(item, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
