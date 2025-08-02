"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
// Schema for a single order item
const orderItemSchema = zod_1.z.object({
    book: zod_1.z.string().min(1, 'Book ID is required'),
    quantity: zod_1.z.number().int().min(1, 'Quantity must be at least 1'),
});
// Schema for creating an order
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z.array(orderItemSchema).min(1, 'Order must have at least one item'),
        totalPrice: zod_1.z.number().positive('Total price must be positive'),
    }),
});
// Schema for updating order status (admin or system)
exports.updateOrderStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Order ID is required'),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    }),
});
