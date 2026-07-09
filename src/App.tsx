import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import RecipeForm from './pages/RecipeForm';
import MyRecipes from './pages/MyRecipes';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminRecipes from './pages/AdminRecipes';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', background: '#333', color: '#fff' } }} />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/recipes" element={<ProtectedRoute><Layout><Recipes /></Layout></ProtectedRoute>} />
          <Route path="/recipes/new" element={<ProtectedRoute><Layout><RecipeForm /></Layout></ProtectedRoute>} />
          <Route path="/recipes/:id" element={<ProtectedRoute><Layout><RecipeDetails /></Layout></ProtectedRoute>} />
          <Route path="/recipes/:id/edit" element={<ProtectedRoute><Layout><RecipeForm /></Layout></ProtectedRoute>} />
          <Route path="/recipes/my" element={<ProtectedRoute><Layout><MyRecipes /></Layout></ProtectedRoute>} />
          <Route path="/recipes/favorites" element={<ProtectedRoute><Layout><Favorites /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><Layout><AdminUsers /></Layout></AdminRoute>} />
          <Route path="/admin/recipes" element={<AdminRoute><Layout><AdminRecipes /></Layout></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
