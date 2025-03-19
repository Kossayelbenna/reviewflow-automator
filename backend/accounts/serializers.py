
from rest_framework import serializers
from .models import Account, AccountCreationJob


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}


class AccountCreationJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountCreationJob
        fields = '__all__'
        read_only_fields = ('status', 'completed_count', 'error_message')
