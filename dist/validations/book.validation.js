"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateBookStockSchema = exports.updateBookSchema = exports.createBookSchema = void 0;
const zod_1 = require("zod");
exports.createBookSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        author: zod_1.z.string().min(1, 'Author is required'),
        description: zod_1.z.string().min(10, 'Description must be at least 10 characters long'),
        price: zod_1.z.number().positive('Price must be a positive number'),
        coverImage: zod_1.z.string().optional(),
        category: zod_1.z.string().min(1, 'Category ID is required'),
        stock: zod_1.z.number().int().nonnegative('Stock must be a non-negative integer'),
        isbn: zod_1.z.string().min(10, 'ISBN must be at least 10 characters long'),
        publisher: zod_1.z.string().min(1, 'Publisher is required'),
        publishedDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Published date must be a valid date string',
        }),
    }),
});
exports.updateBookSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Book ID is required'),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required').optional(),
        author: zod_1.z.string().min(1, 'Author is required').optional(),
        description: zod_1.z.string().min(10, 'Description must be at least 10 characters long').optional(),
        price: zod_1.z.number().positive('Price must be a positive number').optional(),
        coverImage: zod_1.z.string().optional(),
        category: zod_1.z.string().min(1, 'Category ID is required').optional(),
        stock: zod_1.z.number().int().nonnegative('Stock must be a non-negative integer').optional(),
        isbn: zod_1.z.string().min(10, 'ISBN must be at least 10 characters long').optional(),
        publisher: zod_1.z.string().min(1, 'Publisher is required').optional(),
        publishedDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Published date must be a valid date string',
        }).optional(),
    }),
});
exports.bulkUpdateBookStockSchema = zod_1.z.object({
    body: zod_1.z.object({
        updates: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string().min(1, 'Book ID is required'),
            stock: zod_1.z.number().int().nonnegative('Stock must be a non-negative integer'),
        })).min(1, 'At least one update is required'),
    }),
});
