import { Router } from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import validateRequest from '../middlewares/validateRequest.middleware';
import { createCategorySchema, updateCategorySchema } from '../validations/category.validation';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), validateRequest(createCategorySchema), createCategory);
router.put('/:id', protect, authorize('admin'), validateRequest(updateCategorySchema), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;