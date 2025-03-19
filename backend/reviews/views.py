
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Business, Review
from .serializers import BusinessSerializer, ReviewSerializer, ReviewCreateSerializer
from .services.ai_service import generate_review_content


class BusinessViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing businesses
    """
    queryset = Business.objects.all().order_by('-created_at')
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated]


class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing reviews
    """
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer


class GenerateReviewView(APIView):
    """
    API endpoint for generating review content with AI
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        business_id = request.data.get('business_id')
        rating = request.data.get('rating')
        platform = request.data.get('platform', 'google')
        
        if not business_id or not rating:
            return Response(
                {'error': 'Business ID and rating are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            business = Business.objects.get(id=business_id)
        except Business.DoesNotExist:
            return Response(
                {'error': 'Business not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        try:
            content = generate_review_content(business, int(rating), platform)
            return Response({'content': content})
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
