from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.api.dependencies import get_db, get_current_user
from app.crud import record as crud_record
import app.schemas.record as record_schemas
from app.models.user import User

router = APIRouter(
    prefix="/record",
    tags=["Records"]
)

@router.post(
    "/", 
    response_model=record_schemas.TrackRecordResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Thêm mới một lượt Track số cho Đại lý"
)
def create_new_track_record(
    payload: record_schemas.TrackRecordCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) 
):
    result = crud_record.create_track_record(db, payload=payload, sale_id=current_user.id)
    if result == "INACTIVE_SALE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản nhân viên Sale của bạn không hợp lệ hoặc đã bị khóa quyền thao tác."
        )   
    if result == "AGENCY_NOT_FOUND":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy Đại lý với ID {payload.agency_id} để gán Track số."
        )
    return result


@router.get("/", summary="Lấy danh sách Track số phân trang của một Đại lý")
def list_agency_records(
    agency_id: int = Query(..., description="ID của đại lý cần lấy track số"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return crud_record.get_records_by_agency_paginated(
        db=db, 
        agency_id=agency_id, 
        skip=skip, 
        limit=limit
    )