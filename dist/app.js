"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const notFound_middleware_1 = require("./middlewares/notFound.middleware");
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const db_1 = __importDefault(require("./config/db"));
const swagger_1 = __importDefault(require("./utils/swagger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/books', book_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
// Swagger documentation
(0, swagger_1.default)(app);
app.use(notFound_middleware_1.notFound);
app.use(errorHandler_middleware_1.errorHandler);
(0, db_1.default)().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
});
