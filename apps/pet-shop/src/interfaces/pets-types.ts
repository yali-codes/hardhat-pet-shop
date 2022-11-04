export type Pet = {
  id: number;
  name: string;
  picture: string;
  age: number;
  breed: string;
  location: string;
  statusText: string;
  price: number;
};

export type WithDraw = {
  to: string | null;
  from: string | null;
  amount: string;
  balance: string;
};
