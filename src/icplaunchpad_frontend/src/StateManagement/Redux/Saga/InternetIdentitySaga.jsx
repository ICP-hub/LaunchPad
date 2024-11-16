import { call, put, takeLatest } from 'redux-saga/effects';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
} from '../Reducers/InternetIdentityReducer';
import { useIdentityKit } from '@nfid/identitykit/react';

function* handleLogin() {
  try {
    const { connect, identity, user } = yield call(useIdentityKit);

    console.log('user', user);
    console.log('identity', identity);

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
    const { disconnect } = yield call(useIdentityKit);
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