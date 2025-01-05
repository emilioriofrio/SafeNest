from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SensorBase(BaseModel):
    tipo: str
    estado: str
    area_id: int

class SensorCreate(SensorBase):
    pass

class SensorOut(SensorBase):
    id: int
    fecha_instalacion: datetime

    class Config:
        orm_mode = True
