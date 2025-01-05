from pydantic import BaseModel
from datetime import datetime

class AlertBase(BaseModel):
    id_evento: int
    mensaje: str
    nivel_alerta: str

class AlertCreate(AlertBase):
    pass

class AlertOut(AlertBase):
    id: int
    fecha_alerta: datetime

    class Config:
        orm_mode = True
