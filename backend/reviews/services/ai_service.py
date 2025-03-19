
"""
Service for generating review content using AI
"""
import os
import openai


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
    
    sentiment = "very negative"
    if rating == 2:
        sentiment = "negative"
    elif rating == 3:
        sentiment = "neutral"
    elif rating == 4:
        sentiment = "positive"
    elif rating == 5:
        sentiment = "very positive"
    
    prompt = f"""Write a {sentiment} review for {business.name} that would be posted on {platform.title()}.
    
    The review should:
    - Sound like it was written by a real person
    - Be between 2-4 sentences
    - Mention something specific about this type of business
    - Have a {sentiment} tone matching a {rating}-star rating
    - Not include a star rating in the text
    - Not start with "I would give this X stars"
    - Avoid using complex vocabulary or perfect grammar
    
    Business description: {business.description}
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
        print(f"Error generating review: {e}")
        raise Exception(f"Failed to generate review content: {e}")


# TODO: Add function for using an open-source model like Mistral in the future
# def generate_review_with_mistral(business, rating, platform='google'):
#     """Implementation for open-source model generation to be added"""
#     pass
