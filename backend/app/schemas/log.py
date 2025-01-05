from pydantic import BaseModel
from datetime import datetime

class LogBase(BaseModel):
    usuario_id: int
    accion: str

class LogOut(LogBase):
    id: int
    fecha: datetime

    class Config:
        orm_mode = True
