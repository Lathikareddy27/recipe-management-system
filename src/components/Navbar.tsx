import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChefHat, Menu, User as UserIcon, LogOut, LayoutDashboard, Shield, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenu, setUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {onMenuClick && (
              <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900">
                <Menu className="w-6 h-6" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 hidden sm:block">RecipeHub</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/dashboard') ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/recipes"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/recipes') ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Recipes
            </Link>
            <Link
              to="/recipes/new"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Add Recipe
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin') ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-semibold text-sm">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name.split(' ')[0]}</span>
                </button>
                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <UserIcon className="w-4 h-4" /> My Profile
                      </Link>
                      <Link to="/dashboard" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/recipes/my" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <UtensilsCrossed className="w-4 h-4" /> My Recipes
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Shield className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
