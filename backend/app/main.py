import os
import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import List
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime


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
    allow_origins=["http://localhost:5173","https://safe-nest.vercel.app"],  # Cambiar al dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Modelo para la solicitud de un plan
class PlanRequest(BaseModel):
    user_id: int
    plan_name: str

# Modelo para unirse a un grupo
class GroupRequest(BaseModel):
    user_id: int
    group_id: int

# Modelo para solicitar información
class ServiceInfoRequest(BaseModel):
    user_id: int
    message: str
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

# Modelo de solicitud para "realizar instalación"
class InstallationRequest(BaseModel):
    area_name: str
    user_id: int
    num_sound_sensors: int
    num_motion_sensors: int

# Modelo de solicitud para asignar un área
class AssignAreaRequest(BaseModel):
    ubicacion: str
    sensoresSonido: int
    sensoresMovimiento: int
    usuarioId: int

# Modelo de solicitud
class UpdateSensorRequest(BaseModel):
    sensor_id: int
    estado: str
    ultima_actividad: str  # Formato ISO 8601 (YYYY-MM-DDTHH:MM:SS)
    ubicacion: str

# Modelo de solicitud
class UpdateSensorRequest(BaseModel):
    sensor_id: int
    estado: str
    ultima_actividad: str  # Formato ISO 8601 (YYYY-MM-DDTHH:MM:SS)
    ubicacion: str
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
        # Agregar logs para verificar los datos de entrada
        print(f"Attempting to update role for user_id: {data.user_id} to {data.new_role}")

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

        # Verificar si se realizó algún cambio
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="User not found or cannot modify superadministrador")

        return {"message": "User role updated successfully"}

    except Exception as e:
        # Agregar logs para el error
        print(f"Error updating role: {e}")
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update role: {e}")

    finally:
        cursor.close()
        connection.close()



@app.post("/install")
def perform_installation(request: InstallationRequest):
    connection = get_db_connection()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        # Verificar que el usuario es administrador
        cursor.execute("SELECT rol FROM usuarios WHERE id = %s;", (request.user_id,))
        user = cursor.fetchone()
        if not user or user["rol"] != "administrador":
            raise HTTPException(status_code=403, detail="El usuario no tiene permisos para realizar esta acción.")

        # Crear el área
        cursor.execute(
            """
            INSERT INTO areas (nombre, usuario_id)
            VALUES (%s, %s)
            RETURNING id;
            """,
            (request.area_name, request.user_id)
        )
        area_id = cursor.fetchone()["id"]

        # Crear sensores de sonido
        for _ in range(request.num_sound_sensors):
            cursor.execute(
                """
                INSERT INTO sensores (tipo, estado, area_id)
                VALUES ('KY-038', 'activo', %s);
                """,
                (area_id,)
            )

        # Crear sensores de movimiento
        for _ in range(request.num_motion_sensors):
            cursor.execute(
                """
                INSERT INTO sensores (tipo, estado, area_id)
                VALUES ('PIR', 'activo', %s);
                """,
                (area_id,)
            )

        # Confirmar transacción
        connection.commit()
        return {"message": "Instalación completada exitosamente", "area_id": area_id}

    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error al realizar la instalación: {e}")

    finally:
        cursor.close()
        connection.close()

# Endpoint para solicitar un plan
@app.post("/request-plan/")
def request_plan(plan_request: PlanRequest):
    connection = get_db_connection()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        # Validar datos de entrada
        if not plan_request.user_id or not plan_request.plan_name:
            raise HTTPException(status_code=400, detail="Missing user_id or plan_name")

        # Insertar la solicitud en la base de datos
        cursor.execute(
            """
            INSERT INTO plan_requests (user_id, plan_name, status, created_at)
            VALUES (%s, %s, 'pending', NOW())
            RETURNING id;
            """,
            (plan_request.user_id, plan_request.plan_name),
        )
        result = cursor.fetchone()
        request_id = result["id"]
        connection.commit()

        return {"message": "Plan request submitted successfully.", "request_id": request_id}
    except psycopg2.Error as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing plan request: {str(e)}")
    finally:
        cursor.close()
        connection.close()


