import os
import sys
# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services import gemini

def test_gemini_analysis():
    # Use an existing image from uploads if available, otherwise warn
    upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    files = [f for f in os.listdir(upload_dir) if f.endswith(('.jpg', '.png'))]
    
    if not files:
        print("No images found in uploads directory to test.")
        return

    test_image_path = os.path.join(upload_dir, files[0])
    print(f"Testing with image: {test_image_path}")

    try:
        with open(test_image_path, "rb") as f:
            image_data = f.read()
            
        print("Sending request to Gemini...")
        result = gemini.analyze_image(image_data)
        
        print("\n--- Analysis Result ---")
        import json
        print(json.dumps(result, indent=2))
        
        # specific checks
        if isinstance(result, list) and len(result) > 0:
            print("\nSUCCESS: Received valid list of food items.")
            if "calories" in result[0] and "name" in result[0]:
                 print("SUCCESS: Data structure looks correct.")
        else:
            print("\nWARNING: Result format might be unexpected (not a list or empty).")

    except Exception as e:
        with open("test_output.log", "w") as log:
            log.write(f"FAILED: {e}\n")
        print(f"FAILED: {e}")

    # Write success to log if reached
    if 'result' in locals():
        with open("test_output.log", "w") as log:
            import json
            log.write(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_gemini_analysis()
