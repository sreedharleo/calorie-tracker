from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    height = Column(Float, nullable=True) # cm
    weight = Column(Float, nullable=True) # kg
    activity_level = Column(String, nullable=True)
    goal = Column(String, nullable=True) # lose, maintain, gain
    
    # Calculated BMR/Target
    daily_calorie_target = Column(Integer, nullable=True)

    logs = relationship("FoodLog", back_populates="user")

class FoodLog(Base):
    __tablename__ = "food_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    image_url = Column(String, nullable=True)
    total_calories = Column(Integer, default=0)
    
    items = relationship("FoodItem", back_populates="log")
    user = relationship("User", back_populates="logs")

class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    log_id = Column(Integer, ForeignKey("food_logs.id"))
    name = Column(String)
    calories = Column(Integer)
    portion_size = Column(String, nullable=True) # e.g. "1 cup", "100g"
    confidence_score = Column(Float, nullable=True)

    log = relationship("FoodLog", back_populates="items")
