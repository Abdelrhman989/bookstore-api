"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_controller_1 = require("../controllers/book.controller");
const validateRequest_middleware_1 = __importDefault(require("../middlewares/validateRequest.middleware"));
const book_validation_1 = require("../validations/book.validation");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get("/", book_controller_1.getBooks);
router.get("/:id", book_controller_1.getBook);
router.get("/low-stock", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin"), book_controller_1.getLowStockBooks);
router.patch("/bulk/stock", auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), (0, validateRequest_middleware_1.default)(book_validation_1.bulkUpdateBookStockSchema), book_controller_1.bulkUpdateBookStock);
// Protected routes (admin only)
router.post("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin"), (0, validateRequest_middleware_1.default)(book_validation_1.createBookSchema), book_controller_1.createBook);
router.put("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin"), (0, validateRequest_middleware_1.default)(book_validation_1.updateBookSchema), book_controller_1.updateBook);
router.delete("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin"), book_controller_1.deleteBook);
exports.default = router;
