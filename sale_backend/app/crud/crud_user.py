from sqlalchemy.orm import Session, joinedload
from app.models.user import User, Sale
from app.schemas.user import SaleCreate
from app.core.security import get_password_hash
from typing import List

# Hàm kiểm tra user tồn tại
def get_sale_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# Hàm lưu User và Sale xuống DB
def create_sale_staff(db: Session, payload: SaleCreate) -> Sale:
    DEFAULT_PASSWORD = "111111"
    pw = DEFAULT_PASSWORD
    if (payload.user.password is not None):
        pw = payload.user.password
    hashed_pwd = get_password_hash(pw)
    db_user = User(
        email=payload.user.email,
        phone=payload.user.phone,
        full_name=payload.user.full_name,
        status=payload.user.status,
        hashed_password=hashed_pwd         
    )
    db.add(db_user)
    db.flush()                         
    
    # 2. Khởi tạo đối tượng Sale con liên kết
    db_sale = Sale(
        user_id=db_user.id,
        target_revenue=payload.target_revenue
    )
    db.add(db_sale)
    db.commit()                      
    db.refresh(db_sale)
    
    return db_sale

def get_all_sales_for_admin(db: Session) -> List[Sale]:
    return (
        db.query(Sale)
        .options(joinedload(Sale.user))  
        .join(User, Sale.user_id == User.id)
        .order_by(User.created_at.desc())
        .all()
    )
