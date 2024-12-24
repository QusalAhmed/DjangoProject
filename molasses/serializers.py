from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    data = serializers.JSONField()

    def create(self, validated_data):
        client_ip = self.context.get('ip')
        return Event.objects.create(data=validated_data['data'], ip=client_ip)

    class Meta:
        model = Event
        fields = '__all__'
