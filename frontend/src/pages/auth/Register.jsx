import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("colaborador"); // Rol por defecto
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    // Validaciones básicas
    if (!name.trim()) {
      setIsError(true);
      setMessage("El nombre no puede estar vacío.");
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setIsError(true);
      setMessage("Por favor, ingresa un correo válido.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setIsError(true);
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/register/", {
        nombre: name,
        correo: email,
        contrasena: password,
        rol: role,
      });

      setMessage(response.data.message);

      // Limpiar campos y redirigir al inicio de sesión
      setName("");
      setEmail("");
      setPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.detail || "Error al registrar. Inténtalo nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Registrarse
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu nombre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu correo"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Crea una contraseña"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="superadministrador">Superadministrador</option>
              <option value="administrador">Administrador</option>
              <option value="colaborador">Colaborador</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              isError ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
        <p className="mt-4 text-center text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-700 font-medium hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
