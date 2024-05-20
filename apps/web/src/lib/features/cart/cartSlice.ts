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
  // data: Cart | null;
  totalCartPrice: number;
  cartItems: CartItem[];
  userId: number;
  username: string;
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

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, thunkAPI) => {
    const token = Cookies.get('token');
    const res = await fetch('http://localhost:8000/api/carts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return thunkAPI.rejectWithValue(errorData);
    }

    return await res.json();
  },
);

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
      body: JSON.stringify({ eventSlug, quantity }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return thunkAPI.rejectWithValue(errorData);
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
      const errorData = await res.json();
      return thunkAPI.rejectWithValue(errorData);
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
      if (state.cart) {
        state.cart.cartItems = state.cart.cartItems.filter(
          (item) => item.eventId !== action.payload,
        );
        state.cart.totalCartPrice = state.cart.cartItems.reduce(
          (total, item) => total + item.totalItemPrice,
          0,
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch cart';
      })
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.cart) {
          state.cart.cartItems.push(action.payload);
          state.cart.totalCartPrice += action.payload.totalItemPrice;
        } else {
          state.cart = {
            userId: action.payload.userId,
            username: action.payload.username,
            cartItems: [action.payload],
            totalCartPrice: action.payload.totalItemPrice,
          };
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add item to cart';
      })
      .addCase(updateCartItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.cart) {
          const index = state.cart.cartItems.findIndex(
            (item) => item.eventId === action.payload.eventId,
          );
          if (index !== -1) {
            state.cart.cartItems[index].quantity = action.payload.quantity;
            state.cart.cartItems[index].totalItemPrice =
              action.payload.quantity * state.cart.cartItems[index].ticketPrice;
            state.cart.totalCartPrice = state.cart.cartItems.reduce(
              (total, item) => total + item.totalItemPrice,
              0,
            );
          }
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update cart item';
      });
  },
});

export const { setCart, clearCart, clearCartItem } = cartSlice.actions;

export default cartSlice.reducer;

export const selectCart = (state: RootState): Cart | null => state.cart.cart;

export { cartSlice };
