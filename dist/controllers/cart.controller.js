"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.updateCart = exports.getCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const catchAsync_middleware_1 = require("../middlewares/catchAsync.middleware");
// Get current user's cart
exports.getCart = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const cart = await cart_model_1.default.findOne({ user: req.user._id }).populate("items.book");
    if (!cart) {
        return res.status(200).json({ success: true, data: { items: [] } });
    }
    res.status(200).json({ success: true, data: cart });
});
// Add or update items in cart
exports.updateCart = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const { items } = req.body;
    // Optionally, validate book existence and stock here
    let cart = await cart_model_1.default.findOne({ user: req.user._id });
    if (!cart) {
        cart = await cart_model_1.default.create({ user: req.user._id, items });
    }
    else {
        cart.items = items;
        await cart.save();
    }
    res.status(200).json({ success: true, data: cart });
});
// Clear cart
exports.clearCart = (0, catchAsync_middleware_1.catchAsync)(async (req, res, next) => {
    const cart = await cart_model_1.default.findOne({ user: req.user._id });
    if (cart) {
        cart.items = [];
        await cart.save();
    }
    res.status(200).json({ success: true, data: cart });
});
