import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { recipeAPI } from '../api/mockApi';
import { CATEGORIES, DIFFICULTIES } from '../types';
import type { Recipe } from '../types';
import Spinner from '../components/Spinner';

export default function RecipeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    difficulty: '',
    servings: '',
    image: '',
  });

  useEffect(() => {
    if (!id) return;
    const fetchRecipe = async () => {
      try {
        const recipe: Recipe = await recipeAPI.getRecipeById(id);
        setForm({
          name: recipe.name,
          category: recipe.category,
          ingredients: recipe.ingredients.join('\n'),
          instructions: recipe.instructions,
          prepTime: String(recipe.prepTime),
          cookTime: String(recipe.cookTime),
          difficulty: recipe.difficulty,
          servings: String(recipe.servings),
          image: recipe.image,
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Recipe not found');
        navigate('/recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.ingredients || !form.instructions || !form.difficulty) {
      toast.error('Please fill all required fields');
      return;
    }
    const ingredients = form.ingredients.split('\n').map((i) => i.trim()).filter(Boolean);
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }
    setSaving(true);
    try {
      const data = {
        name: form.name,
        category: form.category,
        ingredients,
        instructions: form.instructions,
        prepTime: Number(form.prepTime) || 0,
        cookTime: Number(form.cookTime) || 0,
        difficulty: form.difficulty,
        servings: Number(form.servings) || 1,
        image: form.image,
      };
      if (isEdit && id) {
        await recipeAPI.updateRecipe(id, data);
        toast.success('Recipe updated successfully!');
        navigate(`/recipes/${id}`);
      } else {
        const recipe = await recipeAPI.createRecipe(data);
        toast.success('Recipe created successfully!');
        navigate(`/recipes/${recipe._id}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner size={40} className="min-h-[60vh]" />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/recipes" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to recipes
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">{isEdit ? 'Edit Recipe' : 'Add New Recipe'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Image</label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
              {form.image ? (
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                <ImageIcon className="w-4 h-4" />
                {form.image ? 'Change Image' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <p className="text-xs text-gray-400 mt-2">Or paste an image URL below. Max 5MB.</p>
            </div>
          </div>
          <input
            type="text"
            name="image"
            value={form.image.startsWith('data:') ? '' : form.image}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            className="mt-3 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Recipe Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Classic Chocolate Cake"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
          />
        </div>

        {/* Category & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty *</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white"
            >
              <option value="">Select difficulty</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Times & Servings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prep Time (min) *</label>
            <input
              type="number"
              name="prepTime"
              value={form.prepTime}
              onChange={handleChange}
              required
              min="0"
              placeholder="10"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cook Time (min) *</label>
            <input
              type="number"
              name="cookTime"
              value={form.cookTime}
              onChange={handleChange}
              required
              min="0"
              placeholder="20"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Servings *</label>
            <input
              type="number"
              name="servings"
              value={form.servings}
              onChange={handleChange}
              required
              min="1"
              max="100"
              placeholder="4"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ingredients * <span className="text-gray-400 font-normal">(one per line)</span></label>
          <textarea
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            required
            rows={6}
            placeholder={'2 cups flour\n1 cup sugar\n3 eggs\nPinch of salt'}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-y"
          />
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Instructions *</label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Describe the cooking steps in detail..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-y"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-60"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : isEdit ? 'Update Recipe' : 'Create Recipe'}
          </button>
          <Link
            to={isEdit ? `/recipes/${id}` : '/recipes'}
            className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
