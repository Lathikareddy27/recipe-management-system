// Mock API layer that simulates the Express + MongoDB backend using localStorage.
// In production, replace these calls with Axios requests to the real backend API.
// The backend code is fully provided in the /server directory.

import type { User, Recipe, RecipeInput, PaginatedRecipes, AdminDashboard } from '../types';

const STORAGE_KEYS = {
  USERS: 'rms_users',
  RECIPES: 'rms_recipes',
  CURRENT_USER: 'rms_current_user',
};

// ---------- Helpers ----------
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const read = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

// Simple hash to simulate bcrypt (NOT for production - demo only)
const hashPassword = (pw: string) => btoa(pw + '_salt_rms');
const verifyPassword = (pw: string, hash: string) => btoa(pw + '_salt_rms') === hash;

// Simple JWT-like token (demo only)
const makeToken = (userId: string) => btoa(`${userId}:${Date.now()}:rms`);

// ---------- Seed ----------
const seedIfEmpty = () => {
  const users = read(STORAGE_KEYS.USERS, [] as Array<User & { passwordHash: string }>);
  if (users.length > 0) return;

  const adminId = uid();
  const userId = uid();

  const seedUsers = [
    {
      _id: adminId,
      name: 'Admin User',
      email: 'admin@recipe.com',
      passwordHash: hashPassword('password123'),
      role: 'admin' as const,
      avatar: '',
      bio: 'System administrator',
      createdAt: new Date().toISOString(),
    },
    {
      _id: userId,
      name: 'Demo User',
      email: 'demo@recipe.com',
      passwordHash: hashPassword('password123'),
      role: 'user' as const,
      avatar: '',
      bio: 'Home cook who loves trying new recipes',
      createdAt: new Date().toISOString(),
    },
  ];
  write(STORAGE_KEYS.USERS, seedUsers);

  const seedRecipes: Recipe[] = [
    {
      _id: uid(),
      name: 'Classic Fluffy Pancakes',
      category: 'Breakfast',
      ingredients: ['2 cups all-purpose flour', '2 large eggs', '1 cup milk', '2 tbsp sugar', '2 tsp baking powder', '1/2 tsp salt', '2 tbsp melted butter'],
      instructions: 'In a bowl, whisk together flour, sugar, baking powder, and salt. In another bowl, beat eggs, milk, and melted butter. Pour wet into dry and stir until just combined. Heat a greased pan over medium heat. Pour 1/4 cup batter per pancake. Cook until bubbles form on top, then flip and cook until golden brown.',
      prepTime: 10,
      cookTime: 15,
      difficulty: 'Easy',
      servings: 4,
      image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800',
      user: { _id: userId, name: 'Demo User' },
      favorites: [],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      _id: uid(),
      name: 'Grilled Chicken Caesar Salad',
      category: 'Lunch',
      ingredients: ['2 chicken breasts', '1 head romaine lettuce', '1/2 cup parmesan cheese', '1/4 cup caesar dressing', '1 cup croutons', '1 tbsp olive oil', 'Salt and pepper'],
      instructions: 'Season chicken with salt, pepper, and olive oil. Grill over medium-high heat for 6-7 minutes per side until cooked through. Let rest, then slice. Chop romaine and toss with dressing. Top with chicken, parmesan, and croutons.',
      prepTime: 15,
      cookTime: 20,
      difficulty: 'Easy',
      servings: 2,
      image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=800',
      user: { _id: userId, name: 'Demo User' },
      favorites: [userId],
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      _id: uid(),
      name: 'Spaghetti Bolognese',
      category: 'Dinner',
      ingredients: ['400g spaghetti', '500g ground beef', '1 large onion, diced', '2 garlic cloves, minced', '400g canned crushed tomatoes', '2 tbsp tomato paste', '1 tsp dried oregano', '2 tbsp olive oil', 'Salt and pepper', 'Fresh basil'],
      instructions: 'Heat olive oil in a large pan. Saute onion and garlic until soft. Add ground beef and brown. Stir in tomato paste, crushed tomatoes, and oregano. Simmer on low for 30 minutes. Season to taste. Cook spaghetti according to package directions. Serve sauce over pasta with fresh basil.',
      prepTime: 10,
      cookTime: 40,
      difficulty: 'Medium',
      servings: 4,
      image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=800',
      user: { _id: userId, name: 'Demo User' },
      favorites: [],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      _id: uid(),
      name: 'Chocolate Lava Cake',
      category: 'Desserts',
      ingredients: ['100g dark chocolate', '100g unsalted butter', '2 large eggs', '2 egg yolks', '50g caster sugar', '30g all-purpose flour', 'Powdered sugar for dusting'],
      instructions: 'Preheat oven to 200C. Melt chocolate and butter together. Whisk eggs, yolks, and sugar until pale. Fold in melted chocolate, then flour. Pour into greased ramekins. Bake for 8-10 minutes until edges are set but center is soft. Invert onto plate and dust with powdered sugar.',
      prepTime: 15,
      cookTime: 10,
      difficulty: 'Medium',
      servings: 2,
      image: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=800',
      user: { _id: userId, name: 'Demo User' },
      favorites: [userId],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      _id: uid(),
      name: 'Fresh Mango Smoothie',
      category: 'Drinks',
      ingredients: ['1 ripe mango, chopped', '1 banana', '1 cup Greek yogurt', '1/2 cup milk', '1 tbsp honey', 'Ice cubes'],
      instructions: 'Add all ingredients to a blender. Blend on high until smooth and creamy. Add more milk if too thick. Pour into glasses and serve immediately.',
      prepTime: 5,
      cookTime: 0,
      difficulty: 'Easy',
      servings: 2,
      image: 'https://images.pexels.com/photos/518255/pexels-photo-518255.jpeg?auto=compress&cs=tinysrgb&w=800',
      user: { _id: userId, name: 'Demo User' },
      favorites: [],
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      _id: uid(),
      name: 'Vegetable Stir Fry',
      category: 'Vegetarian',
      ingredients: ['2 cups broccoli florets', '1 red bell pepper, sliced', '1 carrot, julienned', '3 tbsp soy sauce', '1 tbsp ginger, grated', '2 garlic cloves, minced', '2 tbsp sesame oil', '1 tbsp cornstarch', '2 tbsp water'],
      instructions: 'Mix soy sauce, cornstarch, and water for the sauce. Heat sesame oil in a wok over high heat. Add ginger and garlic, stir for 30 seconds. Add vegetables and stir fry for 4-5 minutes. Pour in sauce and toss to coat. Cook 1 more minute until sauce thickens.',
      prepTime: 10,
      cookTime: 10,
      difficulty: 'Easy',
      servings: 3,
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
      user: { _id: userId, name: 'Demo User' },
      favorites: [],
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
    {
      _id: uid(),
      name: 'Avocado Toast with Egg',
      category: 'Snacks',
      ingredients: ['2 slices whole grain bread', '1 ripe avocado', '2 eggs', '1 tbsp lemon juice', 'Red pepper flakes', 'Salt and pepper', 'Olive oil'],
      instructions: 'Toast bread until golden. Mash avocado with lemon juice, salt, and pepper. Poach or fry eggs to your preference. Spread avocado on toast, top with egg, and sprinkle with red pepper flakes.',
      prepTime: 5,
      cookTime: 5,
      difficulty: 'Easy',
      servings: 1,
      image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=800',
      user: { _id: userId, name: 'Demo User' },
      favorites: [],
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      _id: uid(),
      name: 'Grilled Salmon with Lemon',
      category: 'Non-Vegetarian',
      ingredients: ['4 salmon fillets', '2 lemons', '3 tbsp olive oil', '2 garlic cloves, minced', '1 tbsp fresh dill', 'Salt and pepper', 'Lemon slices for garnish'],
      instructions: 'Mix olive oil, minced garlic, lemon juice, dill, salt, and pepper. Brush salmon fillets with the mixture. Grill skin-side down over medium-high heat for 4-5 minutes. Flip and cook 3-4 more minutes until fish flakes easily. Garnish with lemon slices.',
      prepTime: 10,
      cookTime: 10,
      difficulty: 'Medium',
      servings: 4,
      image: 'https://images.pexels.com/photos/3296434/pexels-photo-3296434.jpeg?auto=compress&cs=tinysrgb&w=800',
      user: { _id: userId, name: 'Demo User' },
      favorites: [],
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    },
  ];
  write(STORAGE_KEYS.RECIPES, seedRecipes);
};

seedIfEmpty();

// ---------- Auth API ----------
export const authAPI = {
  async register(name: string, email: string, password: string): Promise<User> {
    await delay();
    const users = read<Array<User & { passwordHash: string }>>(STORAGE_KEYS.USERS, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User already exists with this email');
    }
    const newUser = {
      _id: uid(),
      name,
      email,
      passwordHash: hashPassword(password),
      role: 'user' as const,
      avatar: '',
      bio: '',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    write(STORAGE_KEYS.USERS, users);
    const token = makeToken(newUser._id);
    const user: User = { _id: newUser._id, name, email, role: 'user', avatar: '', bio: '', token };
    write(STORAGE_KEYS.CURRENT_USER, { ...user, token });
    return user;
  },

  async login(email: string, password: string): Promise<User> {
    await delay();
    const users = read<Array<User & { passwordHash: string }>>(STORAGE_KEYS.USERS, []);
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || !verifyPassword(password, found.passwordHash)) {
      throw new Error('Invalid email or password');
    }
    const token = makeToken(found._id);
    const user: User = {
      _id: found._id,
      name: found.name,
      email: found.email,
      role: found.role,
      avatar: found.avatar,
      bio: found.bio,
      token,
    };
    write(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  },

  async logout(): Promise<void> {
    await delay(100);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser(): User | null {
    return read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  async getProfile(): Promise<User> {
    await delay(100);
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current) throw new Error('Not authenticated');
    const users = read<Array<User & { passwordHash: string }>>(STORAGE_KEYS.USERS, []);
    const found = users.find((u) => u._id === current._id);
    if (!found) throw new Error('User not found');
    return { _id: found._id, name: found.name, email: found.email, role: found.role, avatar: found.avatar, bio: found.bio, createdAt: found.createdAt };
  },

  async updateProfile(data: { name?: string; bio?: string; avatar?: string }): Promise<User> {
    await delay();
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current) throw new Error('Not authenticated');
    const users = read<Array<User & { passwordHash: string }>>(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u._id === current._id);
    if (idx === -1) throw new Error('User not found');
    users[idx].name = data.name ?? users[idx].name;
    users[idx].bio = data.bio ?? users[idx].bio;
    users[idx].avatar = data.avatar ?? users[idx].avatar;
    write(STORAGE_KEYS.USERS, users);
    const updated: User = { ...current, name: users[idx].name, bio: users[idx].bio, avatar: users[idx].avatar };
    write(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    await delay();
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current) throw new Error('Not authenticated');
    const users = read<Array<User & { passwordHash: string }>>(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u._id === current._id);
    if (idx === -1) throw new Error('User not found');
    if (!verifyPassword(currentPassword, users[idx].passwordHash)) {
      throw new Error('Current password is incorrect');
    }
    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters');
    users[idx].passwordHash = hashPassword(newPassword);
    write(STORAGE_KEYS.USERS, users);
    return { message: 'Password changed successfully' };
  },
};

// ---------- Recipe API ----------
export const recipeAPI = {
  async getRecipes(params: { page?: number; search?: string; category?: string } = {}): Promise<PaginatedRecipes> {
    await delay();
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    let filtered = [...recipes];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((r) => r.name.toLowerCase().includes(q));
    }
    if (params.category) {
      filtered = filtered.filter((r) => r.category === params.category);
    }
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const pageSize = 9;
    const page = params.page || 1;
    const total = filtered.length;
    const pages = Math.ceil(total / pageSize);
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    const withFavorite = paged.map((r) => ({
      ...r,
      isFavorite: current ? r.favorites.includes(current._id) : false,
      favoritesCount: r.favorites.length,
    }));

    return { recipes: withFavorite, page, pages, total };
  },

  async getRecipeById(id: string): Promise<Recipe> {
    await delay();
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    const recipe = recipes.find((r) => r._id === id);
    if (!recipe) throw new Error('Recipe not found');
    return {
      ...recipe,
      isFavorite: current ? recipe.favorites.includes(current._id) : false,
      favoritesCount: recipe.favorites.length,
    };
  },

  async createRecipe(data: RecipeInput): Promise<Recipe> {
    await delay();
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current) throw new Error('Not authenticated');
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    const recipe: Recipe = {
      _id: uid(),
      ...data,
      difficulty: data.difficulty as Recipe['difficulty'],
      user: { _id: current._id, name: current.name },
      favorites: [],
      isFavorite: false,
      favoritesCount: 0,
      createdAt: new Date().toISOString(),
    };
    recipes.push(recipe);
    write(STORAGE_KEYS.RECIPES, recipes);
    return recipe;
  },

  async updateRecipe(id: string, data: Partial<RecipeInput>): Promise<Recipe> {
    await delay();
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current) throw new Error('Not authenticated');
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    const idx = recipes.findIndex((r) => r._id === id);
    if (idx === -1) throw new Error('Recipe not found');
    if (recipes[idx].user._id !== current._id && current.role !== 'admin') {
      throw new Error('Not authorized to edit this recipe');
    }
    recipes[idx] = {
      ...recipes[idx],
      ...data,
      difficulty: (data.difficulty as Recipe['difficulty']) || recipes[idx].difficulty,
      updatedAt: new Date().toISOString(),
    };
    write(STORAGE_KEYS.RECIPES, recipes);
    return recipes[idx];
  },

  async deleteRecipe(id: string): Promise<{ message: string }> {
    await delay();
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current) throw new Error('Not authenticated');
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    const recipe = recipes.find((r) => r._id === id);
    if (!recipe) throw new Error('Recipe not found');
    if (recipe.user._id !== current._id && current.role !== 'admin') {
      throw new Error('Not authorized to delete this recipe');
    }
    write(STORAGE_KEYS.RECIPES, recipes.filter((r) => r._id !== id));
    return { message: 'Recipe removed' };
  },

  async toggleFavorite(id: string): Promise<{ _id: string; isFavorite: boolean; favoritesCount: number }> {
    await delay(150);
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current) throw new Error('Not authenticated');
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    const idx = recipes.findIndex((r) => r._id === id);
    if (idx === -1) throw new Error('Recipe not found');
    const favIdx = recipes[idx].favorites.indexOf(current._id);
    if (favIdx === -1) {
      recipes[idx].favorites.push(current._id);
    } else {
      recipes[idx].favorites.splice(favIdx, 1);
    }
    write(STORAGE_KEYS.RECIPES, recipes);
    return {
      _id: id,
      isFavorite: recipes[idx].favorites.includes(current._id),
      favoritesCount: recipes[idx].favorites.length,
    };
  },

  async getMyRecipes(): Promise<Recipe[]> {
    await delay();
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current) throw new Error('Not authenticated');
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    return recipes
      .filter((r) => r.user._id === current._id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getFavoriteRecipes(): Promise<Recipe[]> {
    await delay();
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current) throw new Error('Not authenticated');
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    return recipes
      .filter((r) => r.favorites.includes(current._id))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
};

