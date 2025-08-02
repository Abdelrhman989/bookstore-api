import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus
} from "../controllers/order.controller";
import validateRequest from "../middlewares/validateRequest.middleware";
import { protect, authorize } from "../middlewares/auth.middleware";
import {
  createOrderSchema,
  updateOrderStatusSchema
} from "../validations/order.validation";

const router = Router();

// Create a new order (user only)
router.post("/", protect, validateRequest(createOrderSchema), createOrder);

// Get all orders for current user
router.get("/", protect, getMyOrders);

// Get a single order by ID (owner or admin)
router.get("/:id", protect, getOrder);

// Update order status (admin only)
router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  validateRequest(updateOrderStatusSchema),
  updateOrderStatus
);

export default router;