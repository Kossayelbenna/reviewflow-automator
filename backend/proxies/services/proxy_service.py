
"""
Service for managing proxies and VPNs
"""
import os
import random
import requests
import logging
from datetime import datetime, timedelta
from ..models import Proxy, ProxyUsageLog

logger = logging.getLogger(__name__)


class ProxyService:
    """Service for managing residential proxies and VPNs"""
    
    def __init__(self):
        self.bright_data_username = os.getenv('BRIGHT_DATA_USERNAME')
        self.bright_data_password = os.getenv('BRIGHT_DATA_PASSWORD')
    
    def refresh_proxies_from_provider(self, provider='brightdata', count=10, country='US'):
        """
        Fetch new proxies from the provider
        
        Parameters:
        provider (str): Provider name ('brightdata' for Bright Data/Luminati)
        count (int): Number of proxies to fetch
        country (str): Two-letter country code
        
        Returns:
        dict: Result with count of refreshed proxies
        """
        if provider.lower() == 'brightdata':
            return self._refresh_brightdata_proxies(count, country)
        else:
            raise ValueError(f"Unsupported proxy provider: {provider}")
    
    async def get_residential_proxy(self, country=None, platform=None, business=None, account=None):
        """
        Get an available residential proxy
        
        Parameters:
        country (str): Two-letter country code, optional
        platform (str): The platform the proxy will be used for, optional
        business (Business): The business the proxy will be used for, optional
        account (Account): The account the proxy will be used for, optional
        
        Returns:
        Proxy: Available proxy object
        """
        # Build the query for available proxies
        query = Proxy.objects.filter(
            status='available', 
            type='residential'
        )
        
        if country:
            query = query.filter(country=country)
        
        # Get proxies that haven't been used recently
        cutoff_time = datetime.now() - timedelta(hours=24)
        query = query.filter(last_used__isnull=True) | query.filter(last_used__lt=cutoff_time)
        
        # Get a random proxy from the available ones
        proxies = list(query)
        if not proxies:
            # If no available proxies, try to get one that's not blocked
            query = Proxy.objects.filter(
                status='available',
                type='residential',
                blocked_until__isnull=True
            ) | Proxy.objects.filter(
                status='available',
                type='residential',
                blocked_until__lt=datetime.now()
            )
            proxies = list(query)
            
            if not proxies:
                # If still no proxies, try to refresh from provider
                self.refresh_proxies_from_provider()
                proxies = list(Proxy.objects.filter(status='available', type='residential'))
                
                if not proxies:
                    raise Exception("No available proxies found")
        
        proxy = random.choice(proxies)
        
        # Update proxy status
        proxy.status = 'in_use'
        proxy.last_used = datetime.now()
        proxy.save(update_fields=['status', 'last_used'])
        
        # Log proxy usage
        ProxyUsageLog.objects.create(
            proxy=proxy,
            platform=platform or '',
            business=business,
            account=account
        )
        
        return proxy
    
    def mark_proxy_as_blocked(self, proxy, platform=None, business=None, error_message=None):
        """
        Mark a proxy as blocked
        
        Parameters:
        proxy (Proxy): The proxy to mark as blocked
        platform (str): The platform where the proxy was blocked, optional
        business (Business): The business for which the proxy was blocked, optional
        error_message (str): Error message, optional
        """
        # Update proxy status
        proxy.status = 'blocked'
        proxy.blocked_until = datetime.now() + timedelta(days=7)  # Block for 7 days
        proxy.save(update_fields=['status', 'blocked_until'])
        
        # Update usage log
        if platform:
            # Find the most recent usage log for this proxy
            try:
                log = ProxyUsageLog.objects.filter(proxy=proxy).latest('used_at')
                log.success = False
                log.error_message = error_message or 'Proxy blocked'
                log.save(update_fields=['success', 'error_message'])
            except ProxyUsageLog.DoesNotExist:
                # Create a new log if none exists
                ProxyUsageLog.objects.create(
                    proxy=proxy,
                    platform=platform,
                    business=business,
                    success=False,
                    error_message=error_message or 'Proxy blocked'
                )
    
    def mark_proxy_as_available(self, proxy):
        """
        Mark a proxy as available again
        
        Parameters:
        proxy (Proxy): The proxy to mark as available
        """
        proxy.status = 'available'
        proxy.save(update_fields=['status'])
    
    def _refresh_brightdata_proxies(self, count=10, country='US'):
        """
        Refresh proxies from Bright Data (Luminati)
        
        Parameters:
        count (int): Number of proxies to fetch
        country (str): Two-letter country code
        
        Returns:
        dict: Result with count of refreshed proxies
        """
        if not self.bright_data_username or not self.bright_data_password:
            raise ValueError("Bright Data credentials not configured")
        
        # This is a placeholder for the actual API call to Bright Data
        # In a real implementation, you would call their API to get fresh IPs
        
        # For demonstration, we'll create some dummy proxies
        created_count = 0
        
        for i in range(count):
            # Generate dummy IP (in a real implementation, these would come from the API)
            dummy_ip = f"192.168.{random.randint(1, 254)}.{random.randint(1, 254)}"
            dummy_port = random.randint(10000, 60000)
            
            # Create proxy in database
            Proxy.objects.create(
                ip=dummy_ip,
                port=dummy_port,
                username=self.bright_data_username,
                password=self.bright_data_password,
                type='residential',
                country=country,
                provider='brightdata',
                status='available'
            )
            
            created_count += 1
        
        return {
            'count': created_count,
            'provider': 'brightdata'
        }
