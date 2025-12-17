import { NavLink, useNavigate } from "react-router-dom";
import { Home, Box, Users, ShoppingCart, HelpCircle, LogOut, FileText, Package, UserCheck, BarChart3 } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import Logo from '../assets/imagenes/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const links = [
    { to: "/home", label: "Home", icon: <Home size={20} /> },
    { to: "/home/analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
    { to: "/home/inventario/productos", label: "Productos", icon: <Box size={20} /> },
    { to: "/home/usuarios", label: "Usuarios", icon: <Users size={20} /> },
    { to: "/home/clientes", label: "Clientes", icon: <UserCheck size={20} /> },
    { to: "/home/facturas", label: "Facturas", icon: <FileText size={20} /> },
    { to: "/home/inventario/categorias", label: "Categorías", icon: <Package size={20} /> },
    { to: "/home/ventas", label: "Ventas", icon: <ShoppingCart size={20} /> },
    { to: "/home/soporte", label: "Soporte", icon: <HelpCircle size={20} /> },
  ];

  const handleLogout = () => {
    logout(); // tu función centralizada
    navigate("/login"); // luego rediriges
  };

  return (
    <aside className="w-64 h-screen bg-white border-r-gray-400 flex flex-col justify-between">
      <div>
        {/* Logo and Title Section - Centered Vertical Layout */}
        <div className='flex flex-col items-center justify-center p-4 mb-4'>
          <img src={Logo} alt="Logo" className='w-16 h-16 mb-2' />
          <h1 className="text-lg font-bold text-blue-600 text-center">Dashboard</h1>
        </div>

        <div className="px-4 mb-2">
          <hr className="border-gray-300" />
        </div>

        <nav className="flex flex-col gap-1 px-4">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/home"}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${isActive
                  ? "bg-gray-100 text-black"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <hr className="p-2 text-gray-400" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 text-lg font-medium hover:text-red-900 text-center"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
