
from django.db import models


class Business(models.Model):
    """Model for businesses that will receive reviews"""
    name = models.CharField(max_length=255)
    google_place_id = models.CharField(max_length=255, blank=True, null=True)
    google_url = models.URLField(blank=True, null=True)
    trustpilot_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class Review(models.Model):
    """Model for reviews that will be posted"""
    PLATFORM_CHOICES = [
        ('google', 'Google'),
        ('trustpilot', 'Trustpilot'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('published', 'Published'),
        ('failed', 'Failed'),
    ]
    
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='reviews')
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    account = models.ForeignKey('accounts.Account', on_delete=models.SET_NULL, null=True, related_name='reviews')
    content = models.TextField()
    rating = models.IntegerField(choices=RATING_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    review_url = models.URLField(blank=True, null=True)
    ip_used = models.ForeignKey('proxies.Proxy', on_delete=models.SET_NULL, null=True, blank=True)
    error_message = models.TextField(blank=True)
    scheduled_for = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.business.name} - {self.rating} Stars ({self.platform})"
