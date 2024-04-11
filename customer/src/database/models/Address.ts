import mongoose, { Document, Schema } from "mongoose";

interface AddressDoc extends Document {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

const AddressSchema = new Schema(
  {
    street: { type: String, require: true },
    postalCode: { type: String, require: true },
    city: { type: String, require: true },
    country: { type: String, require: true },
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

export const Address = mongoose.model<AddressDoc>("address", AddressSchema);
