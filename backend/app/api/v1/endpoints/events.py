from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.event import Event
from app.schemas.event import EventCreate, EventOut

router = APIRouter()

@router.get("/", response_model=list[EventOut])
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).all()

@router.post("/", response_model=EventOut)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event
