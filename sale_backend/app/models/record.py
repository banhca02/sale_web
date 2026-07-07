import enum
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Numeric, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base 

class TrackStatus(str, enum.Enum):
    NEW = "Mới"
    CONTACTED = "Đã liên hệ"
    POTENTIAL = "Tiềm năng"
    WON = "Chốt"
    LOST = "Mất"

class TrackRecord(Base):
    __tablename__ = "track_records"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(150), nullable=False)
    estimated_revenue = Column(Numeric(15, 2), default=0.00)
    status = Column(
        Enum(TrackStatus, values_callable=lambda obj: [e.value for e in obj]), 
        default=TrackStatus.NEW, 
        nullable=False
    )
    notes = Column(Text, nullable=True)
    agency_id = Column(Integer, ForeignKey("agencies.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Quan hệ ngược về Agency
    agency = relationship("Agency", back_populates="track_records")