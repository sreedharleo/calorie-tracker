import requests
import os
import sys

def test_analyze_endpoint():
    url = "http://localhost:8000/food/analyze"
    
    # Use existing image
    upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    files = [f for f in os.listdir(upload_dir) if f.endswith(('.jpg', '.png'))]
    
    if not files:
        print("No images found to test.")
        return

    image_path = os.path.join(upload_dir, files[0])
    print(f"Testing endpoint with: {image_path}")

    try:
        # We need a token if the endpoint is protected.
        # Looking at food.py: 
        # async def analyze_food_image(file: UploadFile = File(...), current_user: models.User = Depends(auth.get_current_user)):
        # It requires authentication!
        
        # We need to login first to get a token.
        print("Logging in to get token...")
        # Assuming we have a test user or can create one.
        # Let's try to login with the test user created in test_create.py (test@example.com / password123)
        
        login_url = "http://localhost:8000/token"
        login_data = {
            "username": "test@example.com",
            "password": "password123"
        }
        
        # Determine if it's form data or json. typically OAuth2PasswordRequestForm is form data
        login_res = requests.post(login_url, data=login_data)
        
        if login_res.status_code != 200:
            print(f"Login failed: {login_res.status_code} {login_res.text}")
            # Try creating user if login fails (maybe db was reset)
            print("Trying to register user...")
            reg_url = "http://localhost:8000/users/"  # Fixed URL from /auth/signup to /users/ based on auth.py
            reg_data = {"email": "test@example.com", "password": "password123"}
            requests.post(reg_url, json=reg_data)
            # Retry login
            login_res = requests.post(login_url, data=login_data)
            if login_res.status_code != 200:
                 print("Login failed again. Cannot proceed.")
                 return

        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        print("Sending image to analyze endpoint...")
        with open(image_path, "rb") as f:
            files = {"file": f}
            response = requests.post(url, headers=headers, files=files)
            
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response JSON:")
            print(response.json())
            print("SUCCESS: Endpoint returned 200 OK")
        else:
            print(f"FAILED: {response.text}")

    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_analyze_endpoint()
