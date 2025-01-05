from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum
from app.db.session import Base
from sqlalchemy.dialects.postgresql import ENUM

tipo_evento_enum = ENUM('movimiento', 'sonido', name='tipo_evento_enum', create_type=False)

class Event(Base):
    __tablename__ = "eventos"

    id = Column(Integer, primary_key=True, index=True)
    id_sensor = Column(Integer, ForeignKey("sensores.id"), nullable=False)
    tipo_evento = Column(tipo_evento_enum, nullable=False)
    nivel_sonido = Column(Integer, nullable=True)
    fecha_evento = Column(DateTime, default=func.now())
