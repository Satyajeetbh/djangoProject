import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def generate_recipe_from_name(recipe_name):
    """
    Calls OpenAI to generate a recipe based on the provided name.
    Returns a dictionary matching the Recipe model fields.
    """
    if not os.environ.get("OPENAI_API_KEY"):
        raise ValueError("OPENAI_API_KEY is not set in environment variables.")

    prompt = f"""
    Generate a detailed recipe for: '{recipe_name}'.
    You must return a JSON object with the exact following structure and types:
    {{
        "title": "String - the name of the recipe",
        "description": "String - a short, appetizing description",
        "ingredients": "String - the list of ingredients, with each ingredient on a new line",
        "instructions": "String - step-by-step instructions, with each step on a new line or numbered",
        "calories": Integer - estimated total calories per serving,
        "protein": Float - estimated protein in grams,
        "fat": Float - estimated fat in grams,
        "carbs": Float - estimated carbs in grams,
        "dietary_type": "String - must be exactly one of: 'none', 'vegan', 'vegetarian', 'gluten_free'"
    }}
    Do not include any formatting like ```json or markdown, just the raw JSON object.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert culinary chef. Output only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        # Ensure dietary_type is valid
        valid_dietary_types = ['none', 'vegan', 'vegetarian', 'gluten_free']
        if data.get('dietary_type') not in valid_dietary_types:
            data['dietary_type'] = 'none'
            
        return data
        
    except Exception as e:
        print(f"Error generating recipe: {e}")
        return None
