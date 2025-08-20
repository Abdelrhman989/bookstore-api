import { Router } from "express";
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getLowStockBooks,
  bulkUpdateBookStock,
  advancedSearchBooks,
} from "../controllers/book.controller";
import validateRequest from "../middlewares/validateRequest.middleware";
import {
  createBookSchema,
  updateBookSchema,
  bulkUpdateBookStockSchema } from "../validations/book.validation";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", getBooks);
router.get("/search/advanced", advancedSearchBooks);
router.get("/:id", getBook);
router.get(
  "/low-stock",
  protect,
  authorize("admin"),
  getLowStockBooks
);
router.patch(
  "/bulk/stock",
  protect,
  authorize('admin'),
  validateRequest(bulkUpdateBookStockSchema),
  bulkUpdateBookStock
);

// Protected routes (admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  validateRequest(createBookSchema),
  createBook
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateRequest(updateBookSchema),
  updateBook
);
router.delete("/:id", protect, authorize("admin"), deleteBook);

export default router;
