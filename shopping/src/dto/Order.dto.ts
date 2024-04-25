export interface CreateCartItemInput {
  _id: string;
  name: string;
  description: string;
  banner: string;
  type: string;
  unit: number;
  price: number;
  supplier: string;
}

export interface userInput {
  _id: string;
  transactionId: string;
}

export class CustomerPayload {
  _id: string;
  email: string;
}
