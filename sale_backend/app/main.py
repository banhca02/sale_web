from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import api_router


app = FastAPI(
    title="Sale Management API",
    description="Hệ thống quản lý sale",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

# API kiểm tra trạng thái Server (Mặc định)
@app.get("/", tags=["Hệ thống"])
def root():
    return {"message": "Server Sale Đang Hoạt Động Tốt!"}