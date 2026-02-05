import { NavLink } from 'react-router-dom';
import { FaHome, FaTasks, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { to: '/home', icon: FaHome, label: 'Home' },
    { to: '/tasks', icon: FaTasks, label: 'Tasks' },
    { to: '/profile', icon: FaUser, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-linear-to-b from-indigo-600 to-indigo-800 text-white shadow-2xl z-50">
      <div className="flex flex-col h-full">
        {/* Logo/Brand Section */}
        <div className="p-6 border-b border-white/20">
          <h2 className="text-4xl font-bold flex items-center gap-2">
            <span className="bg-white text-indigo-600 rounded-lg p-2 text-xl">✨</span>
            <span>TaskFlow</span>
          </h2>
          {user && (
            <p className="text-sm text-white/80 mt-2">Welcome, {user.name}</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                        ? 'bg-white text-indigo-600 shadow-lg font-semibold'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="text-xl" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
