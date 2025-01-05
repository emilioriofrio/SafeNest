from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum
from app.db.session import Base
from sqlalchemy.dialects.postgresql import ENUM

tipo_sensor_enum = ENUM('PIR', 'KY-038', name='tipo_sensor_enum', create_type=False)
estado_sensor_enum = ENUM('activo', 'inactivo', name='estado_sensor_enum', create_type=False)

class Sensor(Base):
    __tablename__ = "sensores"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(tipo_sensor_enum, nullable=False)
    estado = Column(estado_sensor_enum, nullable=False)
    area_id = Column(Integer, ForeignKey("areas.id"), nullable=False)
    fecha_instalacion = Column(DateTime, default=func.now())
