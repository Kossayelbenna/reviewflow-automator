
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProxyViewSet, ProxyUsageLogViewSet, RefreshProxiesView

router = DefaultRouter()
router.register(r'list', ProxyViewSet)
router.register(r'logs', ProxyUsageLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('refresh/', RefreshProxiesView.as_view(), name='refresh-proxies'),
]
