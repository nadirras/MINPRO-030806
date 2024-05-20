import {
  Action,
  ThunkAction,
  combineReducers,
  combineSlices,
  configureStore,
} from '@reduxjs/toolkit';
import { userSlice } from './user/userSlice';
import { eventSlice } from './event/eventSlice';
import { cartSlice } from './cart/cartSlice';
import { orderSlice } from './order/orderSlice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  event: eventSlice.reducer,
  cart: cartSlice.reducer,
  order: orderSlice.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
