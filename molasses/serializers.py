from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    data = serializers.JSONField()

    class Meta:
        model = Event
        fields = '__all__'

    def validate(self, attrs):
        attrs['data']['user_data']['client_ip_address'] = self.context['ip']
        return super().validate(attrs)