import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  const phrases = [
    "Protegiendo lo que más importa.",
    "Tu seguridad, nuestra misión.",
    "Conexión y protección inteligente.",
  ];
  const [currentPhrase, setCurrentPhrase] = useState(0);

  // Actualizar la hora en tiempo real
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Actualiza cada segundo
    return () => clearInterval(clockInterval);
  }, []);

  // Simular contador de usuarios
  useEffect(() => {
    const interval = setInterval(() => {
      setUsersCount((prevCount) => prevCount + Math.floor(Math.random() * 5 + 1));
    }, 1000); // Incrementa cada segundo
    return () => clearInterval(interval);
  }, []);

  // Cambiar la frase cada 5 segundos
  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 5000);
    return () => clearInterval(phraseInterval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen flex flex-col items-center justify-center space-y-8">
      {/* Hora Actual */}
      <div className="text-lg font-bold text-blue-300">
        {time.toLocaleTimeString()}
      </div>

      {/* Animación del planeta */}
      <div className="relative">
        {/* Esfera principal */}
        <div className="relative w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 via-blue-600 to-purple-600 shadow-lg animate-spin-slow flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-opacity-20 bg-black blur-2xl"></div>
          {/* Conexiones */}
          <div className="absolute w-full h-full rounded-full border-4 border-blue-300 flex items-center justify-center animate-pulse">
            <div className="absolute w-32 h-32 border-2 border-purple-300 rounded-full"></div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold">SafeNest</h1>
            <p className="text-sm text-blue-200">Tu seguridad, conectada</p>
          </div>
        </div>
      </div>

      {/* Frase de Seguridad */}
      <div className="text-xl text-center text-gray-300 italic">
        {phrases[currentPhrase]}
      </div>

      {/* Botón de Inicio */}
      <div>
        <button
          onClick={() => navigate("/services")}
          className="bg-blue-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-400 transition duration-300 shadow-lg"
        >
          Get Started
        </button>
      </div>

      {/* Contador de Usuarios y Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-blue-400">{usersCount}</p>
          <p className="text-sm text-gray-400">Usuarios Protegidos</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-400">128</p>
          <p className="text-sm text-gray-400">Sistemas Conectados</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-400">25</p>
          <p className="text-sm text-gray-400">Alertas Resueltas</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
