from pydantic import BaseModel
from typing import Optional
import datetime

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserProfileUpdate(BaseModel):
    age: int
    gender: str
    height: float
    weight: float
    activity_level: str
    goal: str

class User(UserBase):
    id: int
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    daily_calorie_target: Optional[int] = None

    class Config:
        from_attributes = True # pydantic v2

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class FoodItemAnalysis(BaseModel):
    name: str
    calories: int
    portion_size: str
    confidence_score: float

class FoodItemCreate(BaseModel):
    name: str
    calories: int
    portion_size: str
    confidence_score: Optional[float] = None

class FoodItem(FoodItemCreate):
    id: int
    log_id: int
    class Config:
        from_attributes = True

class FoodLogCreate(BaseModel):
    image_url: Optional[str] = None
    items: list[FoodItemCreate]

class FoodLog(BaseModel):
    id: int
    user_id: int
    timestamp: datetime.datetime
    image_url: Optional[str] = None
    total_calories: int
    items: list[FoodItem] = []
    
    class Config:
        from_attributes = True
