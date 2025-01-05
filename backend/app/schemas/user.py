from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    nombre: str
    correo: EmailStr
    rol: str

class UserCreate(UserBase):
    contrasena: str

class UserLogin(BaseModel):
    correo: EmailStr
    contrasena: str

class UserOut(UserBase):
    id: int
    fecha_creacion: datetime

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    nombre: Optional[str]
    correo: Optional[EmailStr]
    rol: Optional[str]
