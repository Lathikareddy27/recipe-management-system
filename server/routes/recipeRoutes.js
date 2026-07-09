import express from 'express';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavorite,
  getMyRecipes,
  getFavoriteRecipes,
} from '../controllers/recipeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getRecipes).post(protect, createRecipe);
router.get('/my', protect, getMyRecipes);
router.get('/favorites', protect, getFavoriteRecipes);
router.route('/:id').get(getRecipeById).put(protect, updateRecipe).delete(protect, deleteRecipe);
router.put('/:id/favorite', protect, toggleFavorite);

export default router;
