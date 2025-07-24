"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const catchAsync_1 = require("../middlewares/catchAsync");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../models/user.model");
exports.register = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const userExists = await user_model_1.User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    const user = await user_model_1.User.create({
        name,
        email,
        password,
        role: role || 'user', // Default role to 'user' if not provided
    });
    const token = (0, jwt_1.generateToken)({ id: user._id, role: user.role });
    res.status(201).json({
        message: 'User registered successfully',
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
    });
});
exports.login = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await user_model_1.User.findOne({ email }).select('+password');
    if (!user || !(await (0, bcrypt_1.comparePassword)(password, user.password))) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const token = (0, jwt_1.generateToken)({ id: user._id, role: user.role });
    res.status(200).json({
        message: 'User logged in successfully',
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
    });
});
