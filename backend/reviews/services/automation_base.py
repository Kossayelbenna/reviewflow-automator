
"""
Base service for review automation
"""
import asyncio
import logging
import random
import json

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
    
    async def _setup_anti_detection(self, context):
        """
        Configure browser context to avoid bot detection
        
        Parameters:
        context: Playwright browser context
        """
        # Hide automation flags
        await context.add_init_script("""
            // Override properties that detect automation
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            
            // Override permissions
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' || parameters.name === 'midi' ? 
                Promise.resolve({ state: 'granted' }) : 
                originalQuery(parameters)
            );
            
            // Prevent detection via WebGL
            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                if (parameter === 37445) {
                    return 'Intel Open Source Technology Center';
                }
                if (parameter === 37446) {
                    return 'Mesa DRI Intel(R) HD Graphics 4000 (IVB GT2)';
                }
                return getParameter.apply(this, arguments);
            };
        """)
        
        # Set custom timezone and locale
        await context.add_init_script("""
            // Override timezone and locale
            const dateToString = Date.prototype.toString;
            Date.prototype.toString = function() {
                return dateToString.apply(this).replace(/GMT\\+\\d{4}/, 'GMT+0000');
            };
        """)
    
    async def _randomize_mouse_movement(self, page, element):
        """
        Move the mouse in a human-like pattern to an element
        
        Parameters:
        page: Playwright page
        element: Target element
        """
        # Get element position
        bbox = await element.bounding_box()
        if not bbox:
            return
            
        # Current mouse position (defaults to 0,0)
        current_x, current_y = 0, 0
        
        # Target position (center of element with some randomness)
        target_x = bbox['x'] + bbox['width'] * random.uniform(0.4, 0.6)
        target_y = bbox['y'] + bbox['height'] * random.uniform(0.4, 0.6)
        
        # Generate random control points for bezier curve to simulate natural movement
        control_x = (current_x + target_x) / 2 + random.uniform(-100, 100)
        control_y = (current_y + target_y) / 2 + random.uniform(-100, 100)
        
        # Number of steps for the movement
        steps = random.randint(10, 20)
        
        for i in range(1, steps + 1):
            # Bezier curve formula for t from 0 to 1
            t = i / steps
            t_inv = 1 - t
            
            # Quadratic bezier curve calculation
            pos_x = t_inv**2 * current_x + 2 * t_inv * t * control_x + t**2 * target_x
            pos_y = t_inv**2 * current_y + 2 * t_inv * t * control_y + t**2 * target_y
            
            # Move mouse and add small random delay
            await page.mouse.move(pos_x, pos_y)
            await asyncio.sleep(random.uniform(0.01, 0.05))
        
        # Add a small delay before clicking
        await asyncio.sleep(random.uniform(0.1, 0.3))
    
    async def _random_scroll(self, page):
        """
        Perform random scrolling to simulate human behavior
        
        Parameters:
        page: Playwright page
        """
        # Get page height
        page_height = await page.evaluate("document.body.scrollHeight")
        view_height = await page.evaluate("window.innerHeight")
        
        if page_height <= view_height:
            return
            
        # Scroll down randomly
        steps = random.randint(3, 8)
        for _ in range(steps):
            scroll_amount = random.randint(100, 400)
            await page.evaluate(f"window.scrollBy(0, {scroll_amount})")
            await asyncio.sleep(random.uniform(0.5, 2.0))
            
        # Sometimes scroll back up a bit
        if random.random() < 0.7:
            await page.evaluate(f"window.scrollBy(0, {-random.randint(50, 200)})")
            await asyncio.sleep(random.uniform(0.5, 1.5))
    
    def _get_random_user_agent(self):
        """
        Get a random user agent to avoid detection
        
        Returns:
        str: Random user agent string
        """
        user_agents = [
            # Chrome on Windows
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
            
            # Chrome on Mac
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
            
            # Firefox on Windows
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0',
            
            # Firefox on Mac
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:90.0) Gecko/20100101 Firefox/90.0',
            
            # Safari on Mac
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
        ]
        
        return random.choice(user_agents)
    
    def _get_random_viewport_size(self):
        """
        Get a random viewport size to avoid fingerprinting
        
        Returns:
        dict: Viewport width and height
        """
        viewports = [
            {'width': 1366, 'height': 768},  # Most common
            {'width': 1920, 'height': 1080},  # Full HD
            {'width': 1440, 'height': 900},   # Common on Mac
            {'width': 1536, 'height': 864},   # Common on Windows
            {'width': 1280, 'height': 720},   # HD
            {'width': 1680, 'height': 1050},  # Common on larger displays
        ]
        
        return random.choice(viewports)
