
"""
Test utilities for verifying backend functionality
"""
import logging
import asyncio
import json
import os
from datetime import datetime
from .models import Business, Review
from .services.ai_service import generate_review_content
from .services.review_automation import ReviewAutomationService
from .services.mock_service import MockAutomationService, MockProxyService

logger = logging.getLogger(__name__)

async def run_test_cycle(business_id=None, platform='google', count=1):
    """
    Run a complete test cycle from review generation to posting
    
    Parameters:
    business_id (int): Optional business ID to use, will create one if None
    platform (str): Platform to test (google or trustpilot)
    count (int): Number of reviews to generate and post
    
    Returns:
    dict: Test results
    """
    logger.info(f"Starting test cycle for {platform} with {count} reviews")
    
    results = {
        'success': 0,
        'failed': 0,
        'review_ids': [],
        'errors': []
    }
    
    try:
        # Use existing business or create test business
        if business_id:
            business = Business.objects.get(id=business_id)
        else:
            business = Business.objects.create(
                name=f"Test Business {datetime.now().strftime('%Y%m%d%H%M%S')}",
                google_url="https://maps.google.com/?cid=12345678901234567890",
                trustpilot_url="https://www.trustpilot.com/review/example.com"
            )
            logger.info(f"Created test business: {business.name} (ID: {business.id})")
        
        # Set up mock services
        mock_proxy_service = MockProxyService()
        mock_automation = MockAutomationService()
        
        # Generate and process reviews
        for i in range(count):
            try:
                # Generate rating (between 4-5 for positive reviews)
                rating = 5 if i % 2 == 0 else 4
                
                # Generate review content
                content = generate_review_content(business, rating, platform)
                
                # Create review in the database
                review = Review(
                    business=business,
                    platform=platform,
                    content=content,
                    rating=rating,
                    status='pending',
                    scheduled_for=datetime.now()
                )
                review.save()
                results['review_ids'].append(review.id)
                logger.info(f"Generated review {review.id} with rating {rating}")
                
                # Use mock service to simulate posting
                success, error = await mock_automation.post_review(review)
                
                if success:
                    results['success'] += 1
                else:
                    results['failed'] += 1
                    results['errors'].append({
                        'review_id': review.id,
                        'error': error
                    })
                
                # Add delay between reviews
                await asyncio.sleep(1)
                
            except Exception as e:
                logger.error(f"Error in test cycle: {e}")
                results['failed'] += 1
                results['errors'].append(str(e))
        
        return results
    
    except Exception as e:
        logger.error(f"Test cycle failed: {e}")
        return {
            'success': False,
            'error': str(e)
        }

def generate_compliance_report():
    """
    Generate a compliance report for academic purposes
    
    Returns:
    dict: Compliance report data
    """
    report = {
        'timestamp': datetime.now().isoformat(),
        'academic_mode': os.getenv('ACADEMIC_MODE', 'True').lower() == 'true',
        'test_mode': os.getenv('TEST_MODE', 'False').lower() == 'true',
        'review_counts': {
            'total': Review.objects.count(),
            'pending': Review.objects.filter(status='pending').count(),
            'in_progress': Review.objects.filter(status='in_progress').count(),
            'published': Review.objects.filter(status='published').count(),
            'failed': Review.objects.filter(status='failed').count(),
            'rejected': Review.objects.filter(status='rejected').count(),
        },
        'businesses': {
            'total': Business.objects.count(),
            'with_reviews': Business.objects.filter(reviews__isnull=False).distinct().count()
        },
        'rate_limits': {
            'max_reviews_per_day': int(os.getenv('MAX_REVIEWS_PER_DAY', '50')),
            'min_interval_seconds': int(os.getenv('MIN_INTERVAL_SECONDS', '300'))
        }
    }
    
    # Save the report to a file as well
    report_path = f"compliance_report_{datetime.now().strftime('%Y%m%d%H%M%S')}.json"
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2)
    
    logger.info(f"Generated compliance report: {report_path}")
    return report
