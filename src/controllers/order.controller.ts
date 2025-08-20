import { Request, Response, NextFunction } from "express";
import { Order } from "../models/order.model";
import { Book } from "../models/book.model";
import Cart from "../models/cart.model";
import { catchAsync } from "../middlewares/catchAsync.middleware";

// Create a new order
export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { items, totalPrice } = req.body;
  // Check if all books exist and have enough stock
  for (const item of items) {
    const book = await Book.findById(item.book);
    if (!book) {
      return res.status(404).json({ success: false, message: `Book not found: ${item.book}` });
    }
    if (book.stock < item.quantity) {
      return res.status(400).json({ success: false, message: `Not enough stock for book: ${book.title}` });
    }
  }
  // Decrement stock for each book
  for (const item of items) {
    await Book.findByIdAndUpdate(item.book, { $inc: { stock: -item.quantity } });
  }
  // Create order
  const order = await Order.create({
    user: req.user._id, // You must have middleware that adds user to req
    items,
    totalPrice,
  });
  
  // Add the order items to the user's cart
  // This ensures that the ordered items are added to the cart
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    // Add order items to cart
    cart.items = [...items];
    await cart.save();
  } else {
    // Create a new cart with the order items if it doesn't exist
    await Cart.create({
      user: req.user._id,
      items: [...items]
    });
  }
  
  res.status(201).json({ success: true, data: order });
});

// Get all orders for the current user
export const getMyOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const orders = await Order.find({ user: req.user._id }).populate("items.book");
  res.status(200).json({ success: true, count: orders.length, data: orders });
});

// Get a single order by ID (only owner or admin)
export const getOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.id).populate("items.book");
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  // Check that the user is the order owner or an admin
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
  res.status(200).json({ success: true, data: order });
});

// Update order status (admin only)
export const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  order.status = req.body.status;
  await order.save();
  res.status(200).json({ success: true, data: order });
});