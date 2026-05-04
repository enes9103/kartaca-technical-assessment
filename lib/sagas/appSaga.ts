import { delay, put, takeLatest } from "redux-saga/effects";

import {
  bootstrapFailed,
  bootstrapRequested,
  bootstrapSucceeded,
} from "@/lib/features/app/appSlice";

function* bootstrapApp() {
  try {
    yield delay(150);
    yield put(
      bootstrapSucceeded("Redux Toolkit and Redux-Saga are successfully initialized."),
    );
  } catch {
    yield put(bootstrapFailed());
  }
}

export function* appSaga() {
  yield takeLatest(bootstrapRequested.type, bootstrapApp);
}
