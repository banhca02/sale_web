from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sale Management API"
    
    DATABASE_URL: str = "postgresql://postgres:123456@localhost:5432/pharmacy_db"
    
    SECRET_KEY: str = "chuoi_ki_tu_cuc_ky_bi_mat_khong_cho_ai_biet_123456"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        
settings = Settings()