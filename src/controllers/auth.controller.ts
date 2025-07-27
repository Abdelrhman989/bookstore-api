import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../middlewares/catchAsync.middleware';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { User } from '../models/user.model';

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user', // Default role to 'user' if not provided
  });

  const token = generateToken({ id: user._id, role: user.role });

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await comparePassword(password, user.password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = generateToken({ id: user._id, role: user.role });

  res.status(200).json({
    message: 'User logged in successfully',
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});