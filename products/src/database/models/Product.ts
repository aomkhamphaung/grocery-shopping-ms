import mongoose, { Schema, Document } from "mongoose";

interface ProductDoc extends Document {
  name: string;
  description: string;
  banner: string;
  type: string;
  unit: number;
  price: number;
  isAvailable: boolean;
  supplier: string;
}

const ProductSchema = new Schema(
  {
    name: String,
    description: String,
    banner: String,
    type: String,
    unit: Number,
    price: Number,
    isAvailable: Boolean,
    supplier: String,
  },
  {
    toJSON: {
      transform(ret, doc) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

export const Product = mongoose.model<ProductDoc>("products", ProductSchema);
