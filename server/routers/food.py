from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import shutil
import os
import uuid
import sys
import datetime

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import schemas, crud, auth, models
from database import get_db

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/food/analyze", response_model=list[schemas.FoodItemAnalysis])
async def analyze_food_image(file: UploadFile = File(...), current_user: models.User = Depends(auth.get_current_user)):
    # 1. Read file content once
    content = await file.read()
    
    # 2. Save file
    file_extension = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(content)
        
    # 3. Process image with Gemini API
    try:
        # Call Gemini Service
        from services import gemini
        detected_foods = gemini.analyze_image(content)
        
        return detected_foods
        
    except Exception as e:
        # Log error to file for debugging
        with open("error.log", "a") as log:
            log.write(f"[{datetime.datetime.now()}] Error analyzing image: {str(e)}\n")
        print(f"Error analyzing image: {e}")
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")

@router.post("/food/log", response_model=schemas.FoodLog)
async def log_food(
    log_data: schemas.FoodLogCreate, 
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate total
    total_calories = sum(item.calories for item in log_data.items)
    
    # Create Log
    db_log = models.FoodLog(
        user_id=current_user.id,
        image_url=log_data.image_url,
        total_calories=total_calories,
        timestamp=datetime.datetime.utcnow()
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    
    # Create Items
    for item in log_data.items:
        db_item = models.FoodItem(
            log_id=db_log.id,
            name=item.name,
            calories=item.calories,
            portion_size=item.portion_size,
            confidence_score=item.confidence_score
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_log)
    return db_log

@router.get("/food/history", response_model=list[schemas.FoodLog])
async def get_food_history(
    skip: int = 0, 
    limit: int = 100, 
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.FoodLog).filter(models.FoodLog.user_id == current_user.id).order_by(models.FoodLog.timestamp.desc()).offset(skip).limit(limit).all()
