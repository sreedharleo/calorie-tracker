from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import sys
import os

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import schemas, crud, auth, utils, models
from database import get_db

router = APIRouter()

@router.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.put("/users/me/profile", response_model=schemas.User)
async def update_user_profile(
    profile_data: schemas.UserProfileUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Update user fields
    current_user.age = profile_data.age
    current_user.gender = profile_data.gender
    current_user.height = profile_data.height
    current_user.weight = profile_data.weight
    current_user.activity_level = profile_data.activity_level
    current_user.goal = profile_data.goal
    
    # Calculate BMR and Target
    bmr = utils.calculate_bmr(
        weight=current_user.weight,
        height=current_user.height,
        age=current_user.age,
        gender=current_user.gender
    )
    
    target = utils.calculate_daily_target(
        bmr=bmr,
        activity_level=current_user.activity_level,
        goal=current_user.goal
    )
    
    current_user.daily_calorie_target = target
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    return current_user
