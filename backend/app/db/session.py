from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# La URL debe ser la proporcionada por Supabase
from app.core.config import settings  # Asegúrate de tener este archivo configurado con tu conexión de Supabase

# Crear el motor de la base de datos
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=5,  # Ajusta según tus necesidades
    max_overflow=10,
)

# Crear la base declarativa
Base = declarative_base()

# Crear la fábrica de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
