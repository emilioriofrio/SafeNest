import os
import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from passlib.context import CryptContext
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Cargar variables de entorno
load_dotenv()

# Variables de conexión
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Crear conexión a la base de datos
def get_db_connection():
    try:
        connection = psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME
        )
        return connection
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")

# Configuración para hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# FastAPI app
app = FastAPI(title="Auth API", version="1.0.0")

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Cambiar al dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class UserRegister(BaseModel):
    nombre: str
    correo: str
    contrasena: str
    rol: str

class UserLogin(BaseModel):
    correo: str
    contrasena: str

# Registro de usuario
@app.post("/register")
def register_user(user: UserRegister):
    connection = get_db_connection()
    cursor = connection.cursor()

    # Validar rol
    valid_roles = {"superadministrador", "administrador", "colaborador"}
    if user.rol not in valid_roles:
        raise HTTPException(status_code=400, detail="Invalid role")

    # Hashear la contraseña
    hashed_password = pwd_context.hash(user.contrasena)

    try:
        # Insertar usuario
        cursor.execute(
            """
            INSERT INTO Usuarios (nombre, correo, contrasena, rol)
            VALUES (%s, %s, %s, %s)
            RETURNING id;
            """,
            (user.nombre, user.correo, hashed_password, user.rol)
        )
        user_id = cursor.fetchone()[0]
        connection.commit()
        return {"message": "User registered successfully", "user_id": user_id}

    except psycopg2.IntegrityError:
        connection.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")

    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {e}")

    finally:
        cursor.close()
        connection.close()

# Inicio de sesión
@app.post("/login")
def login_user(user: UserLogin):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Buscar usuario
        cursor.execute(
            "SELECT id, contrasena FROM Usuarios WHERE correo = %s;",
            (user.correo,)
        )
        result = cursor.fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="User not found")

        user_id, hashed_password = result

        # Verificar contraseña
        if not pwd_context.verify(user.contrasena, hashed_password):
            raise HTTPException(status_code=401, detail="Invalid password")

        return {"message": "Login successful", "user_id": user_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {e}")

    finally:
        cursor.close()
        connection.close()

# Verificar API
@app.get("/")
def root():
    return {"message": "Auth API is running"}
