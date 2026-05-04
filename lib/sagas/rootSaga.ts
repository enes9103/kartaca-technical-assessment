import { all, fork } from "redux-saga/effects";

import { appSaga } from "@/lib/sagas/appSaga";
import { authSaga } from "@/lib/sagas/authSaga";

export function* rootSaga() {
  yield all([fork(appSaga), fork(authSaga)]);
}
