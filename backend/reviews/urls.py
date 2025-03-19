
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BusinessViewSet, ReviewViewSet, GenerateReviewView, SubmitReviewsView

router = DefaultRouter()
router.register(r'businesses', BusinessViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate/', GenerateReviewView.as_view(), name='generate-review'),
    path('submit/', SubmitReviewsView.as_view(), name='submit-reviews'),
]
