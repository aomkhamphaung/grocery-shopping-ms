export interface CreateProductInput {
  name: string;
  description: string;
  banner: string;
  type: string;
  unit: number;
  price: number;
  isAvailable: boolean;
  supplier: string;
}

export interface ProductPayload {
  productId: string;
  qty: number;
}

export class CustomerPayload {
  _id: string;
  email: string;
}
