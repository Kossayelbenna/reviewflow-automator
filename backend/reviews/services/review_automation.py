
"""
Service for automating the posting of reviews using Playwright
"""
import logging
from .google_automation import GoogleAutomationService
from .trustpilot_automation import TrustpilotAutomationService

logger = logging.getLogger(__name__)

class ReviewAutomationService:
    """Service for automating the posting of reviews to different platforms"""
    
    def __init__(self, proxy_service=None):
        self.proxy_service = proxy_service
        self.google_automation = GoogleAutomationService(proxy_service)
        self.trustpilot_automation = TrustpilotAutomationService(proxy_service)
    
    async def post_google_review(self, review):
        """
        Post a review to Google using the Google automation service
        
        Parameters:
        review (Review): The review object with business and content info
        
        Returns:
        bool: Success status
        str: Error message if failed
        """
        return await self.google_automation.post_review(review)
    
    async def post_trustpilot_review(self, review):
        """
        Post a review to Trustpilot using the Trustpilot automation service
        
        Parameters:
        review (Review): The review object with business and content info
        
        Returns:
        bool: Success status
        str: Error message if failed
        """
        return await self.trustpilot_automation.post_review(review)
