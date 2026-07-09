import express from 'express';
import {
  getAdminDashboard,
  getUsers,
  deleteUser,
  getAllRecipesAdmin,
  deleteRecipeAdmin,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, admin, getAdminDashboard);
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/recipes', protect, admin, getAllRecipesAdmin);
router.delete('/recipes/:id', protect, admin, deleteRecipeAdmin);

export default router;
