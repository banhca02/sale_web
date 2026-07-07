from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

# Cấu hình thuật toán mã hóa mật khẩu cực mạnh (Bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hàm kiểm tra mật khẩu nhân viên nhập vào có khớp với mật khẩu trong DB không
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Hàm băm mật khẩu trước khi lưu xuống Database lúc tạo mới nhân viên
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Hàm tạo JWT Token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt