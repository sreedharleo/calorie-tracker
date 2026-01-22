from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import models, schemas, crud
from database import engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def test_creation():
    print("Attempting to create user...")
    try:
        user_in = schemas.UserCreate(email="test@example.com", password="password123")
        user = crud.create_user(db, user_in)
        print(f"User created! ID: {user.id}")
    except Exception as e:
        print(f"FAILED to create user: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_creation()
