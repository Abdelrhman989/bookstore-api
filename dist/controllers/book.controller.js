"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooksByCategory = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getBooks = void 0;
const catchAsync_middleware_1 = require("../middlewares/catchAsync.middleware");
const book_model_1 = require("../models/book.model");
const category_model_1 = require("../models/category.model");
// Get all books
exports.getBooks = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const books = await book_model_1.Book.find().populate('category', 'name slug');
    res.status(200).json({ success: true, count: books.length, data: books });
});
// Get single book
exports.getBook = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const book = await book_model_1.Book.findById(req.params.id).populate('category', 'name slug');
    if (!book) {
        res.status(404).json({ success: false, message: 'Book not found' });
        return;
    }
    res.status(200).json({ success: true, data: book });
});
// Create new book
exports.createBook = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    // Check if book with ISBN already exists
    const existingBook = await book_model_1.Book.findOne({ isbn: req.body.isbn });
    if (existingBook) {
        res.status(400).json({ success: false, message: 'Book with this ISBN already exists' });
        return;
    }
    // Check if category exists
    const category = await category_model_1.Category.findById(req.body.category);
    if (!category) {
        res.status(400).json({ success: false, message: 'Category not found' });
        return;
    }
    const book = await book_model_1.Book.create(req.body);
    res.status(201).json({ success: true, data: book });
});
// Update book
exports.updateBook = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    let book = await book_model_1.Book.findById(req.params.id);
    if (!book) {
        res.status(404).json({ success: false, message: 'Book not found' });
        return;
    }
    // Check if category exists if it's being updated
    if (req.body.category) {
        const category = await category_model_1.Category.findById(req.body.category);
        if (!category) {
            res.status(400).json({ success: false, message: 'Category not found' });
            return;
        }
    }
    book = await book_model_1.Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).populate('category', 'name slug');
    res.status(200).json({ success: true, data: book });
});
// Delete book
exports.deleteBook = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const book = await book_model_1.Book.findById(req.params.id);
    if (!book) {
        res.status(404).json({ success: false, message: 'Book not found' });
        return;
    }
    await book.deleteOne();
    res.status(200).json({ success: true, data: {} });
});
// Get books by category
exports.getBooksByCategory = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const category = await category_model_1.Category.findById(req.params.categoryId);
    if (!category) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
    }
    const books = await book_model_1.Book.find({ category: req.params.categoryId }).populate('category', 'name slug');
    res.status(200).json({ success: true, count: books.length, data: books });
});
