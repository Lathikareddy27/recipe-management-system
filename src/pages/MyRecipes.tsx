import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, UtensilsCrossed } from 'lucide-react';
import { recipeAPI } from '../api/mockApi';
import type { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await recipeAPI.getMyRecipes();
        setRecipes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Spinner size={40} className="min-h-[60vh]" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
          <p className="text-gray-500 mt-1">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} created by you</p>
        </div>
        <Link
          to="/recipes/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          <PlusCircle className="w-5 h-5" /> Add Recipe
        </Link>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
            <UtensilsCrossed className="w-8 h-8 text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes yet</h3>
          <p className="text-gray-500 mb-4">You haven't created any recipes yet. Start cooking!</p>
          <Link to="/recipes/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
            <PlusCircle className="w-5 h-5" /> Create your first recipe
          </Link>
        </div>
      )}
    </div>
  );
}
