import { ChefHat, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">RecipeHub</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your personal recipe management system. Discover, save, and share your favorite recipes all in one place.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard" className="hover:text-orange-400 transition-colors">Dashboard</a></li>
              <li><a href="/recipes" className="hover:text-orange-400 transition-colors">Browse Recipes</a></li>
              <li><a href="/recipes/new" className="hover:text-orange-400 transition-colors">Add Recipe</a></li>
              <li><a href="/profile" className="hover:text-orange-400 transition-colors">My Profile</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Vegetarian', 'Drinks'].map((cat) => (
                <span key={cat} className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-400">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2026 RecipeHub. All rights reserved.</p>
          <p className="text-sm flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
