"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.errors,
        });
    }
};
exports.default = validateRequest;
