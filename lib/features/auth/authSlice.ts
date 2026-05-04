import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LoginPayload = {
  username: string;
  password: string;
};

type AuthState = {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "authenticated" | "error";
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  username: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequested: (state, action: PayloadAction<LoginPayload>) => {
      state.status = "loading";
      state.error = null;
      void action;
    },
    loginSucceeded: (
      state,
      action: PayloadAction<{ token: string; username: string }>,
    ) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.isAuthenticated = true;
      state.status = "authenticated";
      state.error = null;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.token = null;
      state.username = null;
      state.isAuthenticated = false;
      state.status = "error";
      state.error = action.payload;
    },
    logoutRequested: (state) => {
      state.status = "idle";
    },
    logoutSucceeded: (state) => {
      state.token = null;
      state.username = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  loginRequested,
  loginSucceeded,
  loginFailed,
  logoutRequested,
  logoutSucceeded,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
