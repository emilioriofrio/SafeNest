from pydantic import BaseModel
from datetime import datetime

class AreaBase(BaseModel):
    nombre: str

class AreaCreate(AreaBase):
    pass

class AreaOut(AreaBase):
    id: int
    fecha_registro: datetime

    class Config:
        orm_mode = True
