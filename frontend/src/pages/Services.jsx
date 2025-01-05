
const Services = () => {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen py-10 px-5">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Nuestros Servicios</h1>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Descripción del servicio */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-700">SafeNest Básico</h2>
          <p className="text-gray-600 mt-4">
            Sistema de detección de intrusos para hogares y locales comerciales basado en tecnología avanzada. Incluye monitoreo remoto y alertas en tiempo real.
          </p>
          <p className="text-gray-600 mt-2">Precio: <span className="text-blue-600 font-bold">$90</span></p>
        </div>

        {/* Planes de mantenimiento */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-700">Planes de Mantenimiento</h2>
          <ul className="list-disc list-inside mt-4 text-gray-600">
            <li>Soporte técnico y optimización: <span className="text-blue-600 font-bold">$5/mes</span></li>
            <li>Mantenimiento anual: <span className="text-blue-600 font-bold">$50/año</span></li>
          </ul>
        </div>

        {/* Instalación */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-700">Instalación</h2>
          <p className="text-gray-600 mt-4">
            Incluye instalación inicial y un año de mantenimiento.
          </p>
          <p className="text-gray-600 mt-2">Precio: <span className="text-blue-600 font-bold">$120</span></p>
        </div>
      </div>
    </div>
  );
};

export default Services;
