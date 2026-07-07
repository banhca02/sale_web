from fastapi import APIRouter
from app.api.endpoints.user import router as user_router
from app.api.endpoints.agency import router as agency_router
from app.api.endpoints.record import router as record_router
from app.api.endpoints.dashboard import router as dashboard_router

api_router = APIRouter()

api_router.include_router(user_router)
api_router.include_router(agency_router)
api_router.include_router(record_router)
api_router.include_router(dashboard_router)


