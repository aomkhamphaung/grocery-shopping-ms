import mongoose, { Document, Schema } from "mongoose";

interface CartItem {
  product: {
    _id: string;
    name: string;
    description: string;
    banner: string;
    type: string;
    unit: number;
    price: number;
    supplier: string;
  };
  unit: number;
}

interface CartDoc extends Document {
  customerId: string;
  items: CartItem[];
}

const CartSchema = new Schema(
  {
    customerId: { type: String },
    items: [
      {
        product: {
          _id: { type: String, required: true },
          name: String,
          description: String,
          banner: String,
          type: String,
          unit: Number,
          price: Number,
          supplier: String,
        },
        unit: { type: Number, require: true },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

export const Cart = mongoose.model<CartDoc>("cart", CartSchema);
