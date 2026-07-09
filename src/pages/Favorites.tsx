import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';
import { recipeAPI } from '../api/mockApi';
import type { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';

export default function Favorites() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await recipeAPI.getFavoriteRecipes();
        setRecipes(data.map((r) => ({ ...r, isFavorite: true })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    try {
      await recipeAPI.toggleFavorite(id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
      toast.success('Removed from favorites');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to toggle favorite');
    }
  };

  if (loading) return <Spinner size={40} className="min-h-[60vh]" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="w-7 h-7 text-red-500 fill-red-500" />
          Favorite Recipes
        </h1>
        <p className="text-gray-500 mt-1">{recipes.length} favorite recipe{recipes.length !== 1 ? 's' : ''}</p>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} onToggleFavorite={handleToggleFavorite} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <Heart className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-4">Browse recipes and tap the heart icon to save your favorites here.</p>
          <Link to="/recipes" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
            <UtensilsCrossed className="w-5 h-5" /> Browse recipes
          </Link>
        </div>
      )}
    </div>
  );
}
