import { useState, useEffect } from "react";
import axios from "axios";

const MenuAdmi = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    ubicacion: "",
    sensoresSonido: 0,
    sensoresMovimiento: 0,
    usuarioId: "",
  });

  useEffect(() => {
    // Obtener usuarios administradores
    const fetchUsers = async () => {
      try {
        const response = await axios.get("tight-lexis-safenest-83078a32.koyeb.app/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Si usas token
          },
        });
        setUsers(response.data.filter((user) => user.rol === "administrador"));
      } catch (error) {
        setMessage("Error al cargar usuarios",error);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar datos al backend para asignar el área y sensores
      await axios.post(
        "tight-lexis-safenest-83078a32.koyeb.app/assign-area",
        {
          ubicacion: formData.ubicacion,
          sensoresSonido: parseInt(formData.sensoresSonido),
          sensoresMovimiento: parseInt(formData.sensoresMovimiento),
          usuarioId: formData.usuarioId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("Instalación registrada exitosamente.");
      setFormData({
        ubicacion: "",
        sensoresSonido: 0,
        sensoresMovimiento: 0,
        usuarioId: "",
      });
    } catch (error) {
      setMessage("Error al registrar la instalación.",error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 to-blue-700 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Panel de SuperAdministrador</h1>

      {/* Formulario para asignar área y sensores */}
      <div className="bg-blue-800 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Asignar Área y Sensores</h2>
        {message && <p className="text-green-300 mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej. Calle 123, Ciudad"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Número de Sensores de Sonido
            </label>
            <input
              type="number"
              name="sensoresSonido"
              value={formData.sensoresSonido}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Número de Sensores de Movimiento
            </label>
            <input
              type="number"
              name="sensoresMovimiento"
              value={formData.sensoresMovimiento}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Asignar a Usuario</label>
            <select
              name="usuarioId"
              value={formData.usuarioId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>
                Selecciona un usuario administrador
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nombre}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 px-4 py-2 rounded-lg shadow-md text-white font-semibold hover:bg-green-700 transition duration-200"
          >
            Realizar Instalación
          </button>
        </form>
      </div>

      {/* Listado de usuarios administradores */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Usuarios Administradores</h2>
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-blue-800 p-4 rounded-lg flex justify-between"
            >
              <span>
                {user.nombre} - {user.rol}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuAdmi;
