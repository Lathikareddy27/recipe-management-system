import Recipe from '../models/recipeModel.js';
import asyncHandler from 'express-async-handler';

const getRecipes = asyncHandler(async (req, res) => {
  const pageSize = 9;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: 'i' } }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};
  const filter = { ...keyword, ...category };

  const count = await Recipe.countDocuments(filter);
  const recipes = await Recipe.find(filter)
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    recipes,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate('user', 'name');
  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404);
    throw new Error('Recipe not found');
  }
});

const createRecipe = asyncHandler(async (req, res) => {
  const { name, category, ingredients, instructions, prepTime, cookTime, difficulty, servings, image } = req.body;
  if (!name || !category || !ingredients || !instructions || prepTime == null || cookTime == null || !difficulty || !servings) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }
  const recipe = await Recipe.create({
    name,
    category,
    ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split('\n').map((i) => i.trim()).filter(Boolean),
    instructions,
    prepTime: Number(prepTime),
    cookTime: Number(cookTime),
    difficulty,
    servings: Number(servings),
    image: image || '',
    user: req.user._id,
  });
  res.status(201).json(recipe);
});

const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }
  if (recipe.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to edit this recipe');
  }
  const { name, category, ingredients, instructions, prepTime, cookTime, difficulty, servings, image } = req.body;
  recipe.name = name || recipe.name;
  recipe.category = category || recipe.category;
  recipe.ingredients = ingredients
    ? Array.isArray(ingredients)
      ? ingredients
      : ingredients.split('\n').map((i) => i.trim()).filter(Boolean)
    : recipe.ingredients;
  recipe.instructions = instructions || recipe.instructions;
  recipe.prepTime = prepTime != null ? Number(prepTime) : recipe.prepTime;
  recipe.cookTime = cookTime != null ? Number(cookTime) : recipe.cookTime;
  recipe.difficulty = difficulty || recipe.difficulty;
  recipe.servings = servings != null ? Number(servings) : recipe.servings;
  recipe.image = image ?? recipe.image;

  const updated = await recipe.save();
  res.json(updated);
});

const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }
  if (recipe.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this recipe');
  }
  await recipe.deleteOne();
  res.json({ message: 'Recipe removed' });
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }
  const userId = req.user._id;
  const index = recipe.favorites.findIndex((f) => f.toString() === userId.toString());
  if (index === -1) {
    recipe.favorites.push(userId);
  } else {
    recipe.favorites.splice(index, 1);
  }
  await recipe.save();
  res.json({
    _id: recipe._id,
    isFavorite: recipe.favorites.some((f) => f.toString() === userId.toString()),
    favoritesCount: recipe.favorites.length,
  });
});

const getMyRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(recipes);
});

const getFavoriteRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({ favorites: req.user._id }).sort({ createdAt: -1 });
  res.json(recipes);
});

export {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavorite,
  getMyRecipes,
  getFavoriteRecipes,
};
