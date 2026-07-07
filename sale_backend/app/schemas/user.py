from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime
from app.models.user import UserStatus, AdminRoleLevel

# --- USER SCHEMAS (BASE) ---
class UserBase(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    full_name: str
    status: UserStatus = UserStatus.ACTIVE

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# --- SALE SCHEMAS ---
class SaleCreate(BaseModel):
    user: UserCreate
    target_revenue: Decimal = Decimal("0.00")

class SaleResponse(BaseModel):
    user_id: int
    target_revenue: Decimal
    user: UserResponse

    class Config:
        from_attributes = True


# --- ADMIN SCHEMAS ---
class AdminCreate(BaseModel):
    user: UserBase
    admin_level: AdminRoleLevel = AdminRoleLevel.MODERATOR

class AdminResponse(BaseModel):
    user_id: int
    admin_level: AdminRoleLevel
    user: UserResponse

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str