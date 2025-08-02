import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../middlewares/catchAsync.middleware";
import { Book } from "../models/book.model";
import { Category } from "../models/category.model";
import APIFeatures from "../utils/apiFeatures";

// Get all books with filtering, sorting, pagination
export const getBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // لو فيه category في الـ query، ضيفها للفلترة
    const filter: any = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Create features instance
    const features = new APIFeatures(Book.find(filter), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const books = await features.query.populate("category", "name slug");

    // Get total count for pagination info
    const totalBooks = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: books.length,
      totalBooks,
      totalPages: Math.ceil(
        totalBooks / (parseInt(req.query.limit as string, 10) || 10)
      ),
      currentPage: parseInt(req.query.page as string, 10) || 1,
      data: books,
    });
  }
);

// Get single book
export const getBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const book = await Book.findById(req.params.id).populate(
      "category",
      "name slug"
    );

    if (!book) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }

    res.status(200).json({ success: true, data: book });
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

    // Check if category exists if it's being updated
    if (req.body.category) {
      const category = await Category.findById(req.body.category);

      if (!category) {
        res.status(400).json({ success: false, message: "Category not found" });
        return;
      }
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    res.status(200).json({ success: true, data: book });
  }
);

// Delete book
export const deleteBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }

    await book.deleteOne();

    res.status(200).json({ success: true, data: {} });
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
    const threshold = parseInt(req.query.threshold as string, 10) || 5;
    const books = await Book.find({ stock: { $lt: threshold } });
    res.status(200).json({ success: true, count: books.length, data: books });
  }
);

// Update stock for a book
export const updateBookStock = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { stock } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    );
    if (!book) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }
    res.status(200).json({ success: true, data: book });
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
