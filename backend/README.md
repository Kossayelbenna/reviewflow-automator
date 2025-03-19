
# Review Automation Backend

This is the Django backend for the review automation system, designed to automate the posting of reviews on Google and Trustpilot.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env` and update the settings:
   ```
   cp .env.example .env
   ```

5. Run migrations:
   ```
   python manage.py migrate
   ```

6. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```
   python manage.py runserver
   ```

## API Endpoints

- `/api/reviews/businesses/` - Manage businesses
- `/api/reviews/reviews/` - Manage reviews
- `/api/reviews/generate/` - Generate review content with AI
- `/api/proxies/list/` - Manage proxies
- `/api/proxies/logs/` - View proxy usage logs
- `/api/proxies/refresh/` - Refresh proxies from provider
- `/api/accounts/list/` - Manage accounts
- `/api/accounts/jobs/` - View account creation jobs
- `/api/accounts/create-batch/` - Create batch of accounts

## System Architecture

The backend consists of three main components:

1. **Reviews** - Manages the generation and posting of reviews
2. **Proxies** - Manages residential proxies and VPNs
3. **Accounts** - Manages Google and Trustpilot accounts

## Technology Stack

- Django - Web framework
- Django REST Framework - API framework
- PostgreSQL - Database
- Playwright - Browser automation
- OpenAI GPT - AI for review generation
