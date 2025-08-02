import { Request, Response, NextFunction } from "express";
import  Cart  from "../models/cart.model";
import { Book } from "../models/book.model";
import { catchAsync } from "../middlewares/catchAsync.middleware";

// Get current user's cart
export const getCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.book");
  if (!cart) {
    return res.status(200).json({ success: true, data: { items: [] } });
  }
  res.status(200).json({ success: true, data: cart });
});

// Add or update items in cart
export const updateCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { items } = req.body;
  // Optionally, validate book existence and stock here
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items });
  } else {
    cart.items = items;
    await cart.save();
  }
  res.status(200).json({ success: true, data: cart });
});

// Clear cart
export const clearCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.status(200).json({ success: true, data: cart });
});