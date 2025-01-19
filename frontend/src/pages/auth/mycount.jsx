import { useState, useEffect } from "react";
import axios from "axios";

const MyCount = () => {
  const [user, setUser] = useState(null); // Datos del usuario
  const [editMode, setEditMode] = useState(false); // Modo de edición
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    nuevaContrasena: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Recuperar datos del usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        nombre: userData.nombre,
        correo: userData.correo,
        contrasena: "",
        nuevaContrasena: "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      // Realizar la petición para actualizar los datos del usuario
      const response = await axios.put(
        `https://tight-lexis-safenest-83078a32.koyeb.app/users/${user.user_id}`,
        {
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
          nuevaContrasena: formData.nuevaContrasena,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Datos actualizados exitosamente.");
      setEditMode(false);
      // Actualizar datos en localStorage y en el estado
      const updatedUser = {
        ...user,
        nombre: formData.nombre,
        correo: formData.correo,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      setMessage("Error al actualizar los datos. Inténtalo nuevamente.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <p className="text-white text-center">Cargando información...</p>;
  }

  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 to-blue-700 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Mi Cuenta</h1>

      {/* Mensaje de éxito o error */}
      {message && (
        <p
          className={`mb-4 ${
            message.includes("Error") ? "text-red-500" : "text-green-300"
          }`}
        >
          {message}
        </p>
      )}

      {/* Información del usuario */}
      <div className="bg-blue-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Información Personal</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            {editMode ? (
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            ) : (
              <p>{user.nombre}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Correo</label>
            {editMode ? (
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            ) : (
              <p>{user.correo}</p>
            )}
          </div>
        </div>
      </div>

      {/* Cambiar contraseña */}
      {editMode && (
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Cambiar Contraseña</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Contraseña Actual
              </label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                name="nuevaContrasena"
                value={formData.nuevaContrasena}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex space-x-4">
        {editMode ? (
          <>
            <button
              onClick={handleSaveChanges}
              className={`bg-green-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-700 transition duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-red-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-700 transition duration-200"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-200"
          >
            Editar Información
          </button>
        )}
      </div>
    </div>
  );
};

export default MyCount;
