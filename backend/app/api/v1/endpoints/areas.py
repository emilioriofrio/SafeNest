from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.area import Area
from app.schemas.area import AreaCreate, AreaOut

router = APIRouter()

@router.get("/", response_model=list[AreaOut])
def get_areas(db: Session = Depends(get_db)):
    return db.query(Area).all()

@router.post("/", response_model=AreaOut)
def create_area(area: AreaCreate, db: Session = Depends(get_db)):
    db_area = Area(nombre=area.nombre)
    db.add(db_area)
    db.commit()
    db.refresh(db_area)
    return db_area
