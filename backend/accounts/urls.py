
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, AccountCreationJobViewSet, CreateAccountsView

router = DefaultRouter()
router.register(r'list', AccountViewSet)
router.register(r'jobs', AccountCreationJobViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('create-batch/', CreateAccountsView.as_view(), name='create-accounts'),
]
