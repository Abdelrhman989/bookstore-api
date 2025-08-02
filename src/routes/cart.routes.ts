import { Router } from "express";
import { getCart, updateCart, clearCart } from "../controllers/cart.controller";
import validateRequest from "../middlewares/validateRequest.middleware";
import { updateCartSchema } from "../validations/cart.validation";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// Get current user's cart
router.get("/", protect, getCart);

// Add or update items in cart
router.put("/", protect, validateRequest(updateCartSchema), updateCart);

// Clear cart
router.delete("/", protect, clearCart);

export default router;