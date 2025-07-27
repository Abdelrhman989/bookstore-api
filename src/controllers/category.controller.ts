import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../middlewares/catchAsync.middleware';
import { Category } from '../models/category.model';

// Get all categories
export const getCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await Category.find();
  res.status(200).json({ success: true, count: categories.length, data: categories });
});

// Get single category
export const getCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404).json({ success: false, message: 'Category not found' });
    return;
  }
  
  res.status(200).json({ success: true, data: category });
});

// Create new category
export const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Check if category with same name already exists
  const existingCategory = await Category.findOne({ name: req.body.name });
  
  if (existingCategory) {
    res.status(400).json({ success: false, message: 'Category with this name already exists' });
    return;
  }
  
  // Generate slug from name
  const categoryData = {
    ...req.body,
    slug: req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
  };
  
  const category = await Category.create(categoryData);
  res.status(201).json({ success: true, data: category });
});

// Update category
export const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404).json({ success: false, message: 'Category not found' });
    return;
  }
  
  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({ success: true, data: category });
});

// Delete category
export const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404).json({ success: false, message: 'Category not found' });
    return;
  }
  
  await category.deleteOne();
  
  res.status(200).json({ success: true, data: {} });
});