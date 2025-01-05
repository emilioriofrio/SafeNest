import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-blue-300 text-2xl font-bold">
          <Link to="/">SafeNest</Link>
        </div>

        {/* Desktop Menu */}
        <ul className={`hidden md:flex space-x-6 text-blue-200`}>
          <li>
            <Link
              to="/"
              className="hover:text-white transition duration-200"
            >
              Inicio
            </Link>
          </li>
          
          <li>
            <Link
              to="/services"
              className="hover:text-white transition duration-200"
            >
              Servicios
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="hover:text-white transition duration-200"
            >
              Nosotros
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="hover:text-white transition duration-200"
            >
              Iniciar Sesión
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="bg-blue-300 text-blue-900 font-bold px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition duration-200"
            >
              Registrarse
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-blue-200 text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Mobile Dropdown */}
        {isOpen && (
          <ul className="absolute top-14 left-0 w-full bg-blue-800 text-blue-200 flex flex-col space-y-4 p-4 shadow-lg md:hidden">
            <li>
              <Link
                to="/"
                className="hover:text-white transition duration-200"
                onClick={() => setIsOpen(false)}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-white transition duration-200"
                onClick={() => setIsOpen(false)}
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="hover:text-white transition duration-200"
                onClick={() => setIsOpen(false)}
              >
                Servicios
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-white transition duration-200"
                onClick={() => setIsOpen(false)}
              >
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="bg-blue-300 text-blue-900 font-bold px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition duration-200"
                onClick={() => setIsOpen(false)}
              >
                Registrarse
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
