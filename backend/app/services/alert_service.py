from sqlalchemy.orm import Session
from app.db.models.alert import Alert
from app.schemas.alert import AlertCreate

def create_alert(alert: AlertCreate, db: Session):
    """Crea una nueva alerta"""
    db_alert = Alert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

def get_alerts(db: Session):
    """Obtiene todas las alertas"""
    return db.query(Alert).all()
