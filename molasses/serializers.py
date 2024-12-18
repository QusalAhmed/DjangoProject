from django.contrib.postgres.fields import JSONField
from rest_framework import serializers

class EventSerializer(serializers.Serializer):
    data = serializers.JSONField()
