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
} from '../Reducers/InternetIdentityReducer';

// Generator function to handle login
function* login() {
  try {
    // Access `handleLogin` from `authFunctions`
    const handleLogin = window.authFunctions?.handleLogin;

    if (!handleLogin) {
      throw new Error("handleLogin function is not available. Ensure AuthProvider is set up correctly.");
    }

    // Call the `handleLogin` function
    yield call(handleLogin);

    // Dispatch the login success action
    yield put(loginSuccess());
  } catch (error) {
    // Dispatch the login failure action with error message
    yield put(loginFailure(error.message || 'An error occurred during login.'));
  }
}

// Generator function to handle logout
function* logout() {
  try {
    // Access `handleLogout` from `authFunctions`
    const handleLogout = window.authFunctions?.handleLogout;

    if (!handleLogout) {
      throw new Error("handleLogout function is not available. Ensure AuthProvider is set up correctly.");
    }

    // Call the `handleLogout` function
    yield call(handleLogout);

    // Dispatch the logout success action
    yield put(logoutSuccess());
  } catch (error) {
    // Dispatch the logout failure action with error message
    yield put(loginFailure(error.message || 'An error occurred during logout.'));
  }
}

// Watcher saga to listen for login and logout actions
export function* internetIdentitySaga() {
  yield takeLatest(loginStart().type, login);
  yield takeLatest(logoutStart().type, logout);
}
