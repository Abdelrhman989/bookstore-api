import { z } from 'zod';

export const createBookSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author is required'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    price: z.number().positive('Price must be a positive number'),
    coverImage: z.string().optional(),
    category: z.string().min(1, 'Category ID is required'),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
    isbn: z.string().min(10, 'ISBN must be at least 10 characters long'),
    publisher: z.string().min(1, 'Publisher is required'),
    publishedDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Published date must be a valid date string',
    }),
  }),
});

export const updateBookSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Book ID is required'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    author: z.string().min(1, 'Author is required').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters long').optional(),
    price: z.number().positive('Price must be a positive number').optional(),
    coverImage: z.string().optional(),
    category: z.string().min(1, 'Category ID is required').optional(),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer').optional(),
    isbn: z.string().min(10, 'ISBN must be at least 10 characters long').optional(),
    publisher: z.string().min(1, 'Publisher is required').optional(),
    publishedDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Published date must be a valid date string',
    }).optional(),
  }),
});

export const bulkUpdateBookStockSchema = z.object({
  body: z.object({
    updates: z.array(
      z.object({
        id: z.string().min(1, 'Book ID is required'),
        stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
      })
    ).min(1, 'At least one update is required'),
  }),
});