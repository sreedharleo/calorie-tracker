import google.generativeai as genai
import os
import json
import io
from PIL import Image
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
    Optimizes image size before sending to API to save memory/bandwidth.
    """
    if not api_key:
        raise ValueError("Gemini API Key is missing. Please set GEMINI_API_KEY in .env file.")

    # 1. Optimize Image
    try:
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed (e.g. for PNGs with alpha)
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # Resize if too large (max 1024x1024) while maintaining aspect ratio
        max_size = (1024, 1024)
        image.thumbnail(max_size, Image.LANCZOS)
        
        # Compress to JPEG
        output_buffer = io.BytesIO()
        image.save(output_buffer, format='JPEG', quality=85, optimize=True)
        optimized_image_bytes = output_buffer.getvalue()
        
    except Exception as e:
        print(f"Error optimizing image: {e}")
        # Fallback to original bytes if optimization fails
        optimized_image_bytes = image_bytes

    model = genai.GenerativeModel('gemini-flash-latest')

    prompt = """
    Analyze this image and identify all food items present. 
    For each item, estimate the calories and portion size.
    Return a JSON array where each object has these fields:
    - name: string (name of the food)
    - calories: integer (estimated calories)
    - protein: float (grams)
    - carbs: float (grams)
    - fats: float (grams)
    - portion_size: string (e.g., "1 cup", "100g", "1 slice")
    - confidence_score: float (0.0 to 1.0)
    
    Return ONLY valid JSON. Do not include markdown formatting like ```json ... ```.
    """

    try:
        # Gemini accepts bytes directly for image parts
        image_part = {
            "mime_type": "image/jpeg", 
            "data": optimized_image_bytes
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
