from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import hash_password, verify_password, create_access_token
from app.db.session import get_db
from app.db.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.contrasena)
    db_user = User(nombre=user.nombre, correo=user.correo, contrasena=hashed_password, rol=user.rol)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.correo == user.correo).first()
    if not db_user or not verify_password(user.contrasena, db_user.contrasena):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = create_access_token({"sub": db_user.correo})
    return {"access_token": token, "token_type": "bearer"}
