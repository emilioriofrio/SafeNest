from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.db.session import Base
from sqlalchemy.dialects.postgresql import ENUM

rol_enum = ENUM('superadministrador', 'administrador', 'colaborador', name='rol_enum', create_type=False)

class User(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    contrasena = Column(String(255), nullable=False)
    rol = Column(rol_enum, nullable=False)
    fecha_creacion = Column(DateTime, default=func.now())
