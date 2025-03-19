
from django.db import models


class Proxy(models.Model):
    """Model for managing proxies and VPNs"""
    TYPE_CHOICES = [
        ('residential', 'Residential IP'),
        ('datacenter', 'Datacenter IP'),
        ('mobile', 'Mobile IP'),
    ]
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('in_use', 'In Use'),
        ('blocked', 'Blocked'),
    ]
    
    ip = models.CharField(max_length=45)  # IPv6 can be longer
    port = models.IntegerField()
    username = models.CharField(max_length=100, blank=True, null=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='residential')
    country = models.CharField(max_length=2, default='US')  # ISO country code
    city = models.CharField(max_length=100, blank=True, null=True)
    provider = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    last_used = models.DateTimeField(null=True, blank=True)
    blocked_until = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.ip}:{self.port} ({self.type}, {self.country})"
    
    class Meta:
        verbose_name_plural = "Proxies"


class ProxyUsageLog(models.Model):
    """Model for tracking proxy usage"""
    proxy = models.ForeignKey(Proxy, on_delete=models.CASCADE, related_name='usage_logs')
    platform = models.CharField(max_length=50)  # e.g., 'google', 'trustpilot'
    business = models.ForeignKey('reviews.Business', on_delete=models.CASCADE, null=True, blank=True)
    account = models.ForeignKey('accounts.Account', on_delete=models.CASCADE, null=True, blank=True)
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)
    used_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.proxy} used for {self.platform} at {self.used_at}"
