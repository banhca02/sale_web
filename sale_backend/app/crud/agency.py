from sqlalchemy.orm import Session
from app.models.agency import Agency
from app.models.user import User, Sale, UserStatus
import app.schemas.agency as agency_schemas
from typing import List, Dict

def create_agency(db: Session, payload: agency_schemas.AgencyCreate, sale_id: int) -> Agency | None:

    sale_active_exists = (
        db.query(Sale)
        .join(User, Sale.user_id == User.id)
        .filter(Sale.user_id == sale_id)
        .filter(User.status == UserStatus.ACTIVE) 
        .first()
    )
    if not sale_active_exists:
        return None

    db_agency = Agency(
        name=payload.name,
        address=payload.address,
        region=payload.region,
        sale_id=sale_id
    )
    
    db.add(db_agency)
    db.commit()     
    db.refresh(db_agency)
    return db_agency

def get_agencies_by_sale_paginated(
    db: Session, 
    sale_id: int, 
    skip: int = 0, 
    limit: int = 10
) -> Dict[str, List[Agency]]:
    
    base_query = db.query(Agency).filter(Agency.sale_id == sale_id)
    total_count = base_query.count()
    agencies = (
        base_query
        .order_by(Agency.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    return {
        "total": total_count,
        "items": agencies
    }