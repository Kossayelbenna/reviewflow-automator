
"""
Mock services for testing automation without using real external services
"""
import logging
import asyncio
import random
from datetime import datetime

logger = logging.getLogger(__name__)

class MockProxyService:
    """Mock implementation of proxy service for testing"""
    
    async def get_residential_proxy(self, country=None, platform=None, business=None, account=None):
        """
        Get a mock proxy for testing
        
        Returns:
        dict: Mock proxy details
        """
        logger.info(f"[MOCK] Getting proxy for {platform} in {country}")
        await asyncio.sleep(random.uniform(0.2, 0.5))  # Simulate network delay
        
        return {
            'ip': f"192.168.{random.randint(1, 254)}.{random.randint(1, 254)}",
            'port': random.randint(10000, 60000),
            'username': 'mock_username',
            'password': 'mock_password',
            'type': 'residential',
            'country': country or 'US'
        }
    
    def mark_proxy_as_blocked(self, proxy, platform=None, business=None, error_message=None):
        """Mark a mock proxy as blocked"""
        logger.info(f"[MOCK] Marking proxy {proxy['ip']} as blocked: {error_message}")


class MockAutomationService:
    """Mock implementation of review automation service for testing"""
    
    def __init__(self, mode="test"):
        self.mode = mode
        self.success_rate = 0.9  # 90% success rate in test mode
    
    async def post_review(self, review):
        """
        Simulate posting a review without actually doing it
        
        Parameters:
        review (Review): The review to post
        
        Returns:
        bool: Success status (simulated)
        str: Error message if failed
        """
        logger.info(f"[MOCK] Posting {review.platform} review for {review.business.name}")
        
        # Simulate the review posting process with delays
        await asyncio.sleep(random.uniform(2.0, 5.0))
        
        # Randomly succeed or fail based on configured success rate
        if random.random() < self.success_rate:
            logger.info(f"[MOCK] Successfully posted review: {review.content[:30]}...")
            review.status = 'published'
            review.published_at = datetime.now()
            review.save(update_fields=['status', 'published_at'])
            return True, None
        else:
            error = "Simulated random failure"
            logger.warning(f"[MOCK] Failed to post review: {error}")
            review.status = 'failed'
            review.error_message = error
            review.save(update_fields=['status', 'error_message'])
            return False, error


class MockAccountService:
    """Mock implementation of account service for testing"""
    
    async def get_account(self, platform):
        """Get a mock account for testing"""
        logger.info(f"[MOCK] Getting {platform} account")
        await asyncio.sleep(random.uniform(0.2, 0.5))
        
        return {
            'email': f"test{random.randint(1000, 9999)}@example.com",
            'password': 'mock_password',
            'first_name': random.choice(["John", "Jane", "Sam", "Alex"]),
            'last_name': random.choice(["Smith", "Jones", "Johnson", "Williams"]),
        }
    
    async def mark_account_used(self, account, success=True):
        """Mark a mock account as used"""
        logger.info(f"[MOCK] Marking account {account['email']} as used (success: {success})")
