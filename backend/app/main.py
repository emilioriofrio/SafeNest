import os
import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
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

class UpdateUserRole(BaseModel):
    user_id: int
    new_role: str

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
            "SELECT id, contrasena, rol FROM Usuarios WHERE correo = %s;",
            (user.correo,)
        )
        result = cursor.fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="User not found")

        user_id, hashed_password, role = result

        # Verificar contraseña
        if not pwd_context.verify(user.contrasena, hashed_password):
            raise HTTPException(status_code=401, detail="Invalid password")

        return {"message": "Login successful", "user_id": user_id, "role": role}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {e}")

    finally:
        cursor.close()
        connection.close()

# Obtener usuarios (solo superadministradores)
@app.get("/users")
def get_users():
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Obtener usuarios que no sean superadministradores
        cursor.execute("SELECT id, nombre, correo, rol FROM Usuarios WHERE rol != 'superadministrador';")
        users = cursor.fetchall()

        return [
            {"id": user[0], "nombre": user[1], "correo": user[2], "rol": user[3]} for user in users
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve users: {e}")
    finally:
        cursor.close()
        connection.close()

# Actualizar rol de un usuario (solo superadministradores)
@app.put("/update-role")
def update_user_role(data: UpdateUserRole):
    connection = get_db_connection()
    cursor = connection.cursor()

    # Validar rol
    valid_roles = {"administrador", "colaborador"}
    if data.new_role not in valid_roles:
        raise HTTPException(status_code=400, detail="Invalid role")

    try:
        # Actualizar rol del usuario
        cursor.execute(
            """
            UPDATE Usuarios
            SET rol = %s
            WHERE id = %s AND rol != 'superadministrador';
            """,
            (data.new_role, data.user_id)
        )
        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="User not found or cannot modify superadministrador")

        return {"message": "User role updated successfully"}

    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update role: {e}")

    finally:
        cursor.close()
        connection.close()

# Verificar API
@app.get("/")
def root():
    return {"message": "Auth API is running"}
