from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.sensor import Sensor
from app.schemas.sensor import SensorCreate, SensorOut

router = APIRouter()

@router.get("/", response_model=list[SensorOut])
def get_sensors(db: Session = Depends(get_db)):
    return db.query(Sensor).all()

@router.post("/", response_model=SensorOut)
def create_sensor(sensor: SensorCreate, db: Session = Depends(get_db)):
    db_sensor = Sensor(**sensor.dict())
    db.add(db_sensor)
    db.commit()
    db.refresh(db_sensor)
    return db_sensor
