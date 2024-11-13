import { put, call, takeLatest, select } from 'redux-saga/effects';
import { loginStart, loginSuccess, loginFailure, logoutStart, logoutSuccess, logoutFailure } from '../Reducers/InternetIdentityReducer';
import { setActor } from '../Reducers/actorBindReducer';
import { createActor } from '../../../../../declarations/icplaunchpad_backend/index'; // Adjust the import path as necessary
import { HttpAgent, Actor } from '@dfinity/agent';
import { useAuth } from '../../useContext/useClient';

// Selector to get `login` function from context
const selectAuthContext = (state) => state.internetIdentity.authContext;

function* handleLogin() {
  try {
    // Retrieve `authContext` from Redux state
    const authContext = yield select(selectAuthContext);
    console.log('authContext in saga', authContext)

    if (!authContext || typeof authContext.login !== 'function') {
      throw new Error('Auth context is not properly set.');
    }

    const { login } = authContext;
    const { principal, actor, isAuthenticated, identity } = yield call(login);

    console.log('principal in saga', principal)

    if (isAuthenticated && principal && actor) {
      const agent = new HttpAgent({ identity });
      const newActor = yield call(() =>
        Actor.createActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, { agent })
      );

      // Dispatch success actions
      yield put(loginSuccess({ isAuthenticated: true, principal, identity }));
      yield put(setActor(newActor));
    } else {
      throw new Error('Authentication failed. Principal or actor is undefined.');
    }
  } catch (error) {
    console.error('Login error:', error);
    yield put(loginFailure(error.message));
  }
}

// Saga for handling logout
function* handleLogout() {
  try {
    const authContext = yield select(selectAuthContext);

    if (!authContext || typeof authContext.logout !== 'function') {
      throw new Error('Auth context is not properly set.');
    }

    const { logout } = authContext;
    yield call(logout);
    yield put(logoutSuccess());
  } catch (error) {
    yield put(logoutFailure(error.message));
  }
}

// Watcher Saga
export function* internetIdentitySaga() {
  yield takeLatest(loginStart.type, handleLogin);
  yield takeLatest(logoutStart.type, handleLogout);
}