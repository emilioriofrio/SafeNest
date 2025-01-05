from sqlalchemy.orm import Session
from app.db.models.event import Event
from app.schemas.event import EventCreate

def create_event(event: EventCreate, db: Session):
    """Crea un nuevo evento"""
    db_event = Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_events(db: Session):
    """Obtiene todos los eventos"""
    return db.query(Event).all()
