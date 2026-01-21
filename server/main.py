from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import users_collection
from models import User, UserInDB
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import timedelta
import os
from dotenv import load_dotenv

from routes import tables, iot

load_dotenv()

app = FastAPI()

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]
# ... inside main.py ...

app.include_router(tables.router)
app.include_router(iot.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

@app.get("/")
def read_root():
    return {"message": "Restaurant IoT API is running"}

@app.post("/api/auth/login")
async def login(user: User):
    admin_username = os.getenv("ADMIN_USERNAME")
    admin_password = os.getenv("ADMIN_PASSWORD")
    
    if user.username != admin_username or user.password != admin_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Include routers later
# app.include_router(tables.router)
# app.include_router(iot.router)
