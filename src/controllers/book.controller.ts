import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../middlewares/catchAsync.middleware";
import bookService from "../services/book.service";
import logger from "../utils/logger";
import { Book } from "../models/book.model";
import { Category} from "../models/category.model";

// Get all books with filtering, sorting, pagination
export const getBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`GET /api/books - Query: ${JSON.stringify(req.query)}`);
    
    try {
      // Check if advanced search is requested
      const isAdvancedSearch = req.query.advanced === 'true';
      
      let result;
      if (isAdvancedSearch) {
        result = await bookService.advancedSearchBooks(req.query);
      } else {
        result = await bookService.getBooks(req.query);
      }
      
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Error in getBooks controller: ${error}`);
      next(error);
    }
  }
);

// Advanced search for books
export const advancedSearchBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`GET /api/books/search/advanced - Query: ${JSON.stringify(req.query)}`);
    
    try {
      const result = await bookService.advancedSearchBooks(req.query);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Error in advancedSearchBooks controller: ${error}`);
      next(error);
    }
  }
);

// Get single book
export const getBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`GET /api/books/${req.params.id}`);
    
    try {
      const result = await bookService.getBookById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Error in getBook controller: ${error}`);
      next(error);
    }

    res.status(200).json({ success: true, data: Book });
  }
);

// Create new book
export const createBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if book with ISBN already exists
    const existingBook = await Book.findOne({ isbn: req.body.isbn });

    if (existingBook) {
      res
        .status(400)
        .json({
          success: false,
          message: "Book with this ISBN already exists",
        });
      return;
    }

    // Check if category exists
    const category = await Category.findById(req.body.category);

    if (!category) {
      res.status(400).json({ success: false, message: "Category not found" });
      return;
    }

    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  }
);

// Update book
export const updateBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }

    try {
      const result = await bookService.updateBook(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Error in updateBook controller: ${error}`);
      next(error);
    }
  }
);

// Delete book
export const deleteBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`DELETE /api/books/${req.params.id}`);
    
    try {
      const result = await bookService.deleteBook(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Error in deleteBook controller: ${error}`);
      next(error);
    }
  }
);

// // Get books by category
// export const getBooksByCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   const category = await Category.findById(req.params.categoryId);

//   if (!category) {
//     res.status(404).json({ success: false, message: 'Category not found' });
//     return;
//   }

//   // Create features instance with category filter
//   const features = new APIFeatures(Book.find({ category: req.params.categoryId }), req.query)
//     .search()
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   // Execute query
//   const books = await features.query.populate('category', 'name slug');

//   // Get total count for pagination info
//   const totalBooks = await Book.countDocuments({ category: req.params.categoryId });

//   res.status(200).json({
//     success: true,
//     count: books.length,
//     totalBooks,
//     totalPages: Math.ceil(totalBooks / (parseInt(req.query.limit as string, 10) || 10)),
//     currentPage: parseInt(req.query.page as string, 10) || 1,
//     data: books
//   });
// });

// Get books with low stock
export const getLowStockBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`GET /api/books/low-stock - Threshold: ${req.query.threshold || 5}`);
    
    try {
      const threshold = parseInt(req.query.threshold as string, 10) || 5;
      const result = await bookService.getLowStockBooks(threshold);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Error in getLowStockBooks controller: ${error}`);
      next(error);
    }
  }
);

// Update stock for a book
export const updateBookStock = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`PATCH /api/books/${req.params.id}/stock - Stock: ${req.body.stock}`);
    
    try {
      const { stock } = req.body;
      const result = await bookService.updateBookStock(req.params.id, stock);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Error in updateBookStock controller: ${error}`);
      next(error);
    }
  }
);

// Bulk update stock for multiple books
export const bulkUpdateBookStock = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updates = req.body.updates; // [{ id, stock }, ...]
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ success: false, message: "No updates provided" });
    }
    const results = [];
    for (const update of updates) {
      if (!update.id || typeof update.stock !== "number") continue;
      const book = await Book.findByIdAndUpdate(update.id, { stock: update.stock }, { new: true, runValidators: true });
      if (book) results.push(book);
    }
    res.status(200).json({ success: true, count: results.length, data: results });
  }
);
