import { z } from 'zod';

// Schema for a single cart item
const cartItemSchema = z.object({
  book: z.string().min(1, 'Book ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

// Schema for adding/updating items in the cart
export const updateCartSchema = z.object({
  body: z.object({
    items: z.array(cartItemSchema).min(1, 'Cart must have at least one item'),
  }),
});

// Schema for clearing the cart (no body required, just params if needed)
export const clearCartSchema = z.object({
  // You can add params if your route requires them, e.g., userId
});