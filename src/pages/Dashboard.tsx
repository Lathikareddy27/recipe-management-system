import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, Clock, PlusCircle, TrendingUp, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recipeAPI } from '../api/mockApi';
import type { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const { user } = useAuth();
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [favRecipes, setFavRecipes] = useState<Recipe[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mine, favs, all] = await Promise.all([
          recipeAPI.getMyRecipes(),
          recipeAPI.getFavoriteRecipes(),
          recipeAPI.getRecipes({ page: 1 }),
        ]);
        setMyRecipes(mine);
        setFavRecipes(favs);
        setRecentRecipes(all.recipes.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner size={40} className="min-h-[60vh]" />;

  const stats = [
    {
      label: 'My Recipes',
      value: myRecipes.length,
      icon: UtensilsCrossed,
      color: 'from-orange-500 to-amber-500',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
    },
    {
      label: 'Favorites',
      value: favRecipes.length,
      icon: Heart,
      color: 'from-rose-500 to-pink-500',
      bg: 'bg-rose-50',
      text: 'text-rose-600',
    },
    {
      label: 'Recent Recipes',
      value: recentRecipes.length,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 sm:p-10 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-2">Welcome back,</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{user?.name}!</h1>
          <p className="text-white/90 max-w-lg mb-6">
            Manage your recipes, discover new dishes, and keep track of your culinary adventures all in one place.
          </p>
          <Link
            to="/recipes/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Recipe
          </Link>
        </div>
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

      {/* Recent Recipes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-500" />
            Recent Recipes
          </h2>
          <Link to="/recipes" className="text-sm font-medium text-orange-600 hover:text-orange-700">
            View all →
          </Link>
        </div>
        {recentRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-500">No recipes yet. Start by adding your first recipe!</p>
          </div>
        )}
      </div>

      {/* My Recipes quick view */}
      {myRecipes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Recipes</h2>
            <Link to="/recipes/my" className="text-sm font-medium text-orange-600 hover:text-orange-700">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRecipes.slice(0, 3).map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
