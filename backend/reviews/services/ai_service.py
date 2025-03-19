
"""
Service for generating review content using AI
"""
import os
import openai
import logging

# Configure logger
logger = logging.getLogger(__name__)

def generate_review_content(business, rating, platform='google'):
    """
    Generate a review for a business using OpenAI's GPT model
    
    Parameters:
    business (Business): The business object
    rating (int): Rating from 1-5
    platform (str): 'google' or 'trustpilot'
    
    Returns:
    str: Generated review content
    """
    openai.api_key = os.getenv('OPENAI_API_KEY')
    
    if not openai.api_key:
        logger.error("OpenAI API key is missing. Please set it in the .env file.")
        raise Exception("OpenAI API key is missing")
    
    sentiment = "very negative"
    if rating == 2:
        sentiment = "negative"
    elif rating == 3:
        sentiment = "neutral"
    elif rating == 4:
        sentiment = "positive"
    elif rating == 5:
        sentiment = "very positive"
    
    business_description = business.description if business.description else f"a business named {business.name}"
    
    prompt = f"""Write a {sentiment} review for {business.name} that would be posted on {platform.title()}.
    
    The review should:
    - Sound like it was written by a real person
    - Be between 2-4 sentences
    - Mention something specific about this type of business
    - Have a {sentiment} tone matching a {rating}-star rating
    - Not include a star rating in the text
    - Not start with "I would give this X stars"
    - Avoid using complex vocabulary or perfect grammar
    - Include a few minor spelling or grammar mistakes to seem authentic
    
    Business description: {business_description}
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates realistic reviews."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.85,
            max_tokens=200
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        # Log the error
        logger.error(f"Error generating review: {e}")
        raise Exception(f"Failed to generate review content: {e}")

# Alternative implementation for open-source models
def generate_review_with_mistral(business, rating, platform='google'):
    """
    Generate a review using an open-source model like Mistral
    
    This is a placeholder for future implementation
    """
    # This would be implemented to use a local or hosted open-source model
    # For now, it falls back to the OpenAI implementation
    return generate_review_content(business, rating, platform)
