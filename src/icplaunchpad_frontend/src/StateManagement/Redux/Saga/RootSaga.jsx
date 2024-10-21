import { all } from 'redux-saga/effects';
// import { walletSagas } from './AuthSaga';
import { internetIdentitySaga } from './InternetIdentitySaga';
import { actorSaga } from './actorBindSaga';

import { fetchUserSaga } from './userSaga';
import { fetchUpcomingSalesSaga } from './UpcomingSalesSaga';
import { fetchTokensInfoSaga } from './TokensInfoSaga';

export default function* rootSaga() {
  yield all([
    // walletSagas(),
    internetIdentitySaga(),
    actorSaga(),
    fetchUserSaga(),
    fetchUpcomingSalesSaga,
    fetchTokensInfoSaga
  ]);
}
