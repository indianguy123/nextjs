import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './inventorySlice';

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
  },
});

// Types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
