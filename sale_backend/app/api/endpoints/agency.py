from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.api.dependencies import get_db, get_current_user
from app.crud import agency as crud_agency
import app.schemas.agency as agency_schemas
from app.models.user import User

router = APIRouter(
    prefix="/agency",
    tags=["Agencies"]
)

@router.post(
    "/", 
    response_model=agency_schemas.AgencyResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Thêm mới Đại lý và gán cho một nhân viên Sale"
)
def create_new_agency(
    payload: agency_schemas.AgencyCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) 
):
    new_agency = crud_agency.create_agency(db, payload=payload, sale_id=current_user.id)
    if not new_agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy nhân viên Sale với ID {payload.sale_id} để gán Đại lý."
        )
    return new_agency


@router.get(
    "/", 
    summary="Lấy danh sách Đại lý phân trang thuộc quyền quản lý của Sale hiện tại"
)
def list_my_agencies(
    skip: int = Query(default=0, ge=0, description="Số lượng bản ghi cần bỏ qua"),
    limit: int = Query(default=10, ge=1, le=100, description="Số lượng bản ghi tối đa lấy về một lượt"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_agency.get_agencies_by_sale_paginated(
        db=db, 
        sale_id=current_user.id, 
        skip=skip, 
        limit=limit
    )