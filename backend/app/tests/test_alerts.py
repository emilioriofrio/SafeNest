import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.db.session import SessionLocal, Base, engine
from app.db.models.alert import Alert

client = TestClient(app)

# Configuración inicial para pruebas
@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)  # Crear tablas
    db = SessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)  # Limpiar tablas

def test_create_alert(db: Session):
    """Prueba la creación de una alerta"""
    response = client.post(
        "/alerts/",
        json={
            "id_evento": 1,
            "mensaje": "Alerta de prueba",
            "nivel_alerta": "medio",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["mensaje"] == "Alerta de prueba"

def test_get_alerts(db: Session):
    """Prueba la obtención de alertas"""
    # Crear alerta directamente en la base de datos
    db_alert = Alert(id_evento=1, mensaje="Alerta de prueba", nivel_alerta="medio")
    db.add(db_alert)
    db.commit()

    response = client.get("/alerts/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["mensaje"] == "Alerta de prueba"
