import User from '../models/userModel.js';
import Recipe from '../models/recipeModel.js';
import asyncHandler from 'express-async-handler';

const getAdminDashboard = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalRecipes = await Recipe.countDocuments();
  const totalFavorites = await Recipe.aggregate([
    { $project: { count: { $size: '$favorites' } } },
    { $group: { _id: null, total: { $sum: '$count' } } },
  ]);
  const recentRecipes = await Recipe.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');

  res.json({
    totalUsers,
    totalRecipes,
    totalFavorites: totalFavorites[0]?.total || 0,
    recentRecipes,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete an admin user');
  }
  await Recipe.deleteMany({ user: user._id });
  await user.deleteOne();
  res.json({ message: 'User and their recipes removed' });
});

const getAllRecipesAdmin = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(recipes);
});

const deleteRecipeAdmin = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }
  await recipe.deleteOne();
  res.json({ message: 'Recipe removed by admin' });
});

export { getAdminDashboard, getUsers, deleteUser, getAllRecipesAdmin, deleteRecipeAdmin };
