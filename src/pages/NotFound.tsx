import { Link } from 'react-router-dom';
import { ChefHat, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
          <ChefHat className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-2">Page not found</p>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">
          <Home className="w-5 h-5" /> Go Home
        </Link>
      </div>
    </div>
  );
}
