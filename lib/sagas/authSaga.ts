import type { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";

import {
  loginFailed,
  loginRequested,
  loginSucceeded,
  logoutRequested,
  logoutSucceeded,
  sessionFailed,
  sessionRequested,
  sessionSucceeded,
  type LoginPayload,
} from "@/lib/features/auth/authSlice";
import type { AuthUser } from "@/lib/features/auth/authTypes";

type AuthSuccessResponse = {
  user: AuthUser;
};

type AuthErrorResponse = {
  message?: string;
};

function requestJson<T>(input: RequestInfo, init?: RequestInit) {
  return fetch(input, init).then(async (response) => {
    const data = (await response.json()) as T & AuthErrorResponse;

    if (!response.ok) {
      throw new Error(data.message ?? "Request failed.");
    }

    return data;
  });
}

function* loginFlow(action: PayloadAction<LoginPayload>) {
  try {
    const data: AuthSuccessResponse = yield call(requestJson, "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(action.payload),
    });

    yield put(loginSucceeded(data.user));
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An error occurred while processing the login request.";
    yield put(loginFailed(message));
  }
}

function* logoutFlow() {
  yield call(requestJson, "/api/auth/logout", {
    method: "POST",
  });
  yield put(logoutSucceeded());
}

function* sessionFlow() {
  try {
    const data: AuthSuccessResponse = yield call(requestJson, "/api/auth/me", {
      method: "GET",
      cache: "no-store",
    });

    yield put(sessionSucceeded(data.user));
  } catch {
    yield put(sessionFailed());
  }
}

export function* authSaga() {
  yield takeLatest(loginRequested.type, loginFlow);
  yield takeLatest(sessionRequested.type, sessionFlow);
  yield takeLatest(logoutRequested.type, logoutFlow);
}
