import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para el menú desplegable
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar el usuario desde localStorage (si existe)
    const storedUser = localStorage.getItem("user");
    console.log(storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Limpiar el usuario de localStorage y estado
    localStorage.removeItem("user");
    setUser(null);
    setIsDropdownOpen(false); // Cerrar el menú desplegable al cerrar sesión
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Abrir o cerrar el menú desplegable
  };

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
            <Link to="/" className="hover:text-white transition duration-200">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/services" className="hover:text-white transition duration-200">
              Servicios
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-white transition duration-200">
              Nosotros
            </Link>
          </li>

          {user ? (
            // Si el usuario está autenticado
            <>
              <li className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-blue-300 text-blue-900 font-bold flex items-center justify-center rounded-full">
                    {user.nombre ? user.nombre.charAt(0).toUpperCase() : "?"}
                  </div>
                  <span className="text-white">{user.nombre || "Usuario"}</span>
                </button>

                {/* Menú desplegable */}
                {isDropdownOpen && (
                  <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <li>
                      <Link
                        to={user.rol === "superadministrador" ? "/menu-admin" : "/menu-user"}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/myaccount"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Mi Cuenta
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            // Si no hay usuario autenticado
            <>
              <li>
                <Link to="/login" className="hover:text-white transition duration-200">
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
            </>
          )}
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
            {user ? (
              <>
                <li>
                  <Link
                    to={user.rol === "superadministrador" ? "/menu-admin" : "/menu-user"}
                    className="hover:text-white transition duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/myaccount"
                    className="hover:text-white transition duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Mi Cuenta
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
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
              </>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
