import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  initialized: boolean;
  status: "idle" | "loading" | "ready" | "error";
  message: string;
};

const initialState: AppState = {
  initialized: false,
  status: "idle",
  message: "Redux store is ready to be initialized.",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    bootstrapRequested: (state) => {
      state.status = "loading";
    },
    bootstrapSucceeded: (state, action: PayloadAction<string>) => {
      state.initialized = true;
      state.status = "ready";
      state.message = action.payload;
    },
    bootstrapFailed: (state) => {
      state.initialized = false;
      state.status = "error";
      state.message = "Failed to initialize the app.";
    },
  },
});

export const {
  bootstrapRequested,
  bootstrapSucceeded,
  bootstrapFailed,
} = appSlice.actions;

export const appReducer = appSlice.reducer;
