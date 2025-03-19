
"""
Service for automating Google review posting
"""
import asyncio
import logging
import random
from datetime import datetime
from playwright.async_api import async_playwright
from .automation_base import BaseAutomationService

logger = logging.getLogger(__name__)

class GoogleAutomationService(BaseAutomationService):
    """Service for automating Google review posting"""
    
    async def post_review(self, review):
        """
        Post a review to Google using Playwright
        
        Parameters:
        review (Review): The review object with business and content info
        
        Returns:
        bool: Success status
        str: Error message if failed
        """
        try:
            # Get a proxy from the proxy service
            proxy = None
            if self.proxy_service:
                proxy = await self.proxy_service.get_residential_proxy()
                
            async with async_playwright() as p:
                # Configure browser with proxy if available
                browser_args = {}
                if proxy:
                    browser_args['proxy'] = {
                        'server': f'{proxy.ip}:{proxy.port}',
                    }
                    if proxy.username and proxy.password:
                        browser_args['proxy']['username'] = proxy.username
                        browser_args['proxy']['password'] = proxy.password
                
                # Launch browser with stealth mode
                browser = await p.chromium.launch(
                    headless=False,  # Set to True in production
                    args=['--no-sandbox', '--disable-blink-features=AutomationControlled']
                )
                
                # Create browser context with realistic viewport and user agent
                context = await browser.new_context(
                    viewport={'width': 1366, 'height': 768},
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    **browser_args
                )
                
                # Hide webdriver
                await context.add_init_script("""
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => false,
                    });
                """)
                
                # Create page
                page = await context.new_page()
                
                # Login to Google
                await self._login_to_google(page, review.account.email, review.account.password)
                
                # Navigate to the business page using the provided URL
                await page.goto(review.business.google_url)
                
                # Wait for random time to simulate human behavior
                await asyncio.sleep(random.uniform(3, 7))
                
                # Find and click the write review button
                await page.click('button[aria-label="Write a review"]')
                
                # Wait for the review form to appear
                await page.wait_for_selector('div[aria-label="Rating"]')
                
                # Select the rating
                await self._select_rating(page, review.rating)
                
                # Wait for random time to simulate human behavior
                await asyncio.sleep(random.uniform(2, 5))
                
                # Enter the review text
                review_textarea = await page.wait_for_selector('textarea')
                
                # Type with random delays to simulate human typing
                await self._human_typing(review_textarea, review.content)
                
                # Wait for random time to simulate human behavior
                await asyncio.sleep(random.uniform(3, 7))
                
                # Submit the review
                post_button = await page.wait_for_selector('button[aria-label="Post"]')
                await post_button.click()
                
                # Wait for submission to complete
                await asyncio.sleep(5)
                
                # Update review object with published status
                review.status = 'published'
                review.published_at = datetime.now()
                review.save(update_fields=['status', 'published_at'])
                
                # Close browser
                await browser.close()
                
                return True, None
                
        except Exception as e:
            logger.error(f"Error posting Google review: {e}")
            # Update review object with failed status
            review.status = 'failed'
            review.error_message = str(e)
            review.save(update_fields=['status', 'error_message'])
            return False, str(e)
    
    async def _login_to_google(self, page, email, password):
        """
        Log in to a Google account
        
        Parameters:
        page: Playwright page object
        email: Google account email
        password: Google account password
        """
        # Navigate to Google login page
        await page.goto('https://accounts.google.com/signin')
        
        # Enter email
        await page.fill('input[type="email"]', email)
        await page.click('#identifierNext')
        
        # Wait for password field
        await page.wait_for_selector('input[type="password"]', state='visible')
        
        # Enter password with delay
        await self._human_typing(page.locator('input[type="password"]'), password)
        
        # Click next
        await page.click('#passwordNext')
        
        # Wait for login to complete
        await page.wait_for_load_state('networkidle')
        
        # Check for 2FA or other verification prompts
        # This is a placeholder - actual implementation will need to handle various Google security prompts
    
    async def _select_rating(self, page, rating):
        """
        Select a rating on the Google review form
        
        Parameters:
        page: Playwright page object
        rating: Rating value (1-5)
        """
        # Find the rating selector
        rating_selector = await page.wait_for_selector('div[aria-label="Rating"]')
        
        # Get all the star elements
        stars = await rating_selector.query_selector_all('span')
        
        # Click on the appropriate star based on rating
        if 1 <= rating <= len(stars):
            await stars[rating - 1].click()
        else:
            # Default to 5 stars if rating is out of range
            await stars[4].click()
