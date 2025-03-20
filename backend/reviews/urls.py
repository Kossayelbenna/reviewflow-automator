
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BusinessViewSet, ReviewViewSet, GenerateReviewView, SubmitReviewsView, TestSystemView, ComplianceReportView

router = DefaultRouter()
router.register(r'businesses', BusinessViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate/', GenerateReviewView.as_view(), name='generate-review'),
    path('submit/', SubmitReviewsView.as_view(), name='submit-reviews'),
    path('test-system/', TestSystemView.as_view(), name='test-system'),
    path('compliance-report/', ComplianceReportView.as_view(), name='compliance-report'),
]
