from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from database import engine, Base
from routers import auth, profile, food

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Calorie Tracker API")

if not os.path.exists("uploads"):
    os.makedirs("uploads")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, verify this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["auth"])
app.include_router(profile.router, tags=["profile"])
app.include_router(food.router, tags=["food"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Calorie Tracker API", "status": "running"}
