from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User
from crud import verify_password, get_password_hash
# from database import filter # This import was wrong/unused

# Setup DB connection
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def debug_users():
    users = db.query(User).all()
    print(f"Total Users: {len(users)}")
    for user in users:
        print(f"ID: {user.id}, Email: {user.email}, Hashed: {user.hashed_password[:20]}...")
        
        # Test a known password if you want (e.g. asking user what they used, or just generic)
        # We can't know the user's password, but we can check if *creating* a hash matches the scheme.
        
        test_pass = "123456" 
        print(f"  Verifying against '123456': {verify_password(test_pass, user.hashed_password)}")

if __name__ == "__main__":
    try:
        debug_users()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()
