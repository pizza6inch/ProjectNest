from rest_framework import serializers
from .models import *
from dateutil.parser import parse
from dateutil.parser._parser import ParserError
from django.utils import timezone
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def create(self, validated_data):
        if "password" in validated_data:
            validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "password" in validated_data:
            validated_data["password"] = make_password(validated_data["password"])
        return super().update(instance, validated_data)


class ProjectSerializer(serializers.ModelSerializer):
    user_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Project
        fields = "__all__"

class ProjectProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectProgress
        fields = "__all__"

    def validate_estimated_time(self, value):
        if isinstance(value, str):
            try:
                dt = parse(value)
            except (ParserError, ValueError):
                raise serializers.ValidationError("not a valid datetime")
        elif isinstance(value, timezone.datetime):
            dt = value
        else:
            raise serializers.ValidationError("not a valid datetime")
        if timezone.is_naive(dt):
            dt = timezone.make_aware(dt, timezone.get_current_timezone())
        now = timezone.now()
        if dt <= now:
            raise serializers.ValidationError("estimated_time must be in the future")
        return dt


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"

class ProjectUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectUser
        fields = "__all__"
