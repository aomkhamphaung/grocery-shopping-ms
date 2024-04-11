import mongoose, { Document, Schema } from "mongoose";

interface Item {
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

interface OrderDoc extends Document {
  orderId: string;
  customerId: string;
  amount: number;
  status: string;
  transactionId: string;
  item: Item[];
}

const OrderSchema = new Schema(
  {
    orderId: String,
    customerId: String,
    amount: Number,
    status: String,
    transactionId: String,
    item: [{ type: Schema.Types.ObjectId, ref: "cart", require: true }],
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

export const Order = mongoose.model<OrderDoc>("orders", OrderSchema);