// ---------- Admin API ----------
export const adminAPI = {
  async getDashboard(): Promise<AdminDashboard> {
    await delay();
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current || current.role !== 'admin') throw new Error('Not authorized as admin');
    const users = read<Array<User & { passwordHash: string }>>(STORAGE_KEYS.USERS, []);
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    const totalFavorites = recipes.reduce((sum, r) => sum + r.favorites.length, 0);
    const recentRecipes = [...recipes]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    return {
      totalUsers: users.filter((u) => u.role === 'user').length,
      totalRecipes: recipes.length,
      totalFavorites,
      recentRecipes,
    };
  },

  async getUsers(): Promise<Array<User & { recipeCount: number }>> {
    await delay();
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current || current.role !== 'admin') throw new Error('Not authorized as admin');
    const users = read<Array<User & { passwordHash: string }>>(STORAGE_KEYS.USERS, []);
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    return users
      .filter((u) => u.role !== 'admin' || true)
      .map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
        bio: u.bio,
        createdAt: u.createdAt,
        recipeCount: recipes.filter((r) => r.user._id === u._id).length,
      }));
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    await delay();
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current || current.role !== 'admin') throw new Error('Not authorized as admin');
    const users = read<Array<User & { passwordHash: string }>>(STORAGE_KEYS.USERS, []);
    const user = users.find((u) => u._id === id);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin') throw new Error('Cannot delete an admin user');
    write(STORAGE_KEYS.USERS, users.filter((u) => u._id !== id));
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    write(STORAGE_KEYS.RECIPES, recipes.filter((r) => r.user._id !== id));
    return { message: 'User and their recipes removed' };
  },

  async getAllRecipes(): Promise<Recipe[]> {
    await delay();
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current || current.role !== 'admin') throw new Error('Not authorized as admin');
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    return [...recipes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async deleteRecipe(id: string): Promise<{ message: string }> {
    await delay();
    const current = read<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current || current.role !== 'admin') throw new Error('Not authorized as admin');
    const recipes = read<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    write(STORAGE_KEYS.RECIPES, recipes.filter((r) => r._id !== id));
    return { message: 'Recipe removed by admin' };
  },
};
