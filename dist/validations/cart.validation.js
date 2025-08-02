"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCartSchema = exports.updateCartSchema = void 0;
const zod_1 = require("zod");
// Schema for a single cart item
const cartItemSchema = zod_1.z.object({
    book: zod_1.z.string().min(1, 'Book ID is required'),
    quantity: zod_1.z.number().int().min(1, 'Quantity must be at least 1'),
});
// Schema for adding/updating items in the cart
exports.updateCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z.array(cartItemSchema).min(1, 'Cart must have at least one item'),
    }),
});
// Schema for clearing the cart (no body required, just params if needed)
exports.clearCartSchema = zod_1.z.object({
// You can add params if your route requires them, e.g., userId
});
