import { configureStore } from "@reduxjs/toolkit";
import elevatorReducer from "./elevatorSlice";

export const store = configureStore({
  reducer: {
    elevator: elevatorReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;