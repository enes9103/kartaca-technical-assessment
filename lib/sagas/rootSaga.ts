import { all, fork } from "redux-saga/effects";

import { appSaga } from "@/lib/sagas/appSaga";

export function* rootSaga() {
  yield all([fork(appSaga)]);
}
