import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  book: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;