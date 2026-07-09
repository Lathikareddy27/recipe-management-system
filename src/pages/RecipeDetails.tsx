import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Users, ChefHat, Heart, Pencil, Trash2, ArrowLeft, Timer } from 'lucide-react';
import toast from 'react-hot-toast';
import { recipeAPI } from '../api/mockApi';
import { useAuth } from '../context/AuthContext';
import type { Recipe } from '../types';
import { FullPageSpinner } from '../components/Spinner';

const difficultyColors: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-red-100 text-red-700',
};

export default function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      try {
        const data = await recipeAPI.getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Recipe not found');
        navigate('/recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  const handleFavorite = async () => {
    if (!user) return;
    try {
      const result = await recipeAPI.toggleFavorite(recipe!._id);
      setRecipe((prev) => (prev ? { ...prev, isFavorite: result.isFavorite, favoritesCount: result.favoritesCount } : prev));
      toast.success(result.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to toggle favorite');
    }
  };

  const handleDelete = async () => {
    try {
      await recipeAPI.deleteRecipe(recipe!._id);
      toast.success('Recipe deleted successfully');
      navigate('/recipes');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete recipe');
    }
  };

  if (loading) return <FullPageSpinner />;
  if (!recipe) return null;

  const totalTime = recipe.prepTime + recipe.cookTime;
  const canEdit = user && (recipe.user._id === user._id || user.role === 'admin');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/recipes" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to recipes
      </Link>

      {/* Hero image */}
      <div className="relative rounded-3xl overflow-hidden h-64 sm:h-96 mb-8">
        <img
          src={recipe.image || 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1200'}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
              {recipe.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{recipe.name}</h1>
          <p className="text-white/80 text-sm">by {recipe.user.name}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={handleFavorite}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
            recipe.isFavorite
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-red-500' : ''}`} />
          {recipe.isFavorite ? 'Favorited' : 'Add to Favorites'}
        </button>
        {canEdit && (
          <>
            <Link
              to={`/recipes/${recipe._id}/edit`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-5 h-5" /> Edit
            </Link>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5" /> Delete
            </button>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Timer, label: 'Prep Time', value: `${recipe.prepTime} min` },
          { icon: Clock, label: 'Cook Time', value: `${recipe.cookTime} min` },
          { icon: Clock, label: 'Total Time', value: `${totalTime} min` },
          { icon: Users, label: 'Servings', value: recipe.servings },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
              <Icon className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-500" />
            Ingredients
          </h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-500" />
            Instructions
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{recipe.instructions}</p>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete this recipe?</h3>
            <p className="text-gray-500 mb-6">This action cannot be undone. The recipe will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
