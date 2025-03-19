
from rest_framework import serializers
from .models import Business, Review


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    business_name = serializers.ReadOnlyField(source='business.name')
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('status', 'review_url', 'ip_used', 'error_message', 'published_at')


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('business', 'platform', 'content', 'rating', 'scheduled_for')
