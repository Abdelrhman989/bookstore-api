import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import validateRequest from '../middlewares/validateRequest.middleware';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Example of a protected route
router.get('/me', protect, (req, res) => {
  res.status(200).json({ message: 'Welcome to your profile', user: req.user });
});

// Example of an admin-only route
router.get('/admin-dashboard', protect, authorize('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard', user: req.user });
});

export default router;