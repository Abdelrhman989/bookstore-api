"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const validateRequest_middleware_1 = __importDefault(require("../middlewares/validateRequest.middleware"));
const category_validation_1 = require("../validations/category.validation");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', category_controller_1.getCategories);
router.get('/:id', category_controller_1.getCategory);
// Protected routes (admin only)
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), (0, validateRequest_middleware_1.default)(category_validation_1.createCategorySchema), category_controller_1.createCategory);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), (0, validateRequest_middleware_1.default)(category_validation_1.updateCategorySchema), category_controller_1.updateCategory);
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), category_controller_1.deleteCategory);
exports.default = router;
