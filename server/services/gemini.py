import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Fallback or warning - for now we just print/log
    print("Warning: GEMINI_API_KEY not found in environment variables")
else:
    genai.configure(api_key=api_key)

def analyze_image(image_bytes: bytes):
    """
    Analyzes an image using Google Gemini API to identify food items,
    calories, portion sizes, and confidence scores.
    """
    if not api_key:
        raise ValueError("Gemini API Key is missing. Please set GEMINI_API_KEY in .env file.")

    model = genai.GenerativeModel('gemini-flash-latest')

    prompt = """
    Analyze this image and identify all food items present. 
    For each item, estimate the calories and portion size.
    Return a JSON array where each object has these fields:
    - name: string (name of the food)
    - calories: integer (estimated calories)
    - portion_size: string (e.g., "1 cup", "100g", "1 slice")
    - confidence_score: float (0.0 to 1.0)
    
    Return ONLY valid JSON. Do not include markdown formatting like ```json ... ```.
    """

    try:
        # Gemini accepts bytes directly for image parts
        image_part = {
            "mime_type": "image/jpeg", # Assuming JPEG or PNG, Gemini handles common formats
            "data": image_bytes
        }

        response = model.generate_content([prompt, image_part])
        
        # Clean up response text in case it contains markdown
        text = response.text.replace("```json", "").replace("```", "").strip()
        
        return json.loads(text)
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        # Return fallback/empty list on error to prevent creating valid-looking but wrong data
        # Or re-raise to handle in router
        raise e
