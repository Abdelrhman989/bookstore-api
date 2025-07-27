import mongoose, { Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  price: number;
  coverImage: string;
  category: mongoose.Schema.Types.ObjectId;
  stock: number;
  isbn: string;
  publisher: string;
  publishedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new mongoose.Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    coverImage: { type: String, default: 'default-book-cover.jpg' },
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category', 
      required: true 
    },
    stock: { type: Number, required: true, default: 0 },
    isbn: { type: String, required: true, unique: true },
    publisher: { type: String, required: true },
    publishedDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Book = mongoose.model<IBook>('Book', bookSchema);