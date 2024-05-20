import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
  orderId: string | null;
}

const initialState: OrderState = {
  orderId: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderId(state, action: PayloadAction<string | null>) {
      state.orderId = action.payload;
    },
  },
});

export const { setOrderId } = orderSlice.actions;

export default orderSlice.reducer;

export { orderSlice };
