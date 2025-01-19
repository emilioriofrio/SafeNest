import { useState, useEffect } from "react";
import axios from "axios";

const MenuAdmi = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [administrators, setAdministrators] = useState([]);
  const [filteredCollaborators, setFilteredCollaborators] = useState([]);
  const [filteredAdministrators, setFilteredAdministrators] = useState([]);
  const [searchCollaborators, setSearchCollaborators] = useState("");
  const [searchAdministrators, setSearchAdministrators] = useState("");
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    ubicacion: "",
    sensoresSonido: 0,
    sensoresMovimiento: 0,
    usuarioId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Obtener usuarios colaboradores, administradores y solicitudes de compra
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://tight-lexis-safenest-83078a32.koyeb.app/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const collaboratorsData = response.data.filter(
          (user) => user.rol === "colaborador"
        );
        const administratorsData = response.data.filter(
          (user) => user.rol === "administrador"
        );

        setCollaborators(collaboratorsData);
        setFilteredCollaborators(collaboratorsData);

        setAdministrators(administratorsData);
        setFilteredAdministrators(administratorsData);

        // Obtener solicitudes de compra
        const purchaseResponse = await axios.get(
          "https://tight-lexis-safenest-83078a32.koyeb.app/purchase-requests",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPurchaseRequests(purchaseResponse.data);
      } catch (error) {
        setMessage("Error al cargar datos. Inténtalo nuevamente.");
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filtrar colaboradores en tiempo real
    setFilteredCollaborators(
      collaborators.filter((user) =>
        user.nombre.toLowerCase().includes(searchCollaborators.toLowerCase())
      )
    );
  }, [searchCollaborators, collaborators]);

  useEffect(() => {
    // Filtrar administradores en tiempo real
    setFilteredAdministrators(
      administrators.filter((user) =>
        user.nombre.toLowerCase().includes(searchAdministrators.toLowerCase())
      )
    );
  }, [searchAdministrators, administrators]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validación básica
    if (!formData.ubicacion.trim()) {
      setMessage("La ubicación no puede estar vacía.");
      return;
    }
    if (formData.sensoresSonido < 0 || formData.sensoresMovimiento < 0) {
      setMessage("El número de sensores no puede ser negativo.");
      return;
    }
    if (!formData.usuarioId) {
      setMessage("Debes seleccionar un administrador.");
      return;
    }
  
    setLoading(true);
    setMessage("");
  
    try {
      // Enviar datos al backend para asignar el área y sensores
      const response = await axios.post(
        "https://tight-lexis-safenest-83078a32.koyeb.app/assign-area",
        {
          ubicacion: formData.ubicacion,
          sensoresSonido: parseInt(formData.sensoresSonido),
          sensoresMovimiento: parseInt(formData.sensoresMovimiento),
          usuarioId: parseInt(formData.usuarioId),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      // Mostrar mensaje de éxito con el área creada
      setMessage(`Instalación registrada exitosamente. ID del área: ${response.data.area_id}`);
      setFormData({
        ubicacion: "",
        sensoresSonido: 0,
        sensoresMovimiento: 0,
        usuarioId: "",
      });
    } catch (error) {
      // Manejar errores del backend
      setMessage(
        error.response?.data?.detail || "Error al registrar la instalación. Inténtalo nuevamente."
      );
      console.error("Error submitting installation:", error);
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (userId) => {
    try {
      await axios.put(
        `https://tight-lexis-safenest-83078a32.koyeb.app/update-role`,
        {
          user_id: userId,
          new_role: "administrador",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("Usuario promovido a administrador exitosamente.");
      setCollaborators((prev) => prev.filter((user) => user.id !== userId));
      setFilteredCollaborators((prev) =>
        prev.filter((user) => user.id !== userId)
      );
      setAdministrators((prev) => [
        ...prev,
        collaborators.find((user) => user.id === userId),
      ]);
    } catch (error) {
      setMessage("Error al promover usuario. Inténtalo nuevamente.");
      console.error("Error promoting user:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 to-blue-700 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Panel de SuperAdministrador</h1>

      {/* Formulario para asignar área y sensores */}
      <div className="bg-blue-800 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Asignar Área y Sensores</h2>
        {message && (
          <p
            className={`mb-4 ${
              message.includes("Error") ? "text-red-500" : "text-green-300"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
              className="text-black w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
              className="text-black w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Asignar a Usuario (Administrador)
            </label>
            <select
              name="usuarioId"
              value={formData.usuarioId}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>
                Selecciona un administrador
              </option>
              {filteredAdministrators.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nombre}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 rounded-lg shadow-md text-white font-semibold ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-700 transition duration-200"
            }`}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Realizar Instalación"}
          </button>
        </form>
      </div>

      {/* Buscador y listado de colaboradores */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Colaboradores</h2>
        <input
          type="text"
          value={searchCollaborators}
          onChange={(e) => setSearchCollaborators(e.target.value)}
          placeholder="Buscar colaboradores..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-4 text-black"
        />
        <ul className="space-y-4">
          {filteredCollaborators.map((user) => (
            <li
              key={user.id}
              className="bg-blue-800 p-4 rounded-lg flex justify-between items-center"
            >
              <span>
                {user.nombre} - {user.rol}
              </span>
              <button
                onClick={() => promoteUser(user.id)}
                className="bg-yellow-500 px-3 py-1 rounded-lg hover:bg-yellow-700 transition duration-200"
              >
                Promover a Administrador
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Buscador y listado de administradores */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Administradores</h2>
        <input
          type="text"
          value={searchAdministrators}
          onChange={(e) => setSearchAdministrators(e.target.value)}
          placeholder="Buscar administradores..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-4 text-black"
        />
        <ul className="space-y-4">
          {filteredAdministrators.map((user) => (
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
