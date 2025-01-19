import { useState, useEffect } from "react";
import axios from "axios";

const MenuUser = () => {
  const [userRole, setUserRole] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [groupId, setGroupId] = useState("");
  const [sensorData, setSensorData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [alerts, setAlerts] = useState([]);

  const plans = [
    {
      name: "Básico",
      price: "$10/mes",
      features: [
        "1 sensor de movimiento",
        "1 sensor de sonido",
        "Soporte básico",
        "Historial de logs limitado a 7 días",
      ],
    },
    {
      name: "Estándar",
      price: "$20/mes",
      features: [
        "3 sensores de movimiento",
        "3 sensores de sonido",
        "Soporte prioritario",
        "Historial de logs limitado a 30 días",
      ],
    },
    {
      name: "Premium",
      price: "$50/mes",
      features: [
        "Sensores ilimitados",
        "Soporte 24/7",
        "Historial de logs ilimitado",
        "Alertas en tiempo real",
      ],
    },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserRole(user.role);
      if (user.role === "administrador") {
        fetchSensorData();
        fetchLogs();
        fetchAlerts();
      }
    }
  }, []);

  const fetchSensorData = async () => {
    try {
      const response = await axios.get(
        "https://tight-lexis-safenest-83078a32.koyeb.app/sensors",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSensorData(response.data);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
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

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(
        "https://tight-lexis-safenest-83078a32.koyeb.app/alerts",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const handlePlanSelect = async (plan) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("Usuario no autenticado");

      await axios.post(
        "https://tight-lexis-safenest-83078a32.koyeb.app/request-plan/",
        {
          user_id: user.user_id,
          plan_name: plan.name,
        }
      );

      setSelectedPlan(plan);
      setMessage(`Has seleccionado el plan ${plan.name}. Tu solicitud ha sido enviada.`);
    } catch (error) {
      setMessage("Error al enviar la solicitud del plan. Inténtalo nuevamente.");
      console.error(error);
    }
  };

  const handleJoinGroup = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("Usuario no autenticado");

      await axios.post(
        "https://tight-lexis-safenest-83078a32.koyeb.app/join-group/",
        {
          user_id: user.user_id,
          group_id: groupId,
        }
      );

      setMessage("Solicitud para unirse al grupo enviada exitosamente.");
      setGroupId("");
    } catch (error) {
      setMessage("Error al enviar la solicitud para unirse al grupo. Inténtalo nuevamente.");
      console.error(error);
    }
  };

  const inviteCollaborator = async () => {
    try {
      await axios.post(
        "https://tight-lexis-safenest-83078a32.koyeb.app/invite-collaborator",
        { correo: collaboratorEmail },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("Invitación enviada exitosamente.");
      setCollaboratorEmail("");
    } catch (error) {
      setMessage("Error al enviar invitación. Inténtalo nuevamente.");
      console.error(error);
    }
  };

  if (userRole === "colaborador") {
    return (
      <div className="p-6 bg-gradient-to-b from-blue-900 to-blue-700 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-4">Panel de Colaborador</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Selecciona tu Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div key={index} className="bg-blue-800 p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                <p className="text-2xl font-semibold mb-4">{plan.price}</p>
                <ul className="mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm mb-2">
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className="bg-green-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-700 transition duration-200"
                >
                  Elegir Plan
                </button>
              </div>
            ))}
          </div>
        </div>
        {message && <div className="p-4 bg-green-800 text-green-300 rounded-lg mb-6">{message}</div>}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Opciones Adicionales</h2>
          <ul className="space-y-4">
            <li>
              <input
                type="text"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="ID del Grupo"
                className="p-2 rounded-lg w-full text-black mb-2"
              />
              <button
                onClick={handleJoinGroup}
                className="bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-200"
              >
                Unirse a un Grupo
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (userRole === "administrador") {
    return (
      <div className="p-6 bg-gradient-to-b from-blue-900 to-blue-700 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-4">Panel de Administrador</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Información de Sensores</h2>
          <ul className="space-y-4">
            {sensorData.map((sensor, index) => (
              <li key={index} className="bg-blue-800 p-4 rounded-lg">
                Tipo: {sensor.tipo} | Estado: {sensor.estado} | Área: {sensor.area_id}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Invitar Colaborador</h2>
          <input
            type="email"
            value={collaboratorEmail}
            onChange={(e) => setCollaboratorEmail(e.target.value)}
            placeholder="Correo del colaborador"
            className="p-2 rounded-lg w-full text-black mb-2"
          />
          <button
            onClick={inviteCollaborator}
            className="bg-green-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-700 transition duration-200"
          >
            Enviar Invitación
          </button>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Logs de Detección</h2>
          <ul className="space-y-4">
            {logs.map((log, index) => (
              <li key={index} className="bg-blue-800 p-4 rounded-lg">
                {log.accion} - Fecha: {new Date(log.fecha).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Alertas</h2>
          {alerts.map((alert, index) => (
            <div key={index} className="bg-red-800 p-4 rounded-lg">
              {alert.mensaje}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default MenuUser;
