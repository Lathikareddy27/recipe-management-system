import { useEffect, useState, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { recipeAPI } from '../api/mockApi';
import { CATEGORIES } from '../types';
import type { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Recipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await recipeAPI.getRecipes({ page, search, category });
      setRecipes(data.recipes);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat === category ? '' : cat);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSearchInput('');
    setCategory('');
    setPage(1);
  };

  const handleToggleFavorite = async (id: string) => {
    if (!user) return;
    try {
      const result = await recipeAPI.toggleFavorite(id);
      setRecipes((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, isFavorite: result.isFavorite, favoritesCount: result.favoritesCount } : r
        )
      );
      toast.success(result.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to toggle favorite');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Recipes</h1>
          <p className="text-gray-500 mt-1">{total} recipe{total !== 1 ? 's' : ''} found</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Search */}
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search recipes by name..."
              className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
            {searchInput && (
              <button type="button" onClick={() => { setSearchInput(''); setSearch(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>

        {/* Category filter - desktop */}
        <div className={`flex-col lg:flex-row gap-2 ${showFilters ? 'flex' : 'hidden lg:flex'}`}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                !category ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  category === cat ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(search || category) && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Active filters:</span>
          {search && <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">Search: "{search}"</span>}
          {category && <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">Category: {category}</span>}
          <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
            <X className="w-4 h-4" /> Clear all
          </button>
        </div>
      )}

      {loading ? (
        <Spinner size={40} className="min-h-[40vh]" />
      ) : recipes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} onToggleFavorite={handleToggleFavorite} />
            ))}
          </div>
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <button onClick={clearFilters} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
