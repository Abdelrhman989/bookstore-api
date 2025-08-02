"use strict";
/**
 * @openapi
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - book
 *         - quantity
 *       properties:
 *         book:
 *           type: string
 *           description: Book ID
 *         quantity:
 *           type: integer
 *           description: Quantity of the book
 *     Order:
 *       type: object
 *       required:
 *         - user
 *         - items
 *         - totalPrice
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the order
 *         user:
 *           type: string
 *           description: User ID
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalPrice:
 *           type: number
 *           description: Total price for the order
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *           description: Order status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Order last update timestamp
 *
 * /api/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create a new order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - totalPrice
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error or not enough stock
 *       401:
 *         description: Not authorized, no token or invalid token
 *
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders for the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized
 *
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get a single order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to access this order
 *       404:
 *         description: Order not found
 *
 *   put:
 *     tags:
 *       - Orders
 *     summary: Update order status (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to update this order
 *       404:
 *         description: Order not found
 */ 
