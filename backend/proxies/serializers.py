
from rest_framework import serializers
from .models import Proxy, ProxyUsageLog


class ProxySerializer(serializers.ModelSerializer):
    class Meta:
        model = Proxy
        fields = '__all__'


class ProxyUsageLogSerializer(serializers.ModelSerializer):
    proxy_ip = serializers.ReadOnlyField(source='proxy.ip')
    
    class Meta:
        model = ProxyUsageLog
        fields = '__all__'
