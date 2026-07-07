from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime
from app.models.record import TrackStatus

class TrackRecordCreate(BaseModel):
    customer_name: str
    estimated_revenue: Decimal = Decimal("0.00")
    status: TrackStatus = TrackStatus.NEW
    notes: Optional[str] = None
    agency_id: int

class TrackRecordResponse(BaseModel):
    id: int
    customer_name: str
    estimated_revenue: Decimal
    status: TrackStatus
    notes: Optional[str] = None
    agency_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Phục vụ cho API Dashboard
class DashboardStats(BaseModel):
    total_active_sales: int
    total_agencies: int
    total_track_records: int
    status_distribution: dict