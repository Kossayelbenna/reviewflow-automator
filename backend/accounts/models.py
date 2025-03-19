
from django.db import models


class Account(models.Model):
    """Model for managing review accounts (Google, Trustpilot)"""
    PLATFORM_CHOICES = [
        ('google', 'Google'),
        ('trustpilot', 'Trustpilot'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('cooldown', 'Cooldown'),
        ('banned', 'Banned'),
    ]
    
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    email = models.EmailField()
    password = models.CharField(max_length=100)
    recovery_email = models.EmailField(blank=True, null=True)
    recovery_phone = models.CharField(max_length=20, blank=True, null=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    cooldown_until = models.DateTimeField(null=True, blank=True)
    last_used = models.DateTimeField(null=True, blank=True)
    reviews_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.email} ({self.platform})"
    
    class Meta:
        unique_together = ('platform', 'email')


class AccountCreationJob(models.Model):
    """Model for tracking account creation jobs"""
    PLATFORM_CHOICES = [
        ('google', 'Google'),
        ('trustpilot', 'Trustpilot'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    count = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    completed_count = models.IntegerField(default=0)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.platform} - {self.count} accounts ({self.status})"
