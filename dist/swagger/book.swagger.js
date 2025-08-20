"use strict";
/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - description
 *         - price
 *         - category
 *         - stock
 *         - isbn
 *         - publisher
 *         - publishedDate
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the book
 *         title:
 *           type: string
 *           description: Book title
 *         author:
 *           type: string
 *           description: Book author
 *         description:
 *           type: string
 *           description: Book description
 *         price:
 *           type: number
 *           description: Book price
 *         coverImage:
 *           type: string
 *           description: URL to book cover image
 *         category:
 *           type: string
 *           description: Category ID the book belongs to
 *         stock:
 *           type: integer
 *           description: Number of books in stock
 *         isbn:
 *           type: string
 *           description: Book ISBN
 *         publisher:
 *           type: string
 *           description: Book publisher
 *         publishedDate:
 *           type: string
 *           format: date
 *           description: Book publication date
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Book creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Book last update timestamp
 *
 * /api/books:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get all books
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g. price,-createdAt)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include (e.g. title,author,price)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title, author, description, publisher, or ISBN
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter books by category ID
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *
 *   post:
 *     tags:
 *       - Books
 *     summary: Create a new book
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - description
 *               - price
 *               - category
 *               - stock
 *               - isbn
 *               - publisher
 *               - publishedDate
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *                 minLength: 10
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               coverImage:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               isbn:
 *                 type: string
 *                 minLength: 10
 *               publisher:
 *                 type: string
 *               publishedDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error or ISBN already exists
 *       401:
 *         description: Not authorized, no token or invalid token
 *       403:
 *         description: Forbidden, not an admin
 *       404:
 *         description: Category not found
 *
 * /api/books/{id}:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *
 *   put:
 *     tags:
 *       - Books
 *     summary: Update a book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *                 minLength: 10
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               coverImage:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               isbn:
 *                 type: string
 *                 minLength: 10
 *               publisher:
 *                 type: string
 *               publishedDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized, no token or invalid token
 *       403:
 *         description: Forbidden, not an admin
 *       404:
 *         description: Book or category not found
 *
 *   delete:
 *     tags:
 *       - Books
 *     summary: Delete a book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
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
 *       403:
 *         description: Forbidden, not an admin
 *       404:
 *         description: Book not found
 *
 * /api/books/category/{categoryId}:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get books by category
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g. price,-createdAt)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include (e.g. title,author,price)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title, author, description, publisher, or ISBN
 *     responses:
 *       200:
 *         description: List of books in the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       404:
 *         description: Category not found
 *
 * /api/books/low-stock:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get all books with stock below a threshold
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Stock threshold (default is 5)
 *     responses:
 *       200:
 *         description: List of low stock books
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
 *                     $ref: '#/components/schemas/Book'
 *       401:
 *         description: Not authorized, no token or invalid token
 *       403:
 *         description: Forbidden, not an admin
 *
 * /api/books/{id}/stock:
 *   patch:
 *     tags:
 *       - Books
 *     summary: Update the stock of a book (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stock
 *             properties:
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Book stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized, no token or invalid token
 *       403:
 *         description: Forbidden, not an admin
 *       404:
 *         description: Book not found
 *
 * /api/books/bulk/stock:
 *   patch:
 *     summary: Bulk update stock for multiple books
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     bookId:
 *                       type: string
 *                       description: The ID of the book
 *                     stock:
 *                       type: integer
 *                       minimum: 0
 *                       description: The new stock value
 *                 example:
 *                   - bookId: "60c72b2f9b1e8e001c8e4b8a"
 *                     stock: 15
 *                   - bookId: "60c72b2f9b1e8e001c8e4b8b"
 *                     stock: 8
 *     responses:
 *       200:
 *         description: Bulk stock update successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedBooks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
