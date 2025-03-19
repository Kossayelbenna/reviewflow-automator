
"""
URL configuration for review_automation project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/reviews/', include('reviews.urls')),
    path('api/proxies/', include('proxies.urls')),
    path('api/accounts/', include('accounts.urls')),
]
