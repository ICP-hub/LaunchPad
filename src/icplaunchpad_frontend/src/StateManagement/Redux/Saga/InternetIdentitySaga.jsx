// import { call, put, takeLatest } from 'redux-saga/effects';
// import {
//   loginStart,
//   loginSuccess,
//   loginFailure,
//   logoutStart,
//   logoutSuccess,
// } from '../Reducers/InternetIdentityReducer';
// import { useAuth, useIdentity } from '@nfid/identitykit/react';

// function* handleLogin() {
//   try {
//     const { connect, user } = yield call(useAuth);
//     const {  identity } = yield call(useIdentity);
//     yield call(connect);

//     const principal = identity.getPrincipal().toText();

//     yield put(
//       loginSuccess({
//         isAuthenticated: !!user,
//         identity,
//         principal,
//       })
//     );
//   } catch (error) {
//     yield put(loginFailure(error.toString()));
//   }
// }

// function* handleLogout() {
//   try {
//     const { disconnect } = yield call(useAuth);
//     yield call(disconnect);

//     yield put(logoutSuccess());
//   } catch (error) {
//     yield put(loginFailure(error.toString()));
//   }
// }

// export function* internetIdentitySaga() {
//   yield takeLatest(loginStart().type, handleLogin);
//   yield takeLatest(logoutStart().type, handleLogout);
// }





import { call, put, takeLatest } from 'redux-saga/effects';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
} from '../Reducers/InternetIdentityReducer';

// Login Saga
function* handleLoginSaga() {
  try {
    const handleLogin = window.authFunctions?.handleLogin;

    if (typeof handleLogin !== 'function') {
      throw new Error("Auth function 'handleLogin' is not available or not a function.");
    }
      const { isAuthenticated, identity, principal } = yield call(handleLogin);

      if (!isAuthenticated || !identity || !principal) {
          throw new Error("Login process failed: Missing required data.");
      }

      // Dispatch login success
      yield put(
          loginSuccess({
              isAuthenticated,
              identity,
              principal,
          })
      );
  } catch (error) {
      console.error("Error in handleLoginSaga:", error.message || error);
      yield put(loginFailure(error.message || "Login process failed."));
  }
}



// Logout Saga
function* handleLogoutSaga() {
  try {
    const handleLogout = window.authFunctions?.handleLogout;

    if (!handleLogout) {
      throw new Error("Auth function 'handleLogout' is not available.");
    }

    // Trigger logout process
    yield call(handleLogout);

    yield put(logoutSuccess());
  } catch (error) {
    console.error('Error in handleLogoutSaga:', error.message);
    yield put(logoutFailure(error.message || 'Logout process failed.'));
  }
}

// Watcher saga
export function* internetIdentitySaga() {
  yield takeLatest(loginStart().type, handleLoginSaga);
  yield takeLatest(logoutStart().type, handleLogoutSaga);
}
