
"""
Service for scheduling review posting and handling queues
"""
import logging
import asyncio
from datetime import datetime, timedelta
from threading import Thread
from ..models import Review
from .review_automation import ReviewAutomationService
from proxies.services.proxy_service import ProxyService

logger = logging.getLogger(__name__)

class ReviewScheduler:
    """Manages the scheduling and processing of reviews to be posted"""
    
    def __init__(self):
        self.proxy_service = ProxyService()
        self.automation_service = ReviewAutomationService(self.proxy_service)
        self.running = False
        self.thread = None
    
    def start(self):
        """Start the scheduler in a background thread"""
        if not self.running:
            self.running = True
            self.thread = Thread(target=self._run_scheduler)
            self.thread.daemon = True
            self.thread.start()
            logger.info("Review scheduler started")
    
    def stop(self):
        """Stop the scheduler"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=5)
            logger.info("Review scheduler stopped")
    
    def _run_scheduler(self):
        """Run the scheduler loop"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        while self.running:
            try:
                # Process any reviews that are scheduled for now or in the past
                self._process_pending_reviews(loop)
                # Sleep for a minute before checking again
                loop.run_until_complete(asyncio.sleep(60))
            except Exception as e:
                logger.error(f"Error in scheduler: {e}")
                loop.run_until_complete(asyncio.sleep(300))  # Sleep longer on error
    
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
                # Update status to in_progress
                review.status = 'in_progress'
                review.save(update_fields=['status'])
                
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
                else:
                    review.status = 'failed'
                    review.error_message = error
                    review.save(update_fields=['status', 'error_message'])
                    logger.error(f"Failed to publish review {review.id}: {error}")
                
                # Avoid rate limiting
                loop.run_until_complete(asyncio.sleep(5))
                
            except Exception as e:
                logger.error(f"Error processing review {review.id}: {e}")
                review.status = 'failed'
                review.error_message = str(e)
                review.save(update_fields=['status', 'error_message'])

# Create a global instance of the scheduler
scheduler = ReviewScheduler()
