import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, PlusCircle, Heart, Shield, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/recipes', label: 'All Recipes', icon: UtensilsCrossed },
    { to: '/recipes/new', label: 'Add Recipe', icon: PlusCircle },
    { to: '/recipes/my', label: 'My Recipes', icon: UtensilsCrossed },
    { to: '/recipes/favorites', label: 'Favorites', icon: Heart },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Dashboard', icon: Shield },
    { to: '/admin/users', label: 'Manage Users', icon: User },
    { to: '/admin/recipes', label: 'Manage Recipes', icon: UtensilsCrossed },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">RecipeHub</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
          {user?.role === 'admin' && (
            <>
              <p className="px-3 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</p>
              {adminLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
