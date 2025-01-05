

const About = () => {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen py-10 px-5">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Quiénes Somos</h1>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-700">Nuestra Misión</h2>
          <p className="text-gray-600 mt-4">
            SafeNest se dedica a proporcionar soluciones de seguridad accesibles, eficaces y discretas para hogares y locales comerciales. Nuestra misión es garantizar la tranquilidad de nuestros usuarios mediante tecnología avanzada y un servicio excepcional.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-700">Nuestro Equipo</h2>
          <ul className="list-disc list-inside mt-4 text-gray-600">
            <li>Emilio Riofrío - Desarrollo y prototipado</li>
            <li>Andrés García - Electrónica</li>
            <li>Jandony Guzmán - Desarrollo web</li>
            <li>Emilio Ayala - Pruebas y gestión de proyectos</li>
            <li>George Giler - Pruebas y soporte técnico</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
