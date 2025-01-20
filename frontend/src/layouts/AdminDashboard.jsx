import { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Actualiza cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get("https://tight-lexis-safenest-83078a32.koyeb.app/logs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 to-blue-700 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Panel de Seguridad - Administrador</h1>

      {/* Logs */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Logs de Actividad</h2>
        {isFetching && <p className="text-center">Cargando logs...</p>}
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
                  <td className="px-4 py-2">{new Date(log.fecha).toLocaleString()}</td>
                  <td className="px-4 py-2">{log.sensor_id}</td>
                  <td className="px-4 py-2">{log.accion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;