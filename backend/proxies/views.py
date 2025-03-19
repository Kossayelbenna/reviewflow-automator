
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Proxy, ProxyUsageLog
from .serializers import ProxySerializer, ProxyUsageLogSerializer
from .services.proxy_service import ProxyService


class ProxyViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing proxies
    """
    queryset = Proxy.objects.all().order_by('-created_at')
    serializer_class = ProxySerializer
    permission_classes = [IsAuthenticated]


class ProxyUsageLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing proxy usage logs
    """
    queryset = ProxyUsageLog.objects.all().order_by('-used_at')
    serializer_class = ProxyUsageLogSerializer
    permission_classes = [IsAuthenticated]


class RefreshProxiesView(APIView):
    """
    API endpoint for refreshing the proxy list from provider
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        provider = request.data.get('provider', 'brightdata')
        count = request.data.get('count', 10)
        country = request.data.get('country', 'US')
        
        try:
            proxy_service = ProxyService()
            result = proxy_service.refresh_proxies_from_provider(provider, count, country)
            return Response({
                'message': f'Successfully refreshed proxies',
                'count': result['count'],
                'provider': provider
            })
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
