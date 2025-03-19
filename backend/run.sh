
#!/bin/bash
# Script to run the Django development server

echo "Activating virtual environment..."
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "Creating virtual environment..."
    python -m venv venv
    source venv/bin/activate
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

echo "Running migrations..."
python manage.py migrate

echo "Starting development server..."
python manage.py runserver
