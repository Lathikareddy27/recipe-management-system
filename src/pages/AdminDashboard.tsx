import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UtensilsCrossed, Heart, TrendingUp, ArrowRight } from 'lucide-react';
import { adminAPI } from '../api/mockApi';
import type { AdminDashboard as DashboardData } from '../types';
import Spinner from '../components/Spinner';

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const d = await adminAPI.getDashboard();
        setData(d);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Spinner size={40} className="min-h-[60vh]" />;
  if (!data) return null;

  const stats = [
    { label: 'Total Users', value: data.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Total Recipes', value: data.totalRecipes, icon: UtensilsCrossed, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50', text: 'text-orange-600' },
    { label: 'Total Favorites', value: data.totalFavorites, icon: Heart, color: 'from-rose-500 to-pink-500', bg: 'bg-rose-50', text: 'text-rose-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">System overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.text}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/admin/users" className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <Users className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-bold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-500 mt-1">View and manage all users</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
        <Link to="/admin/recipes" className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <UtensilsCrossed className="w-8 h-8 text-orange-500 mb-3" />
              <h3 className="font-bold text-gray-900">Manage Recipes</h3>
              <p className="text-sm text-gray-500 mt-1">View and manage all recipes</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Recent recipes */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Recipes</h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {data.recentRecipes.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.recentRecipes.map((recipe) => (
                <Link key={recipe._id} to={`/recipes/${recipe._id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <img src={recipe.image || 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200'} alt={recipe.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{recipe.name}</p>
                    <p className="text-sm text-gray-500">{recipe.category} • by {recipe.user.name}</p>
                  </div>
                  <span className="text-xs text-gray-400 hidden sm:block">{new Date(recipe.createdAt).toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-gray-500">No recipes found</p>
          )}
        </div>
      </div>
    </div>
  );
}
