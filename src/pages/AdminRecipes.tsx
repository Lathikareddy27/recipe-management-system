import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Trash2, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../api/mockApi';
import type { Recipe } from '../types';
import Spinner from '../components/Spinner';

export default function AdminRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getAllRecipes();
      setRecipes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await adminAPI.deleteRecipe(confirmDelete._id);
      toast.success('Recipe deleted successfully');
      setRecipes((prev) => prev.filter((r) => r._id !== confirmDelete._id));
      setConfirmDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete recipe');
    }
  };

  if (loading) return <Spinner size={40} className="min-h-[60vh]" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <UtensilsCrossed className="w-7 h-7 text-orange-500" /> Manage Recipes
        </h1>
        <p className="text-gray-500 mt-1">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} in the system</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipe</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Author</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Created</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recipes.map((recipe) => (
                <tr key={recipe._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={recipe.image || 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200'} alt={recipe.name} className="w-12 h-12 rounded-xl object-cover" />
                      <Link to={`/recipes/${recipe._id}`} className="font-medium text-gray-900 hover:text-orange-600 transition-colors">
                        {recipe.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{recipe.category}</span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-sm text-gray-600">{recipe.user.name}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(recipe.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setConfirmDelete(recipe)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <button onClick={() => setConfirmDelete(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete recipe "{confirmDelete.name}"?</h3>
            <p className="text-gray-500 mb-6">This action cannot be undone. The recipe will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600">
                Delete Recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
