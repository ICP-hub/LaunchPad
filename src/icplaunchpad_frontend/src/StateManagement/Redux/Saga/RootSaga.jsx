import { all } from 'redux-saga/effects';
// import { walletSagas } from './AuthSaga';
import { internetIdentitySaga } from './InternetIdentitySaga';
import { actorSaga } from './actorBindSaga';

import { fetchUserSaga } from './userSaga';
import { fetchUpcomingSalesSaga } from './UpcomingSalesSaga';
import { fetchTokensInfoSaga } from './TokensInfoSaga';
import { fetchSaleParamsSaga } from './SaleParams';
import { fetchSuccessfulSalesSaga } from './SuccessfulSalesSaga';
import { fetchActiveSalesSaga } from './ActiveSalesSaga';
import { fetchProfileImageIDSaga } from './ProfileImageIDSaga';
import { fetchTokenImageIDSaga } from './TokenImageIDSaga';
import { fetchTokenImageIDsSaga } from './TokenImageIDsSaga';

export default function* rootSaga() {
  yield all([
    // walletSagas(),
    internetIdentitySaga(),
    actorSaga(),
    fetchUserSaga(),
    fetchUpcomingSalesSaga(),
    fetchTokensInfoSaga(),
    fetchSaleParamsSaga(),
    fetchSuccessfulSalesSaga(),
    fetchActiveSalesSaga(),
    fetchProfileImageIDSaga(),
    fetchTokenImageIDSaga(),
    fetchTokenImageIDsSaga()
  ]);
}
