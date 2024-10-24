import { put, call, takeLatest } from 'redux-saga/effects';
import { AuthClient } from '@dfinity/auth-client';
import { NFID } from '@nfid/embed';
import { PlugMobileProvider } from '@funded-labs/plug-mobile-sdk';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  checkLoginOnStart,
} from '../Reducers/InternetIdentityReducer';
// import { setActor } from '../Redux/Reducers/actorBindReducer';
import { HttpAgent } from '@dfinity/agent';
import { createActor } from '../../../../../declarations/icplaunchpad_backend/index'

// Saga for handling login
function* handleLogin({ payload: walletType }) {
  try {
    let clientOrAgent, isAuthenticated = false, identity = null, principal = null;

    // Add logging for debugging
    console.log(`Attempting login with wallet type: ${walletType}`);

    if (walletType === 'authClient') {
      const authClient = yield call(AuthClient.create);
      yield call([authClient, 'login'], {
        identityProvider: process.env.DFX_NETWORK === 'ic'
          ? 'https://identity.ic0.app'
          : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943',
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      });

      isAuthenticated = yield call([authClient, 'isAuthenticated']);
      console.log('AuthClient isAuthenticated:', isAuthenticated); // Log for debugging

      if (isAuthenticated) {
        identity = authClient.getIdentity();
        principal = identity.getPrincipal().toText();
        clientOrAgent = authClient;

        console.log('AuthClient Identity:', identity);  // Add logging here
        console.log('AuthClient Principal:', principal);  // Add logging here
      }
    } else if (walletType === 'NFID') {
      const nfid = yield call(NFID.init, {
        application: 'test',
        logo: 'https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg',
      });
      const delegationIdentity = yield call([nfid, 'getDelegation'], {
        targets: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
        maxTimeToLive: BigInt(8) * BigInt(3_600_000_000_000),
      });
      const agent = new HttpAgent({ identity: delegationIdentity });
      if (process.env.NODE_ENV !== 'production') {
        yield call([agent, 'fetchRootKey']);
      }
      identity = yield call([nfid, 'getIdentity']);
      principal = identity.getPrincipal().toText();
      clientOrAgent = agent;
      isAuthenticated = true;

      console.log('NFID Identity:', identity);  // Add logging here
      console.log('NFID Principal:', principal);  // Add logging here
    } else if (walletType === 'Plug') {
      const isMobile = PlugMobileProvider.isMobileBrowser();

      if (isMobile) {
        // Mobile Plug Wallet Flow
        const provider = new PlugMobileProvider({
          debug: true,
          walletConnectProjectId: '77116a21991734ff2e6e715967655746',
          window: window,
        });

        yield call([provider, 'initialize']);
        
        // Pair the wallet if not already paired
        if (!provider.isPaired()) {
          yield call([provider, 'pair']);
        }

        const agent = yield call([provider, 'createAgent'], {
          host: 'https://icp0.io',
          targets: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
        });

        if (agent) {
          identity = yield call([agent, 'getPrincipal']);
          principal = identity.toText();
          clientOrAgent = agent;
          isAuthenticated = true;

          console.log('Plug Mobile Identity:', identity);  // Add logging here
          console.log('Plug Mobile Principal:', principal);  // Add logging here
        }
      } else {
        // Desktop Plug Wallet Flow
        const connected = yield call([window.ic.plug, 'isConnected']);
        console.log('Plug Desktop connected:', connected); // Log connection status

        if (connected) {
          const agent = yield call([window.ic.plug, 'createAgent']);
          identity = yield call([window.ic.plug.agent, 'getPrincipal']);
          principal = yield call([window.ic.plug.accountId]);
          clientOrAgent = agent;
          isAuthenticated = true;

          console.log('Plug Desktop Identity:', identity);  // Add logging here
          console.log('Plug Desktop Principal:', principal);  // Add logging here
        }
      }
    }

    if (isAuthenticated && identity) {
      const agent = new HttpAgent({ identity, verifyQuerySignatures: process.env.DFX_NETWORK === 'ic' });
      const actor = createActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, { agent });
      yield put(loginSuccess({ isAuthenticated, principal, identity }));
    } else {
      console.error('Login failed: Identity is undefined or not authenticated.');
      yield put(loginFailure('Identity is undefined or not authenticated.'));
    }
  } catch (error) {
    console.error('Login error:', error);  // Add logging for errors
    yield put(loginFailure(error.message));
  }
}

// Saga for handling logout
function* handleLogout() {
  try {
    const authClient = yield call(AuthClient.create);
    yield call([authClient, 'logout']);
    yield put(logoutSuccess());
  } catch (error) {
    yield put(logoutFailure(error.message));
  }
}

// Saga for checking login on startup
function* checkLogin() {
  try {
    const previousWalletType = localStorage.getItem('walletType');
    console.log('Previous wallet type:', previousWalletType); // Log for debugging

    let isAuthenticated = false;

    if (previousWalletType === 'authClient') {
      const authClient = yield call(AuthClient.create);
      isAuthenticated = yield call([authClient, 'isAuthenticated']);
      console.log('AuthClient isAuthenticated:', isAuthenticated); // Log for debugging

      if (isAuthenticated) {
        yield call(handleLogin, { payload: 'authClient' });
      }
    } else if (previousWalletType === 'NFID') {
      const nfid = yield call(NFID.init, {
        application: 'test',
        logo: 'https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg',
      });
      const identity = yield call([nfid, 'getIdentity']);
      if (identity && identity.getPrincipal()) {
        yield call(handleLogin, { payload: 'NFID' });
        isAuthenticated = true;
      }
    } else if (previousWalletType === 'Plug') {
      const isMobile = PlugMobileProvider.isMobileBrowser();
      console.log('Plug isMobile:', isMobile); // Log for debugging

      if (isMobile) {
        const provider = new PlugMobileProvider({
          debug: true,
          walletConnectProjectId: '77116a21991734ff2e6e715967655746',
          window: window,
        });
        yield call([provider, 'initialize']);
        if (provider.isPaired()) {
          const agent = yield call([provider, 'createAgent'], {
            host: 'https://icp0.io',
            targets: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
          });
          if (agent) {
            yield call(handleLogin, { payload: 'Plug' });
            isAuthenticated = true;
          }
        }
      } else {
        const connected = yield call([window.ic.plug, 'isConnected']);
        console.log('Plug Desktop connected:', connected); // Log for debugging

        if (connected) {
          yield call(handleLogin, { payload: 'Plug' });
          isAuthenticated = true;
        }
      }
    }

    if (!isAuthenticated) {
      console.log('No wallet is authenticated.');
    }
  } catch (error) {
    console.error('Check login error:', error); // Add error logging
    yield put(loginFailure(error.message));
  }
}

// Watcher Saga
export function* internetIdentitySaga() {
  yield takeLatest(loginStart().type, handleLogin);
  yield takeLatest(logoutStart().type, handleLogout);
  yield takeLatest(checkLoginOnStart().type, checkLogin);
}
