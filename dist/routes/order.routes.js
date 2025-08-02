"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const validateRequest_middleware_1 = __importDefault(require("../middlewares/validateRequest.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const order_validation_1 = require("../validations/order.validation");
const router = (0, express_1.Router)();
// Create a new order (user only)
router.post("/", auth_middleware_1.protect, (0, validateRequest_middleware_1.default)(order_validation_1.createOrderSchema), order_controller_1.createOrder);
// Get all orders for current user
router.get("/", auth_middleware_1.protect, order_controller_1.getMyOrders);
// Get a single order by ID (owner or admin)
router.get("/:id", auth_middleware_1.protect, order_controller_1.getOrder);
// Update order status (admin only)
router.put("/:id/status", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin"), (0, validateRequest_middleware_1.default)(order_validation_1.updateOrderStatusSchema), order_controller_1.updateOrderStatus);
exports.default = router;
