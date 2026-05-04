import type { PayloadAction } from "@reduxjs/toolkit";
import { delay, put, takeLatest } from "redux-saga/effects";

import {
  loginFailed,
  loginRequested,
  loginSucceeded,
  logoutRequested,
  logoutSucceeded,
  type LoginPayload,
} from "@/lib/features/auth/authSlice";

function* loginFlow(action: PayloadAction<LoginPayload>) {
  try {
    yield delay(250);

    const { username, password } = action.payload;

    //  This is a mock authentication flow. In a real application, you would make an API call here.
    if (username === "demo" && password === "demo123") {
      yield put(
        loginSucceeded({
          token: "mock-token",
          username,
        }),
      );
      return;
    }

    yield put(loginFailed("Username or password is incorrect."));
  } catch {
    yield put(loginFailed("An error occurred while processing the login request."));
  }
}

function* logoutFlow() {
  yield put(logoutSucceeded());
}

export function* authSaga() {
  yield takeLatest(loginRequested.type, loginFlow);
  yield takeLatest(logoutRequested.type, logoutFlow);
}
