"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateBookStock = exports.updateBookStock = exports.getLowStockBooks = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getBooks = void 0;
const catchAsync_middleware_1 = require("../middlewares/catchAsync.middleware");
const book_model_1 = require("../models/book.model");
const category_model_1 = require("../models/category.model");
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
// Get all books with filtering, sorting, pagination
exports.getBooks = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    // لو فيه category في الـ query، ضيفها للفلترة
    const filter = {};
    if (req.query.category) {
        filter.category = req.query.category;
    }
    // Create features instance
    const features = new apiFeatures_1.default(book_model_1.Book.find(filter), req.query)
        .search()
        .filter()
        .sort()
        .limitFields()
        .paginate();
    // Execute query
    const books = await features.query.populate("category", "name slug");
    // Get total count for pagination info
    const totalBooks = await book_model_1.Book.countDocuments(filter);
    res.status(200).json({
        success: true,
        count: books.length,
        totalBooks,
        totalPages: Math.ceil(totalBooks / (parseInt(req.query.limit, 10) || 10)),
        currentPage: parseInt(req.query.page, 10) || 1,
        data: books,
    });
});
// Get single book
exports.getBook = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const book = await book_model_1.Book.findById(req.params.id).populate("category", "name slug");
    if (!book) {
        res.status(404).json({ success: false, message: "Book not found" });
        return;
    }
    res.status(200).json({ success: true, data: book });
});
// Create new book
exports.createBook = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    // Check if book with ISBN already exists
    const existingBook = await book_model_1.Book.findOne({ isbn: req.body.isbn });
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
    const category = await category_model_1.Category.findById(req.body.category);
    if (!category) {
        res.status(400).json({ success: false, message: "Category not found" });
        return;
    }
    const book = await book_model_1.Book.create(req.body);
    res.status(201).json({ success: true, data: book });
});
// Update book
exports.updateBook = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    let book = await book_model_1.Book.findById(req.params.id);
    if (!book) {
        res.status(404).json({ success: false, message: "Book not found" });
        return;
    }
    // Check if category exists if it's being updated
    if (req.body.category) {
        const category = await category_model_1.Category.findById(req.body.category);
        if (!category) {
            res.status(400).json({ success: false, message: "Category not found" });
            return;
        }
    }
    book = await book_model_1.Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).populate("category", "name slug");
    res.status(200).json({ success: true, data: book });
});
// Delete book
exports.deleteBook = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const book = await book_model_1.Book.findById(req.params.id);
    if (!book) {
        res.status(404).json({ success: false, message: "Book not found" });
        return;
    }
    await book.deleteOne();
    res.status(200).json({ success: true, data: {} });
});
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
exports.getLowStockBooks = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const threshold = parseInt(req.query.threshold, 10) || 5;
    const books = await book_model_1.Book.find({ stock: { $lt: threshold } });
    res.status(200).json({ success: true, count: books.length, data: books });
});
// Update stock for a book
exports.updateBookStock = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const { stock } = req.body;
    const book = await book_model_1.Book.findByIdAndUpdate(req.params.id, { stock }, { new: true, runValidators: true });
    if (!book) {
        res.status(404).json({ success: false, message: "Book not found" });
        return;
    }
    res.status(200).json({ success: true, data: book });
});
// Bulk update stock for multiple books
exports.bulkUpdateBookStock = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const updates = req.body.updates; // [{ id, stock }, ...]
    if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ success: false, message: "No updates provided" });
    }
    const results = [];
    for (const update of updates) {
        if (!update.id || typeof update.stock !== "number")
            continue;
        const book = await book_model_1.Book.findByIdAndUpdate(update.id, { stock: update.stock }, { new: true, runValidators: true });
        if (book)
            results.push(book);
    }
    res.status(200).json({ success: true, count: results.length, data: results });
});
