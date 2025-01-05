from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.log import Log
from app.schemas.log import LogOut

router = APIRouter()

@router.get("/", response_model=list[LogOut])
def get_logs(db: Session = Depends(get_db)):
    return db.query(Log).all()
