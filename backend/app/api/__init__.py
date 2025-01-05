from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, areas, sensors, logs, events, alerts

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(areas.router, prefix="/areas", tags=["Areas"])
api_router.include_router(sensors.router, prefix="/sensors", tags=["Sensors"])
api_router.include_router(logs.router, prefix="/logs", tags=["Logs"])
api_router.include_router(events.router, prefix="/events", tags=["Events"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
