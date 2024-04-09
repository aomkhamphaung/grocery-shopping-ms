import mongoose, { Document, Schema } from "mongoose";

interface CustomerDoc extends Document {
  email: string;
  password: string;
  salt: string;
  phone: string;
  address: [any];
  cart: [any];
  wishlist: [any];
  orders: [any];
}

const CustomerSchema = new Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    phone: { type: String, require: true },
    address: [{ type: Schema.Types.ObjectId, ref: "address", require: true }],
    cart: [
      {
        product: {
          _id: { type: String },
          name: { type: String },
          banner: { type: String },
          price: { type: Number },
        },
        unit: { type: Number, require: true },
      },
    ],
    wishlist: [
      {
        _id: { type: String, required: true },
        name: { type: String },
        description: { type: String },
        banner: { type: String },
        isAvailable: { type: Boolean },
        price: { type: Number },
      },
    ],
    orders: [
      {
        _id: { type: String, required: true },
        amount: { type: Number },
        date: { type: Date, default: Date.now() },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

export const Customer = mongoose.model<CustomerDoc>(
  "customers",
  CustomerSchema
);
