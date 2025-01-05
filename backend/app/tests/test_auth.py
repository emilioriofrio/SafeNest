import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.db.session import SessionLocal, Base, engine
from app.db.models.user import User
from app.core.security import hash_password

client = TestClient(app)

# Configuración inicial para pruebas
@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)  # Crear tablas
    db = SessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)  # Limpiar tablas

def test_register_user(db: Session):
    """Prueba el registro de un usuario"""
    response = client.post(
        "/auth/register",
        json={
            "nombre": "Test User",
            "correo": "test@example.com",
            "contrasena": "password123",
            "rol": "administrador",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["correo"] == "test@example.com"

def test_login_user(db: Session):
    """Prueba el inicio de sesión de un usuario"""
    # Crear usuario directamente en la base de datos
    hashed_password = hash_password("password123")
    db_user = User(nombre="Test User", correo="test@example.com", contrasena=hashed_password, rol="administrador")
    db.add(db_user)
    db.commit()

    response = client.post(
        "/auth/login",
        json={"correo": "test@example.com", "contrasena": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
