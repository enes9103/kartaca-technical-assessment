import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthUser, LoginPayload } from "@/lib/features/auth/authTypes";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  status:
    | "idle"
    | "loading"
    | "authenticated"
    | "error"
    | "checking-session";
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequested: (state, _action: PayloadAction<LoginPayload>) => {
      state.status = "loading";
      state.error = null;
      void _action;
    },
    loginSucceeded: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = "authenticated";
      state.error = null;
    },
    sessionRequested: (state) => {
      state.status = "checking-session";
      state.error = null;
    },
    sessionSucceeded: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = "authenticated";
      state.error = null;
    },
    sessionFailed: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "error";
      state.error = action.payload;
    },
    logoutRequested: (state) => {
      state.status = "idle";
    },
    logoutSucceeded: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  loginRequested,
  loginSucceeded,
  sessionRequested,
  sessionSucceeded,
  sessionFailed,
  loginFailed,
  logoutRequested,
  logoutSucceeded,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
