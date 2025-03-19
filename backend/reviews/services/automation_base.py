
"""
Base service for review automation
"""
import asyncio
import logging
import random

logger = logging.getLogger(__name__)

class BaseAutomationService:
    """Base class for automation services"""
    
    def __init__(self, proxy_service=None):
        self.proxy_service = proxy_service
    
    async def _human_typing(self, element, text):
        """
        Type text with random delays to simulate human typing
        
        Parameters:
        element: Playwright element to type into
        text: Text to type
        """
        await element.click()
        
        for char in text:
            await element.type(char, delay=random.uniform(50, 150))
            
            # Occasionally pause while typing
            if random.random() < 0.1:
                await asyncio.sleep(random.uniform(0.5, 2.0))
