import { Router } from 'express';
import { getBooks, getBook, createBook, updateBook, deleteBook, getBooksByCategory } from '../controllers/book.controller';
import validateRequest from '../middlewares/validateRequest.middleware';
import { createBookSchema, updateBookSchema } from '../validations/book.validation';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', getBooks);
router.get('/:id', getBook);
router.get('/category/:categoryId', getBooksByCategory);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), validateRequest(createBookSchema), createBook);
router.put('/:id', protect, authorize('admin'), validateRequest(updateBookSchema), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);

export default router;