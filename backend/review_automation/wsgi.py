
"""
WSGI config for review_automation project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'review_automation.settings')

application = get_wsgi_application()
