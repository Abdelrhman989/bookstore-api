"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../models/user.model");
const catchAsync_1 = require("./catchAsync");
exports.protect = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = await user_model_1.User.findById(decoded.id).select('-password');
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
