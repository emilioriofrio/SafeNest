from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

class User(Base):
    __tablename__ = "usuarios"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), nullable=False)
    contrasena = Column(String(255), nullable=False)
    rol = Column(Enum("superadministrador", "administrador", "colaborador", name="rol_enum"), nullable=False)
    fecha_creacion = Column(DateTime, default=func.now())
