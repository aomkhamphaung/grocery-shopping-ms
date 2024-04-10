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

export interface FindCustomerQuery {
  email: string;
}

export interface WishlistInput {
  _id: string;
  name: string;
  description: string;
  banner: string;
  isAvailable: boolean;
  price: number;
}
