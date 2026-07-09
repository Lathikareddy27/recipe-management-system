import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChefHat, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string })?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(from);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@recipe.com');
      setPassword('password123');
    } else {
      setEmail('demo@recipe.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1200)', backgroundSize: 'cover' }} />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ChefHat className="w-7 h-7" />
            </div>
            <span className="font-bold text-2xl">RecipeHub</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Welcome back to your kitchen companion
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-8">
            Manage your recipes, discover new flavors, and keep track of your favorite dishes — all in one beautiful place.
          </p>
          <div className="space-y-4">
            {['Organize recipes by category', 'Search and filter instantly', 'Save your favorites'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">RecipeHub</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
          <p className="text-gray-500 mb-8">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-2">Demo Accounts (click to fill):</p>
            <div className="flex gap-2">
              <button onClick={() => fillDemo('user')} className="flex-1 text-xs px-3 py-2 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-700 font-medium">
                User: demo@recipe.com
              </button>
              <button onClick={() => fillDemo('admin')} className="flex-1 text-xs px-3 py-2 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-700 font-medium">
                Admin: admin@recipe.com
              </button>
            </div>
            <p className="text-xs text-blue-600 mt-2">Password: password123</p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-600 font-semibold hover:text-orange-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
