import { all } from 'redux-saga/effects';
// import { walletSagas } from './AuthSaga';
import { internetIdentitySaga } from './InternetIdentitySaga';
import { actorSaga } from './actorBindSaga';

import { fetchUserSaga } from './userSaga';

export default function* rootSaga() {
  yield all([
    // walletSagas(),
    internetIdentitySaga(),
    actorSaga(),
    fetchUserSaga(),
  ]);
}
