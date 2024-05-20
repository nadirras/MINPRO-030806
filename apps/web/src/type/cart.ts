export interface ICartItem {
  cartItemId: number;
  eventId: number;
  eventName: string;
  eventCategory: string;
  ticketPrice: number;
  quantity: number;
  totalItemPrice: number;
}

export interface ICart {
  userId: number;
  username: string;
  cartItems: ICartItem[];
  totalCartPrice: number;
}
