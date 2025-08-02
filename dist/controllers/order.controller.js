"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrder = exports.getMyOrders = exports.createOrder = void 0;
const order_model_1 = require("../models/order.model");
const book_model_1 = require("../models/book.model");
const catchAsync_middleware_1 = require("../middlewares/catchAsync.middleware");
// Create a new order
exports.createOrder = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const { items, totalPrice } = req.body;
    // Check if all books exist and have enough stock
    for (const item of items) {
        const book = await book_model_1.Book.findById(item.book);
        if (!book) {
            return res.status(404).json({ success: false, message: `Book not found: ${item.book}` });
        }
        if (book.stock < item.quantity) {
            return res.status(400).json({ success: false, message: `Not enough stock for book: ${book.title}` });
        }
    }
    // Decrement stock for each book
    for (const item of items) {
        await book_model_1.Book.findByIdAndUpdate(item.book, { $inc: { stock: -item.quantity } });
    }
    // Create order
    const order = await order_model_1.Order.create({
        user: req.user._id, // يجب أن يكون لديك ميدل وير يضيف user للـ req
        items,
        totalPrice,
    });
    res.status(201).json({ success: true, data: order });
});
// Get all orders for the current user
exports.getMyOrders = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const orders = await order_model_1.Order.find({ user: req.user._id }).populate("items.book");
    res.status(200).json({ success: true, count: orders.length, data: orders });
});
// Get a single order by ID (only owner or admin)
exports.getOrder = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const order = await order_model_1.Order.findById(req.params.id).populate("items.book");
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }
    // تحقق أن المستخدم هو صاحب الطلب أو أدمن
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Not authorized" });
    }
    res.status(200).json({ success: true, data: order });
});
// Update order status (admin only)
exports.updateOrderStatus = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const order = await order_model_1.Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }
    order.status = req.body.status;
    await order.save();
    res.status(200).json({ success: true, data: order });
});
