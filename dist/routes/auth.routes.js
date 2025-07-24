"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const auth_validation_1 = require("../validations/auth.validation");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', (0, validateRequest_1.default)(auth_validation_1.registerSchema), auth_controller_1.register);
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.loginSchema), auth_controller_1.login);
// Example of a protected route
router.get('/me', auth_middleware_1.protect, (req, res) => {
    res.status(200).json({ message: 'Welcome to your profile', user: req.user });
});
// Example of an admin-only route
router.get('/admin-dashboard', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), (req, res) => {
    res.status(200).json({ message: 'Welcome to the admin dashboard', user: req.user });
});
exports.default = router;
