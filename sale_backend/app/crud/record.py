from sqlalchemy.orm import Session
from app.models.record import TrackRecord
from app.models.agency import Agency
import app.schemas.record as record_schemas
from app.models.user import User, Sale, UserStatus
from typing import List, Dict

def create_track_record(db: Session, payload: record_schemas.TrackRecordCreate, sale_id: int) -> TrackRecord | str | None:
    sale_active = (
        db.query(Sale)
        .join(User, Sale.user_id == User.id)
        .filter(Sale.user_id == sale_id)
        .filter(User.status == UserStatus.ACTIVE)
        .first()
    )
    if not sale_active:
        return "INACTIVE_SALE"

    agency_exists = db.query(Agency).filter(Agency.id == payload.agency_id).first()
    if not agency_exists:
        return "AGENCY_NOT_FOUND"

    db_record = TrackRecord(
        customer_name=payload.customer_name,
        estimated_revenue=payload.estimated_revenue,
        status=payload.status,  
        notes=payload.notes,
        agency_id=payload.agency_id
    )
    
    db.add(db_record)
    db.commit()             
    db.refresh(db_record)
    return db_record

def get_records_by_agency_paginated(
    db: Session, 
    agency_id: int, 
    skip: int = 0, 
    limit: int = 10
) -> Dict[str, List[TrackRecord]]:
    base_query = db.query(TrackRecord).filter(TrackRecord.agency_id == agency_id)
    total_count = base_query.count()
    records = (
        base_query
        .order_by(TrackRecord.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return {
        "total": total_count,
        "items": records
    }