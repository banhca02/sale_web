from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base 

class Agency(Base):
    __tablename__ = "agencies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    address = Column(Text, nullable=True)
    region = Column(String(100), nullable=True)
    sale_id = Column(Integer, ForeignKey("sales.user_id", ondelete="RESTRICT"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Quan hệ ngược về Sale
    sale = relationship("Sale", back_populates="agencies")
    
    # Quan hệ 1-N tới Track records (nhận diện qua chuỗi "TrackRecord")
    track_records = relationship("TrackRecord", back_populates="agency", cascade="all, delete-orphan")