import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserCreate, UserLogin, UserResponse, Token
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.database import LocalDB

router = APIRouter()

@router.post("/register", response_model=Token)
def register_user(user_in: UserCreate):
    existing = LocalDB.get_user_by_email(user_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists."
        )
    
    hashed_pwd = get_password_hash(user_in.password)
    user_id = str(uuid.uuid4())
    user_record = {
        "id": user_id,
        "email": user_in.email,
        "full_name": user_in.full_name,
        "role": user_in.role,
        "is_active": True,
        "hashed_password": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    }
    
    saved = LocalDB.save_user(user_record)
    token = create_access_token(user_id)
    
    return Token(
        access_token=token,
        user=UserResponse(
            id=saved["id"],
            email=saved["email"],
            full_name=saved["full_name"],
            role=saved["role"],
            is_active=saved["is_active"],
            created_at=datetime.fromisoformat(saved["created_at"])
        )
    )

@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin):
    user = LocalDB.get_user_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
        
    token = create_access_token(user["id"])
    return Token(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            full_name=user["full_name"],
            role=user["role"],
            is_active=user["is_active"],
            created_at=datetime.fromisoformat(user["created_at"])
        )
    )

@router.get("/me", response_model=UserResponse)
def get_current_user(email: str = "demo@veritasai.com"):
    user = LocalDB.get_user_by_email(email)
    if not user:
        # Default guest/demo user auto provision
        user = {
            "id": "demo-user-123",
            "email": "demo@veritasai.com",
            "full_name": "Senior Fact Analyst",
            "role": "admin",
            "is_active": True,
            "created_at": datetime.utcnow().isoformat()
        }
    return UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        is_active=user["is_active"],
        created_at=datetime.fromisoformat(user["created_at"]) if isinstance(user["created_at"], str) else user["created_at"]
    )
