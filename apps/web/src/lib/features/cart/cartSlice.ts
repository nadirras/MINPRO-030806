import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { RootState } from '../store';

export interface CartItem {
  cartItemId: number;
  eventId: number;
  eventName: string;
  eventCategory: string;
  ticketPrice: number;
  quantity: number;
  totalItemPrice: number;
}

export interface Cart {
  userId: number;
  username: string;
  cartItems: CartItem[];
  totalCartPrice: number;
}

export interface CartSlice {
  cart: Cart | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartSlice = {
  cart: null,
  status: 'idle',
  error: null,
};

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { eventSlug, quantity }: { eventSlug: string; quantity: number },
    thunkAPI,
  ) => {
    const token = Cookies.get('token');
    const res = await fetch('http://localhost:8000/api/carts/add-cart-slug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventSlug, quantity }), // Sending eventSlug instead of eventId
    });

    if (!res.ok) {
      throw new Error('Failed to add item to cart');
    }

    return await res.json();
  },
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (
    { eventId, quantity }: { eventId: number; quantity: number },
    thunkAPI,
  ) => {
    const token = Cookies.get('token');
    const res = await fetch('http://localhost:8000/api/carts/update-cart', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId, quantity }),
    });

    if (!res.ok) {
      throw new Error('Failed to update cart item');
    }

    return await res.json();
  },
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async ({ eventId }: { eventId: number }, thunkAPI) => {
    const token = Cookies.get('token');
    const res = await fetch(
      `http://localhost:8000/api/carts/remove-cart-item/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error('Failed to remove cart item');
    }

    return await res.json();
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart | null>) => {
      state.cart = action.payload;
    },
    clearCart: (state) => {
      state.cart = null;
      state.status = 'idle';
      state.error = null;
    },
    clearCartItem: (state, action: PayloadAction<number>) => {
      // Filter out the cart item with the given eventId
      if (state.cart) {
        state.cart.cartItems = state.cart.cartItems.filter(
          (item) => item.eventId !== action.payload,
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.fulfilled, (state, action) => {
      // Handle successful addition to cart if necessary
    });
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      // Handle successful cart item update if necessary
    });
    builder.addCase(removeCartItem.fulfilled, (state, action) => {
      if (state.cart) {
        state.cart.cartItems = state.cart.cartItems.filter(
          (item) => item.eventId !== action.payload.eventId,
        );
      }
    });
  },
});

export const { setCart, clearCart, clearCartItem } = cartSlice.actions;

export default cartSlice;

export const selectCart = (state: RootState): Cart | null => state.cart.cart;

export { cartSlice };
