"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    coverImage: { type: String, default: 'default-book-cover.jpg' },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: { type: Number, required: true, default: 0 },
    isbn: { type: String, required: true, unique: true },
    publisher: { type: String, required: true },
    publishedDate: { type: Date, required: true },
}, { timestamps: true });
exports.Book = mongoose_1.default.model('Book', bookSchema);
