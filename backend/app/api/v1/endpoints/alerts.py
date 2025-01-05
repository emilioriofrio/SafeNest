from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.alert import Alert
from app.schemas.alert import AlertCreate, AlertOut

router = APIRouter()

@router.get("/", response_model=list[AlertOut])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).all()

@router.post("/", response_model=AlertOut)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    db_alert = Alert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert
