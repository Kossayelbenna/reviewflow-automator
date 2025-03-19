
from django.apps import AppConfig


class ReviewsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'reviews'
    
    def ready(self):
        # Import the scheduler to start it when the application starts
        from .services.scheduler import scheduler
        scheduler.start()
