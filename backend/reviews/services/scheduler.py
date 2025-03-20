
"""
Service for scheduling review posting and handling queues
"""
import logging
import asyncio
import os
import json
from datetime import datetime, timedelta
from threading import Thread
from ..models import Review
from .review_automation import ReviewAutomationService
from proxies.services.proxy_service import ProxyService

logger = logging.getLogger(__name__)

# Configure a separate logger for audit trail
audit_logger = logging.getLogger('audit')
audit_logger.setLevel(logging.INFO)
audit_handler = logging.FileHandler('audit.log')
audit_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
audit_handler.setFormatter(audit_formatter)
audit_logger.addHandler(audit_handler)
audit_logger.propagate = False

class ReviewScheduler:
    """Manages the scheduling and processing of reviews to be posted"""
    
    def __init__(self):
        self.proxy_service = ProxyService()
        self.automation_service = ReviewAutomationService(self.proxy_service)
        self.running = False
        self.thread = None
        
        # Rate limiting configuration
        self.max_reviews_per_day = int(os.getenv('MAX_REVIEWS_PER_DAY', '50'))
        self.min_interval_seconds = int(os.getenv('MIN_INTERVAL_SECONDS', '300'))  # 5 minutes
        
        # Academic mode
        self.academic_mode = os.getenv('ACADEMIC_MODE', 'True').lower() == 'true'
        if self.academic_mode:
            logger.info("Running in ACADEMIC MODE - ethical guidelines enforced")
    
    def start(self):
        """Start the scheduler in a background thread"""
        if not self.running:
            self.running = True
            self.thread = Thread(target=self._run_scheduler)
            self.thread.daemon = True
            self.thread.start()
            
            logger.info("Review scheduler started")
            audit_logger.info("Review scheduler service started")
    
    def stop(self):
        """Stop the scheduler"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=5)
            logger.info("Review scheduler stopped")
            audit_logger.info("Review scheduler service stopped")
    
    def _run_scheduler(self):
        """Run the scheduler loop"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        while self.running:
            try:
                # Check rate limits before processing
                if self._check_rate_limits():
                    # Process any reviews that are scheduled for now or in the past
                    self._process_pending_reviews(loop)
                
                # Sleep for a minute before checking again
                loop.run_until_complete(asyncio.sleep(60))
            except Exception as e:
                logger.error(f"Error in scheduler: {e}")
                loop.run_until_complete(asyncio.sleep(300))  # Sleep longer on error
    
    def _check_rate_limits(self):
        """
        Check if we're within rate limits
        
        Returns:
        bool: True if we can proceed, False if rate limited
        """
        # Check daily limit
        start_of_day = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        reviews_today = Review.objects.filter(
            published_at__gte=start_of_day,
            status='published'
        ).count()
        
        if reviews_today >= self.max_reviews_per_day:
            logger.warning(f"Daily rate limit reached: {reviews_today}/{self.max_reviews_per_day}")
            return False
        
        # Check minimum interval
        last_published = Review.objects.filter(
            status='published'
        ).order_by('-published_at').first()
        
        if last_published and last_published.published_at:
            time_since_last = (datetime.now() - last_published.published_at).total_seconds()
            if time_since_last < self.min_interval_seconds:
                logger.warning(f"Minimum interval not reached: {time_since_last}/{self.min_interval_seconds}s")
                return False
        
        return True
    
    def _process_pending_reviews(self, loop):
        """Process any pending reviews that are due for publishing"""
        now = datetime.now()
        
        # Get reviews that are scheduled for now or in the past
        pending_reviews = Review.objects.filter(
            status='pending',
            scheduled_for__lte=now
        ).order_by('scheduled_for')[:10]  # Process in batches of 10
        
        for review in pending_reviews:
            try:
                # Check academic compliance if enabled
                if self.academic_mode and not self._check_academic_compliance(review):
                    review.status = 'rejected'
                    review.error_message = "Does not meet academic guidelines"
                    review.save(update_fields=['status', 'error_message'])
                    audit_logger.warning(f"Review {review.id} rejected - does not meet academic guidelines")
                    continue
                
                # Update status to in_progress
                review.status = 'in_progress'
                review.save(update_fields=['status'])
                
                # Log the action for audit
                audit_logger.info(f"Processing review {review.id} for {review.business.name} on {review.platform}")
                self._log_audit_event("review_processing_started", {
                    "review_id": review.id,
                    "business_name": review.business.name,
                    "platform": review.platform,
                    "rating": review.rating
                })
                
                # Process the review based on the platform
                if review.platform == 'google':
                    success, error = loop.run_until_complete(
                        self.automation_service.post_google_review(review)
                    )
                elif review.platform == 'trustpilot':
                    success, error = loop.run_until_complete(
                        self.automation_service.post_trustpilot_review(review)
                    )
                else:
                    success = False
                    error = f"Unsupported platform: {review.platform}"
                
                # Update status based on result
                if success:
                    review.status = 'published'
                    review.published_at = datetime.now()
                    review.save(update_fields=['status', 'published_at'])
                    logger.info(f"Successfully published review {review.id} on {review.platform}")
                    
                    # Log success for audit
                    self._log_audit_event("review_published", {
                        "review_id": review.id,
                        "business_name": review.business.name,
                        "platform": review.platform,
                        "success": True
                    })
                else:
                    review.status = 'failed'
                    review.error_message = error
                    review.save(update_fields=['status', 'error_message'])
                    logger.error(f"Failed to publish review {review.id}: {error}")
                    
                    # Log failure for audit
                    self._log_audit_event("review_failed", {
                        "review_id": review.id,
                        "business_name": review.business.name,
                        "platform": review.platform,
                        "error": error,
                        "success": False
                    })
                
                # Avoid rate limiting
                loop.run_until_complete(asyncio.sleep(5))
                
            except Exception as e:
                logger.error(f"Error processing review {review.id}: {e}")
                review.status = 'failed'
                review.error_message = str(e)
                review.save(update_fields=['status', 'error_message'])
                
                # Log exception for audit
                self._log_audit_event("review_exception", {
                    "review_id": review.id,
                    "error": str(e),
                    "success": False
                })
    
    def _check_academic_compliance(self, review):
        """
        Check if the review meets academic guidelines
        
        Parameters:
        review (Review): The review to check
        
        Returns:
        bool: True if compliant, False otherwise
        """
        # Implement your academic guidelines here
        # Example guidelines:
        # 1. No excessive reviews for the same business
        # 2. No unrealistic ratings
        # 3. No offensive content
        
        # Check for excessive reviews
        business_reviews_count = Review.objects.filter(
            business=review.business,
            platform=review.platform,
            status__in=['published', 'in_progress']
        ).count()
        
        if business_reviews_count >= 10:  # Max 10 reviews per business
            logger.warning(f"Too many reviews for business {review.business.name}")
            return False
        
        # Check for content guidelines using basic criteria
        forbidden_words = ['fake', 'spam', 'scam', 'fraud', 'illegal']
        for word in forbidden_words:
            if word in review.content.lower():
                logger.warning(f"Review contains forbidden word: {word}")
                return False
        
        return True
    
    def _log_audit_event(self, event_type, data):
        """
        Log an event for audit purposes
        
        Parameters:
        event_type (str): Type of event
        data (dict): Event data
        """
        audit_data = {
            "timestamp": datetime.now().isoformat(),
            "event_type": event_type,
            "data": data
        }
        
        audit_logger.info(json.dumps(audit_data))

# Create a global instance of the scheduler
scheduler = ReviewScheduler()
