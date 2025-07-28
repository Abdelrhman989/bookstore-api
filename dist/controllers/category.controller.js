"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getCategories = void 0;
const catchAsync_middleware_1 = require("../middlewares/catchAsync.middleware");
const category_model_1 = require("../models/category.model");
// Get all categories
exports.getCategories = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const categories = await category_model_1.Category.find();
    res.status(200).json({ success: true, count: categories.length, data: categories });
});
// Get single category
exports.getCategory = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const category = await category_model_1.Category.findById(req.params.id);
    if (!category) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
    }
    res.status(200).json({ success: true, data: category });
});
// Create new category
exports.createCategory = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    // Check if category with same name already exists
    const existingCategory = await category_model_1.Category.findOne({ name: req.body.name });
    if (existingCategory) {
        res.status(400).json({ success: false, message: 'Category with this name already exists' });
        return;
    }
    // Generate slug from name
    const categoryData = {
        ...req.body,
        slug: req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    };
    const category = await category_model_1.Category.create(categoryData);
    res.status(201).json({ success: true, data: category });
});
// Update category
exports.updateCategory = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    let category = await category_model_1.Category.findById(req.params.id);
    if (!category) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
    }
    category = await category_model_1.Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: category });
});
// Delete category
exports.deleteCategory = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const category = await category_model_1.Category.findById(req.params.id);
    if (!category) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
    }
    await category.deleteOne();
    res.status(200).json({ success: true, data: {} });
});
