// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import offerReducer from './slices/offerSlice';
import contractReducer from './slices/contractSlice';
import clientReducer from './slices/clientSlice';

export const store = configureStore({
  reducer: {
    offers: offerReducer,
    contracts: contractReducer,
    clients: clientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;