# Endpoint para unirse a un grupo
@app.post("/join-group/")
def join_group(group_request: GroupRequest):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Insertar la solicitud de unirse al grupo
        cursor.execute(
            """
            INSERT INTO group_requests (user_id, group_id, status, created_at)
            VALUES (%s, %s, 'pending', NOW())
            RETURNING id;
            """,
            (group_request.user_id, group_request.group_id),
        )
        request_id = cursor.fetchone()["id"]
        connection.commit()
        return {"message": "Group join request submitted successfully.", "request_id": request_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing group join request: {str(e)}")
    finally:
        cursor.close()
        connection.close()
# Endpoint para solicitar los pagos
@app.get("/purchase-requests")
def get_purchase_requests():
    connection = get_db_connection()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        # Consultar todas las solicitudes de compra
        cursor.execute("""
            SELECT pr.id, u.nombre AS nombreUsuario, pr.plan_name, pr.status, pr.created_at
            FROM plan_requests pr
            INNER JOIN usuarios u ON pr.user_id = u.id
            WHERE pr.status = 'pending';
        """)
        requests = cursor.fetchall()
        return requests

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching purchase requests: {e}")

    finally:
        cursor.close()
        connection.close()


# Endpoint para solicitar información del servicio
@app.post("/request-service-info/")
def request_service_info(service_info_request: ServiceInfoRequest):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Insertar la solicitud de información del servicio
        cursor.execute(
            """
            INSERT INTO service_info_requests (user_id, message, created_at)
            VALUES (%s, %s, NOW())
            RETURNING id;
            """,
            (service_info_request.user_id, service_info_request.message),
        )
        request_id = cursor.fetchone()["id"]
        connection.commit()
        return {"message": "Service information request submitted successfully.", "request_id": request_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing service info request: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.post("/assign-area")
def assign_area(request: AssignAreaRequest):
    connection = get_db_connection()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        # Verificar si el usuario tiene el rol correcto (administrador)
        cursor.execute("SELECT rol FROM usuarios WHERE id = %s;", (request.usuarioId,))
        user = cursor.fetchone()
        if not user or user["rol"] != "administrador":
            raise HTTPException(status_code=403, detail="El usuario no tiene permisos para esta acción.")

        # Crear un área para el usuario
        cursor.execute(
            """
            INSERT INTO areas (nombre, fecha_registro, usuario_id)
            VALUES (%s, NOW(), %s)
            RETURNING id;
            """,
            (request.ubicacion, request.usuarioId)
        )
        area_id = cursor.fetchone()["id"]

        # Insertar sensores de sonido (ajustar al valor correcto del enum)
        for _ in range(request.sensoresSonido):
            cursor.execute(
                """
                INSERT INTO sensores (tipo, estado, area_id, fecha_instalacion)
                VALUES ('KY-038', 'activo', %s, NOW());
                """,
                (area_id,)
            )

        # Insertar sensores de movimiento (ajustar al valor correcto del enum)
        for _ in range(request.sensoresMovimiento):
            cursor.execute(
                """
                INSERT INTO sensores (tipo, estado, area_id, fecha_instalacion)
                VALUES ('PIR', 'activo', %s, NOW());
                """,
                (area_id,)
            )

        # Confirmar la transacción
        connection.commit()

        return {"message": "Área y sensores asignados correctamente.", "area_id": area_id}

    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error asignando área y sensores: {str(e)}")
    finally:
        cursor.close()
        connection.close()
@app.put("/degrade-admin")
def degrade_admin(data: UpdateUserRole):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            UPDATE usuarios
            SET rol = 'colaborador'
            WHERE id = %s AND rol = 'administrador';
            """,
            (data.user_id,)
        )
        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Admin not found or already a collaborator")

        return {"message": "Administrador degradado a colaborador exitosamente"}

    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating role: {e}")

    finally:
        cursor.close()
        connection.close()
@app.get("/admin-logs/{admin_id}")
def get_admin_logs(admin_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute(
            """
            SELECT logs.id, logs.accion, logs.fecha, logs.sensor_id
            FROM logs
            JOIN sensores ON logs.sensor_id = sensores.id
            JOIN areas ON sensores.area_id = areas.id
            WHERE areas.usuario_id = %s;
            """,
            (admin_id,)
        )
        logs = cursor.fetchall()
        return logs

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching logs: {e}")

    finally:
        cursor.close()
        connection.close()

@app.post("/update-sensor")
def update_sensor(request: UpdateSensorRequest):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        # Actualizar información del sensor
        cursor.execute(
            """
            UPDATE sensores
            SET estado = %s, ultima_actividad = %s, ubicacion = %s
            WHERE id = %s;
            """,
            (request.estado, request.ultima_actividad, request.ubicacion, request.sensor_id)
        )
        connection.commit()

        # Verificar si se realizó algún cambio
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Sensor no encontrado.")

        return {"message": "Sensor actualizado correctamente."}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar el sensor: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.post("/logs")
async def post_logs(request: Request):
    try:
        data = await request.json()
        # Validar los datos enviados
        sensor_id = data.get("sensor_id")
        estado = data.get("estado")

        if sensor_id is None or estado is None:
            raise HTTPException(status_code=400, detail="Datos incompletos en la solicitud")

        # Conexión a la base de datos
        connection = get_db_connection()
        cursor = connection.cursor()

        # Verificar si el sensor existe
        cursor.execute("SELECT id FROM sensores WHERE id = %s;", (sensor_id,))
        if cursor.fetchone() is None:
            raise HTTPException(status_code=404, detail="Sensor no registrado")

        # Determinar la acción según los valores permitidos en el enum
        accion = "Detectado" if estado == 1 else "Inactivo"

        # Actualizar estado y última actividad del sensor
        cursor.execute(
            """
            UPDATE sensores
            SET estado = %s, ultima_actividad = %s
            WHERE id = %s;
            """,
            ("activo" if estado == 1 else "inactivo", datetime.now(), sensor_id)
        )

        # Registrar en la tabla de logs
        cursor.execute(
            """
            INSERT INTO logs (sensor_id, accion, fecha)
            VALUES (%s, %s, %s);
            """,
            (sensor_id, accion, datetime.now())
        )

        connection.commit()

        return {"status": "success", "message": f"Log registrado correctamente para sensor {sensor_id}"}

    except Exception as e:
        return {"status": "error", "message": str(e)}
        status_code=500
    finally:
        connection.close()


@app.get("/logs")
def get_logs(limit: int = 50):
    connection = get_db_connection()
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    try:
        # Obtener los registros más recientes de los logs
        cursor.execute(
            """
            SELECT logs.id, sensores.tipo, logs.accion, logs.fecha
            FROM logs
            JOIN sensores ON logs.sensor_id = sensores.id
            ORDER BY logs.fecha DESC
            LIMIT %s;
            """,
            (limit,)
        )
        logs = cursor.fetchall()
        return logs

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo los logs: {e}")
    finally:
        cursor.close()
        connection.close()


# Ejemplo de endpoint actualizado
@app.get("/sensors")
def get_sensors():
    connection = get_db_connection()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute("""
            SELECT s.id, s.tipo, s.estado, a.nombre AS ubicacion, s.fecha_instalacion
            FROM sensores s
            INNER JOIN areas a ON s.ubicacion = a.id;
        """)
        sensors = cursor.fetchall()
        return sensors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sensors: {e}")
    finally:
        cursor.close()
        connection.close()

# Verificar API
@app.get("/")
def root():
    return {"message": "Auth API is running"}
