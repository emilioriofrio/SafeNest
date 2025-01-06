import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Por favor, ingresa un correo válido.");
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const response = await axios.post("http://localhost:8000/login/", {
        correo: email,
        contrasena: password,
      });
      setMessage(`Bienvenido, ${response.data.nombre || "usuario"}`);
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Error al iniciar sesión. Inténtalo nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-red-500 font-medium">{message}</p>
        )}
        <p className="mt-4 text-center text-gray-600">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-blue-700 font-medium hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
