# Este archivo permite que el directorio sea tratado como un módulo.
from app.db.session import Base, engine
from app.db.models import user, alert

# Crear todas las tablas automáticamente si no existen
Base.metadata.create_all(bind=engine)
