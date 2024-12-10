import { call, put, takeLatest } from 'redux-saga/effects';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
} from '../Reducers/InternetIdentityReducer';
import { useAuth, useIdentity } from '@nfid/identitykit/react';

function* handleLogin() {
  try {
    const { connect, user } = yield call(useAuth);
    const {  identity } = yield call(useIdentity);
    yield call(connect);

    const principal = identity.getPrincipal().toText();

    yield put(
      loginSuccess({
        isAuthenticated: !!user,
        identity,
        principal,
      })
    );
  } catch (error) {
    yield put(loginFailure(error.toString()));
  }
}

function* handleLogout() {
  try {
    const { disconnect } = yield call(useAuth);
    yield call(disconnect);

    yield put(logoutSuccess());
  } catch (error) {
    yield put(loginFailure(error.toString()));
  }
}

export function* internetIdentitySaga() {
  yield takeLatest(loginStart().type, handleLogin);
  yield takeLatest(logoutStart().type, handleLogout);
}