from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, Enum
from app.db.session import Base
from sqlalchemy.dialects.postgresql import ENUM

nivel_alerta_enum = ENUM('bajo', 'medio', 'alto', name='nivel_alerta_enum', create_type=False)

class Alert(Base):
    __tablename__ = "alertas"

    id = Column(Integer, primary_key=True, index=True)
    id_evento = Column(Integer, ForeignKey("eventos.id"), nullable=False)
    mensaje = Column(Text, nullable=False)
    nivel_alerta = Column(nivel_alerta_enum, nullable=False)
    fecha_alerta = Column(DateTime, default=func.now())
