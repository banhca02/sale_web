from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AgencyCreate(BaseModel):
    name: str
    address: Optional[str] = None
    region: Optional[str] = None

class AgencyResponse(BaseModel):
    id: int
    name: str
    address: Optional[str] = None
    region: Optional[str] = None
    sale_id: int
    created_at: datetime

    class Config:
        from_attributes = True