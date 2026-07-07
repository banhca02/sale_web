from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.dependencies import get_db, get_current_user
from app.models.agency import Agency
from app.models.record import TrackRecord
from app.models.user import User

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboarb"]
)

@router.get("/", summary="Lấy số liệu thống kê Dashboard cho Sale hiện tại")
def get_sale_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sale_id = current_user.id

    total_agencies = db.query(Agency).filter(Agency.sale_id == sale_id).count()
    total_records = (
        db.query(TrackRecord)
        .join(Agency, TrackRecord.agency_id == Agency.id)
        .filter(Agency.sale_id == sale_id)
        .count()
    )
    status_counts = (
        db.query(TrackRecord.status, func.count(TrackRecord.id))
        .join(Agency, TrackRecord.agency_id == Agency.id)
        .filter(Agency.sale_id == sale_id)
        .group_by(TrackRecord.status)
        .all()
    )
    stats_by_status = {status: count for status, count in status_counts}
    
    for status_name in ["Mới", "Đã liên hệ", "Tiềm năng", "Chốt", "Mất"]:
        stats_by_status.setdefault(status_name, 0)

    return {
        "total_agencies": total_agencies,
        "total_records": total_records,
        "status_distribution": stats_by_status
    }