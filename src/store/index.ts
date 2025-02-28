import { configureStore } from '@reduxjs/toolkit';
import offerReducer from './slices/offerSlice';
import contractReducer from './slices/contractSlice';

export const store = configureStore({
  reducer: {
    offers: offerReducer,
    contracts: contractReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;