
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Account, AccountCreationJob
from .serializers import AccountSerializer, AccountCreationJobSerializer
from .services.account_service import schedule_account_creation


class AccountViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing accounts
    """
    queryset = Account.objects.all().order_by('-created_at')
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Account.objects.all().order_by('-created_at')
        platform = self.request.query_params.get('platform')
        status = self.request.query_params.get('status')
        
        if platform:
            queryset = queryset.filter(platform=platform)
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset


class AccountCreationJobViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing account creation jobs
    """
    queryset = AccountCreationJob.objects.all().order_by('-created_at')
    serializer_class = AccountCreationJobSerializer
    permission_classes = [IsAuthenticated]


class CreateAccountsView(APIView):
    """
    API endpoint for creating batches of accounts
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        platform = request.data.get('platform')
        count = request.data.get('count', 1)
        
        if not platform or platform not in ['google', 'trustpilot']:
            return Response(
                {'error': 'Valid platform (google or trustpilot) is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            job = AccountCreationJob.objects.create(
                platform=platform,
                count=count,
                status='pending'
            )
            
            # Schedule the account creation task
            schedule_account_creation(job.id)
            
            return Response({
                'message': f'Account creation job scheduled',
                'job_id': job.id
            })
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
