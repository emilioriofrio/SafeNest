const Footer = () => {
  return (
    <footer className="bg-blue-900 text-blue-200 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sección 1: Información de la empresa */}
        <div>
          <h2 className="text-xl font-bold text-blue-300 mb-4">SafeNest</h2>
          <p className="text-sm">
            SafeNest es la solución inteligente para proteger tu hogar o negocio. 
            Nuestro sistema utiliza tecnología avanzada para brindarte seguridad en tiempo real.
          </p>
        </div>

        {/* Sección 2: Links útiles */}
        <div>
          <h2 className="text-xl font-bold text-blue-300 mb-4">Links Útiles</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="/about"
                className="hover:text-white transition duration-200"
              >
                Sobre Nosotros
              </a>
            </li>
            <li>
              <a
                href="/services"
                className="hover:text-white transition duration-200"
              >
                Servicios
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="hover:text-white transition duration-200"
              >
                Iniciar Sesión
              </a>
            </li>
            <li>
              <a
                href="/register"
                className="hover:text-white transition duration-200"
              >
                Registrarse
              </a>
            </li>
          </ul>
        </div>

        {/* Sección 3: Contacto */}
        <div>
          <h2 className="text-xl font-bold text-blue-300 mb-4">Contáctanos</h2>
          <ul className="space-y-2">
            <li>Email: <a href="mailto:Naranjaporsiempre@safenest.com" className="hover:text-white">contacto@safenest.com</a></li>
            <li>Teléfono: <a href="tel:+1234567890" className="hover:text-white">+1 234 567 890</a></li>
            <li>Dirección: 123 Calle Seguridad, Empanadas</li>
          </ul>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-blue-700 mt-8"></div>

      {/* Créditos */}
      <div className="text-center text-sm mt-4">
        <p>
          © {new Date().getFullYear()} SafeNest. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
