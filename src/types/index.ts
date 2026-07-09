export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  bio: string;
  token?: string;
  createdAt?: string;
}

export interface Recipe {
  _id: string;
  name: string;
  category: string;
  ingredients: string[];
  instructions: string;
  prepTime: number;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  image: string;
  user: {
    _id: string;
    name: string;
    email?: string;
  };
  favorites: string[];
  isFavorite?: boolean;
  favoritesCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface RecipeInput {
  name: string;
  category: string;
  ingredients: string[];
  instructions: string;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  servings: number;
  image: string;
}

export interface PaginatedRecipes {
  recipes: Recipe[];
  page: number;
  pages: number;
  total: number;
}

export interface AdminDashboard {
  totalUsers: number;
  totalRecipes: number;
  totalFavorites: number;
  recentRecipes: Recipe[];
}

export const CATEGORIES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Desserts',
  'Drinks',
  'Vegetarian',
  'Non-Vegetarian',
] as const;

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;
