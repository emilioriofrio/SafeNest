from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.core.security import hash_password, verify_password, create_access_token
from app.db.models.user import User
from app.schemas.user import UserCreate

def register_user(user: UserCreate, db: Session):
    """Registra un nuevo usuario"""
    hashed_password = hash_password(user.contrasena)
    db_user = User(nombre=user.nombre, correo=user.correo, contrasena=hashed_password, rol=user.rol)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(email: str, password: str, db: Session):
    """Autentica un usuario"""
    db_user = db.query(User).filter(User.correo == email).first()
    if not db_user or not verify_password(password, db_user.contrasena):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    return db_user

def create_token(user: User):
    """Crea un token JWT para el usuario"""
    token = create_access_token({"sub": user.correo})
    return {"access_token": token, "token_type": "bearer"}
