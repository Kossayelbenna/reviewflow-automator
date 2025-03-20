from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from .models import Business, Review
from .serializers import BusinessSerializer, ReviewSerializer, ReviewCreateSerializer
from .services.ai_service import generate_review_content
from .services.scheduler import scheduler
import asyncio
from .test_utils import run_test_cycle, generate_compliance_report


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


class SubmitReviewsView(APIView):
    """
    API endpoint for submitting and scheduling multiple reviews
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        business_id = request.data.get('business_id')
        platform = request.data.get('platform', 'google')
        count = int(request.data.get('count', 1))
        ratings = request.data.get('ratings', [5])  # Default to 5 star ratings
        
        if not business_id:
            return Response(
                {'error': 'Business ID is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            business = Business.objects.get(id=business_id)
        except Business.DoesNotExist:
            return Response(
                {'error': 'Business not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not (1 <= count <= 50):
            return Response(
                {'error': 'Count must be between 1 and 50'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reviews = []
        errors = []
        
        # Start the scheduler if it's not already running
        scheduler.start()
        
        for i in range(count):
            try:
                # Determine rating (either use specified ratings or default to 5)
                if isinstance(ratings, list) and ratings:
                    rating = ratings[i % len(ratings)]
                else:
                    rating = 5
                
                # Generate review content
                content = generate_review_content(business, rating, platform)
                
                # Create review in the database
                review = Review(
                    business=business,
                    platform=platform,
                    content=content,
                    rating=rating,
                    status='pending',
                    scheduled_for=datetime.now() + timedelta(minutes=i*5)  # Schedule 5 minutes apart
                )
                review.save()
                reviews.append(review.id)
                
            except Exception as e:
                errors.append(str(e))
        
        return Response({
            'message': f'{len(reviews)} reviews scheduled for posting',
            'review_ids': reviews,
            'errors': errors
        })


class TestSystemView(APIView):
    """
    API endpoint for testing the review automation system
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        business_id = request.data.get('business_id')
        platform = request.data.get('platform', 'google')
        count = int(request.data.get('count', 1))
        
        if count > 10:
            return Response(
                {'error': 'For testing, count must be 10 or less'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Run the test cycle asynchronously
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            results = loop.run_until_complete(run_test_cycle(business_id, platform, count))
            return Response(results)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        finally:
            loop.close()


class ComplianceReportView(APIView):
    """
    API endpoint for generating compliance reports
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        try:
            report = generate_compliance_report()
            return Response(report)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
