from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List

from app.api.dependencies import get_db, get_current_user
from app.crud import crud_user 
from app.models.user import User, AdminRoleLevel
from app.schemas.user import LoginRequest, UserResponse, SaleResponse, SaleCreate
from app.core.security import verify_password, create_access_token
from app.core.config import settings
from datetime import timedelta

router = APIRouter()

@router.post("/", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
def create_new_sale(
    payload: SaleCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.admin_profile or current_user.admin_profile.admin_level != AdminRoleLevel.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Quyền truy cập bị từ chối. Chỉ tài khoản 'Super Admin' mới có quyền tạo nhân viên Sale mới."
        )
    existing_user = crud_user.get_sale_by_email(db, email=payload.user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email '{payload.user.email}' đã được đăng ký trên hệ thống."
        )
    
    return crud_user.create_sale_staff(db, payload=payload)

@router.post("/login", summary="Đăng nhập vào hệ thống và nhận HttpOnly Cookie")
def login(
    payload: LoginRequest, 
    response: Response, 
    db: Session = Depends(get_db)
):
    user = crud_user.get_sale_by_email(db, email=payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác."
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, 
        expires_delta=access_token_expires
    )

    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True, 
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES, 
        expires=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        samesite="lax", 
        secure=False, #lên production nhớ chỉnh qua True
    )

    return {"message": "Đăng nhập thành công, Cookie đã được thiết lập!"}


@router.post("/logout", summary="Đăng xuất khỏi hệ thống và xóa sạch Cookie")
def logout(response: Response):
    """Xóa bỏ cookie bằng cách đặt thời hạn hết hạn ngay lập tức."""
    response.delete_cookie(key="access_token")
    return {"message": "Đăng xuất thành công."}


@router.get("/me", summary="Lấy thông tin và phân quyền tài khoản đang đăng nhập")
def get_me(current_user: User = Depends(get_current_user)):
    role = "sale"
    if current_user.admin_profile is not None:
        role = "admin"
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "role": role
    }

@router.get(
    "/sales/", 
    response_model=List[SaleResponse],  
    summary="[ADMIN ONLY] Lấy danh sách toàn bộ nhân viên Sale"
)
def list_sales_for_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.admin_profile is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền quản trị để truy cập tài nguyên này."
        )
        
    return crud_user.get_all_sales_for_admin(db)