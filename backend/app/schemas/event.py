from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EventBase(BaseModel):
    id_sensor: int
    tipo_evento: str
    nivel_sonido: Optional[int]

class EventCreate(EventBase):
    pass

class EventOut(EventBase):
    id: int
    fecha_evento: datetime

    class Config:
        orm_mode = True
