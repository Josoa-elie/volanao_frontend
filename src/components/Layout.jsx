import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Grid, DollarSign, Tag, Moon, Sun, LogOut, Menu, X, Wallet } from 'lucide-react';

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const syncSidebar = () => setSidebarOpen(mediaQuery.matches);

    syncSidebar();
    mediaQuery.addEventListener?.('change', syncSidebar);

    return () => mediaQuery.removeEventListener?.('change', syncSidebar);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Grid size={18} /> },
    { path: '/dashboard/expenses', label: 'Dépenses', icon: <DollarSign size={18} /> },
    { path: '/dashboard/categories', label: 'Catégories', icon: <Tag size={18} /> },
    { path: '/dashboard/budgets', label: 'Budgets', icon: <DollarSign size={18} /> },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const closeSidebar = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content overflow-hidden">
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 px-3 sm:px-4 h-16 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="btn btn-ghost btn-circle btn-sm sm:btn-md md:hidden"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Ouvrir le menu"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link to="/dashboard" className="btn btn-ghost text-base sm:text-xl font-bold px-2 sm:px-4 flex items-center gap-2">
            <Wallet size={18} />
            Volanao
          </Link>
        </div>

        <div className="flex-none flex items-center gap-1 sm:gap-2 ml-auto">
          <button
            className="btn btn-ghost btn-circle btn-sm sm:btn-md"
            onClick={toggleTheme}
            title="Changer de thème"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <p>{user?.username || user?.name || 'Utilisateur'}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-ghost btn-sm sm:btn-md text-error flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
            title="Déconnexion"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
          />
        )}

        <aside
          className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-base-100 shadow-xl transition-transform duration-200 ease-in-out md:static md:top-auto md:z-auto md:h-full md:shadow-md md:min-h-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <ul className="menu p-4 gap-2 overflow-y-auto h-full">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeSidebar}
                  className={isActive(item.path) ? 'active' : ''}
                >
                  <span className="text-xl mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 w-full min-w-0">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}