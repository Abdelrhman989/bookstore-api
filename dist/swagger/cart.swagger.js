"use strict";
/**
 * @openapi
 * components:
 *   schemas:
 *     CartItem:
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
 *           minimum: 1
 *           description: Quantity of the book
 *     Cart:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: User ID
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *
 * /api/cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get the current user's cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Not authorized, no token or invalid token
 *
 *   put:
 *     tags:
 *       - Cart
 *     summary: Add or update items in the cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized, no token or invalid token
 *
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Clear the cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authorized, no token or invalid token
 */ 
