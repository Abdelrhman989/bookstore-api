import mongoose, { Document } from 'mongoose';

// Order Item subdocument interface
export interface IOrderItem {
  book: mongoose.Schema.Types.ObjectId; // Reference to Book
  quantity: number;
}

// Order main document interface
export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId; // Reference to User
  items: IOrderItem[]; // List of ordered books
  totalPrice: number; // Total price for the order
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // Order status
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema<IOrderItem>({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);