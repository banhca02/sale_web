import enum
from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base 

class UserStatus(str, enum.Enum):
    ACTIVE = "Đang làm"
    INACTIVE = "Nghỉ việc"

class AdminRoleLevel(str, enum.Enum):
    SUPER_ADMIN = "Super Admin"
    MANAGER = "Manager"
    MODERATOR = "Moderator"

# Bảng Gốc: users
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(20), unique=True, nullable=True)
    full_name = Column(String(100), nullable=False)
    status = Column(
        Enum(UserStatus, values_callable=lambda obj: [e.value for e in obj]), 
        default=UserStatus.ACTIVE, 
        nullable=False
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Quan hệ 1-1 tới bảng con
    sale_profile = relationship("Sale", uselist=False, back_populates="user", cascade="all, delete")
    admin_profile = relationship("Admin", uselist=False, back_populates="user", cascade="all, delete")


# Bảng Con: sales (Liên kết 1-1 với users)
class Sale(Base):
    __tablename__ = "sales"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    target_revenue = Column(Numeric(15, 2), default=0.00, nullable=False)

    # Lập quan hệ ngược về User
    user = relationship("User", back_populates="sale_profile")
    
    # Quan hệ 1-N tới Agencies (import dạng chuỗi "Agency" để tránh circular import)
    agencies = relationship("Agency", back_populates="sale", cascade="all, delete-orphan")


# Bảng Con: admins (Liên kết 1-1 với users)
class Admin(Base):
    __tablename__ = "admins"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    admin_level = Column(
        Enum(AdminRoleLevel, values_callable=lambda obj: [e.value for e in obj]), 
        default=AdminRoleLevel.MODERATOR, 
        nullable=False
    )

    user = relationship("User", back_populates="admin_profile")