import { Bell } from "lucide-react";
import { useAuth } from "../auth/useAuth";

const Navbar = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <header className="h-16 bg-white border-b-gray-400 px-6 flex items-center justify-end">
      <div className="flex items-center gap-4">
        {/* Ícono de notificaciones */}
        <button className="text-gray-600 hover:text-gray-800">
          <Bell size={20} />
        </button>

        {/* Avatar + nombre de usuario */}
        <div className="flex items-center gap-2">
          {/* Avatar (círculo genérico) */}
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {user?.username?.[0]?.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          {/* Nombre de usuario */}
          <span className="text-sm text-gray-800 font-medium">
            {user?.username ||
              (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
              user?.firstName ||
              user?.name ||
              user?.email?.split('@')[0] ||
              'Invitado'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

