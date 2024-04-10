export class CustomerPayload {
  _id: string;
  email: string;
}

export interface CreateCustomerInput {
  email: string;
  password: string;
  salt: string;
  phone: string;
}

export interface CreateCartItemInput {
  _id: string;
  name: string;
  price: number;
  banner: string;
}

export interface WishlistInput {
  _id: string;
  name: string;
  description: string;
  banner: string;
  isAvailable: boolean;
  price: number;
}

export interface CreateOrderInput {
  _id: string;
  amount: number;
  date: Date;
}

export interface FindCustomerQuery {
  email: string;
}
