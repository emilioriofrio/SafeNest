from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import auth, users, areas, sensors, logs, events, alerts
from app.db.session import engine
from app.db.models import user, area, sensor, log, event, alert

# Crear las tablas automáticamente (opcional, solo en desarrollo)
# Elimina esto en producción si utilizas migraciones
user.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PIR Security API",
    description="API para gestionar usuarios, áreas, sensores, eventos y alertas de PIR Security.",
    version="1.0.0",
)

# Configuración de CORS
origins = [
    "http://localhost:3000",  # Cambia esto según el origen de tu frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los routers/endpoints
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(areas.router, prefix="/areas", tags=["Areas"])
app.include_router(sensors.router, prefix="/sensors", tags=["Sensors"])
app.include_router(logs.router, prefix="/logs", tags=["Logs"])
app.include_router(events.router, prefix="/events", tags=["Events"])
app.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the PIR Security API"}
