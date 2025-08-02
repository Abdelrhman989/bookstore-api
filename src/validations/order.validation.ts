import { z } from 'zod';

// Schema for a single order item
const orderItemSchema = z.object({
  book: z.string().min(1, 'Book ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

// Schema for creating an order
export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
    totalPrice: z.number().positive('Total price must be positive'),
  }),
});

// Schema for updating order status (admin or system)
export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
  body: z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  }),
});