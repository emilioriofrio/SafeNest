import React, { useState, useEffect } from "react";
import axios from "axios";

const MenuAdmi = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Obtener usuarios que no son superadministradores
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Si usas token
          },
        });
        setUsers(response.data);
      } catch (error) {
        setMessage("Error al cargar usuarios",error);
      }
    };
    fetchUsers();
  }, []);

  const promoteUser = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:8000/promote-user/${userId}`,
        { rol: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("Usuario promovido exitosamente");
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, rol: newRole } : user
        )
      );
    } catch (error) {
      setMessage("Error al promover usuario",error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 to-blue-700 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Panel de SuperAdministrador</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Usuarios</h2>
        {message && <p className="text-green-300 mt-2">{message}</p>}
        <ul className="mt-4 space-y-2">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between bg-blue-800 p-4 rounded-lg">
              <span>
                {user.nombre} - {user.rol}
              </span>
              <div className="flex space-x-2">
                {user.rol !== "administrador" && (
                  <button
                    onClick={() => promoteUser(user.id, "administrador")}
                    className="bg-green-500 px-3 py-1 rounded-lg"
                  >
                    Promover a Administrador
                  </button>
                )}
                {user.rol !== "colaborador" && (
                  <button
                    onClick={() => promoteUser(user.id, "colaborador")}
                    className="bg-yellow-500 px-3 py-1 rounded-lg"
                  >
                    Promover a Colaborador
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuAdmi;
