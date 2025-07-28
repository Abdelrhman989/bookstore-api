import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../middlewares/catchAsync.middleware';
import { Book } from '../models/book.model';
import { Category } from '../models/category.model';
import APIFeatures from '../utils/apiFeatures';

// Get all books with filtering, sorting, pagination
export const getBooks = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Create features instance
  const features = new APIFeatures(Book.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute query
  const books = await features.query.populate('category', 'name slug');
  
  // Get total count for pagination info
  const totalBooks = await Book.countDocuments();
  
  res.status(200).json({
    success: true,
    count: books.length,
    totalBooks,
    totalPages: Math.ceil(totalBooks / (parseInt(req.query.limit as string, 10) || 10)),
    currentPage: parseInt(req.query.page as string, 10) || 1,
    data: books
  });
});

// Get single book
export const getBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const book = await Book.findById(req.params.id).populate('category', 'name slug');
  
  if (!book) {
    res.status(404).json({ success: false, message: 'Book not found' });
    return;
  }
  
  res.status(200).json({ success: true, data: book });
});

// Create new book
export const createBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Check if book with ISBN already exists
  const existingBook = await Book.findOne({ isbn: req.body.isbn });
  
  if (existingBook) {
    res.status(400).json({ success: false, message: 'Book with this ISBN already exists' });
    return;
  }
  
  // Check if category exists
  const category = await Category.findById(req.body.category);
  
  if (!category) {
    res.status(400).json({ success: false, message: 'Category not found' });
    return;
  }
  
  const book = await Book.create(req.body);
  res.status(201).json({ success: true, data: book });
});

// Update book
export const updateBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let book = await Book.findById(req.params.id);
  
  if (!book) {
    res.status(404).json({ success: false, message: 'Book not found' });
    return;
  }
  
  // Check if category exists if it's being updated
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    
    if (!category) {
      res.status(400).json({ success: false, message: 'Category not found' });
      return;
    }
  }
  
  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('category', 'name slug');
  
  res.status(200).json({ success: true, data: book });
});

// Delete book
export const deleteBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const book = await Book.findById(req.params.id);
  
  if (!book) {
    res.status(404).json({ success: false, message: 'Book not found' });
    return;
  }
  
  await book.deleteOne();
  
  res.status(200).json({ success: true, data: {} });
});

// Get books by category
export const getBooksByCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findById(req.params.categoryId);
  
  if (!category) {
    res.status(404).json({ success: false, message: 'Category not found' });
    return;
  }
  
  // Create features instance with category filter
  const features = new APIFeatures(Book.find({ category: req.params.categoryId }), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute query
  const books = await features.query.populate('category', 'name slug');
  
  // Get total count for pagination info
  const totalBooks = await Book.countDocuments({ category: req.params.categoryId });
  
  res.status(200).json({
    success: true,
    count: books.length,
    totalBooks,
    totalPages: Math.ceil(totalBooks / (parseInt(req.query.limit as string, 10) || 10)),
    currentPage: parseInt(req.query.page as string, 10) || 1,
    data: books
  });
});