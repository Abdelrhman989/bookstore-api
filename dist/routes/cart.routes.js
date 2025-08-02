"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const validateRequest_middleware_1 = __importDefault(require("../middlewares/validateRequest.middleware"));
const cart_validation_1 = require("../validations/cart.validation");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Get current user's cart
router.get("/", auth_middleware_1.protect, cart_controller_1.getCart);
// Add or update items in cart
router.put("/", auth_middleware_1.protect, (0, validateRequest_middleware_1.default)(cart_validation_1.updateCartSchema), cart_controller_1.updateCart);
// Clear cart
router.delete("/", auth_middleware_1.protect, cart_controller_1.clearCart);
exports.default = router;
