import { Link } from 'react-router-dom';
import { Clock, Users, ChefHat, Heart } from 'lucide-react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite?: (id: string) => void;
}

const difficultyColors: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-red-100 text-red-700',
};

const categoryColors: Record<string, string> = {
  Breakfast: 'bg-orange-100 text-orange-700',
  Lunch: 'bg-blue-100 text-blue-700',
  Dinner: 'bg-purple-100 text-purple-700',
  Snacks: 'bg-yellow-100 text-yellow-700',
  Desserts: 'bg-pink-100 text-pink-700',
  Drinks: 'bg-cyan-100 text-cyan-700',
  Vegetarian: 'bg-green-100 text-green-700',
  'Non-Vegetarian': 'bg-rose-100 text-rose-700',
};

export default function RecipeCard({ recipe, onToggleFavorite }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={`/recipes/${recipe._id}`} className="block relative overflow-hidden h-48">
        <img
          src={recipe.image || 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[recipe.category] || 'bg-gray-100 text-gray-700'}`}>
            {recipe.category}
          </span>
        </div>
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(recipe._id);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            aria-label="Toggle favorite"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        )}
      </Link>
      <div className="p-5">
        <Link to={`/recipes/${recipe._id}`}>
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 hover:text-orange-600 transition-colors">
            {recipe.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {recipe.instructions.slice(0, 80)}...
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {totalTime} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {recipe.servings}
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span className={`px-2 py-0.5 rounded-full font-medium ${difficultyColors[recipe.difficulty] || ''}`}>
              {recipe.difficulty}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
