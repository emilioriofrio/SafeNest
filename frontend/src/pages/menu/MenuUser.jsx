import { useState } from "react";
import axios from "axios";

const MenuUser = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const inviteCollaborator = async () => {
    try {
      await axios.post(
        "http://localhost:8000/invite-collaborator",
        { correo: email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Si usas token
          },
        }
      );
      setMessage("Invitación enviada exitosamente");
      setEmail("");
    } catch (error) {
      setMessage("Error al enviar invitación",error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 to-blue-700 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Panel de Usuario</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Invitar Colaborador</h2>
        <div className="mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo del colaborador"
            className="p-2 rounded-lg w-full text-black"
          />
          <button
            onClick={inviteCollaborator}
            className="mt-2 bg-green-500 px-4 py-2 rounded-lg"
          >
            Enviar Invitación
          </button>
        </div>
        {message && <p className="mt-2 text-green-300">{message}</p>}
      </div>
    </div>
  );
};

export default MenuUser;
