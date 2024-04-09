export class CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export interface CustomerInput {
  _id: string;
  email: string;
  password: string;
  salt: string;
  phone: string;
  address: [any];
  cart: [any];
  wishlist: [any];
  orders: [any];
}
