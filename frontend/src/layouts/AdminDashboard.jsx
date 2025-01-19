import { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [sensors, setSensors] = useState([]);
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSensors();
    fetchLogs();
  }, []);

  const fetchSensors = async () => {
    try {
      const response = await axios.get(
        "https://tight-lexis-safenest-83078a32.koyeb.app/sensors",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSensors(response.data);
    } catch (error) {
      console.error("Error fetching sensors:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        "https://tight-lexis-safenest-83078a32.koyeb.app/logs",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 to-blue-700 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Panel de Seguridad - Administrador</h1>
      
      {/* Sensores */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Sensores en la Propiedad</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sensors.map((sensor, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg ${
                sensor.estado ? "bg-red-500" : "bg-green-500"
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{sensor.tipo.toUpperCase()}</h3>
              <p className="text-sm">
                <strong>Ubicación:</strong> {sensor.ubicacion}
              </p>
              <p className="text-sm">
                <strong>Estado:</strong>{" "}
                {sensor.estado ? "Detectando actividad" : "Inactivo"}
              </p>
              <p className="text-sm">
                <strong>Última actividad:</strong>{" "}
                {sensor.ultima_actividad
                  ? new Date(sensor.ultima_actividad).toLocaleString()
                  : "Sin datos"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Logs */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Logs de Actividad</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-blue-800 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2">Fecha/Hora</th>
                <th className="px-4 py-2">Sensor</th>
                <th className="px-4 py-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="text-center">
                  <td className="px-4 py-2">
                    {new Date(log.fecha).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{log.sensor_id}</td>
                  <td className="px-4 py-2">{log.accion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mensaje */}
      {message && (
        <div className="p-4 bg-green-500 text-white rounded-lg mb-6">
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
