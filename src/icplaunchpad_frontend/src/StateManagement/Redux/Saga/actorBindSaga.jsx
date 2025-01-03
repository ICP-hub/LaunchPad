// import { takeLatest, call, put } from 'redux-saga/effects';
// import { setActor, handleActorRequest, actorError } from '../Reducers/actorBindReducer';
// import { createActor } from '../../../../../declarations/icplaunchpad_backend/index';
// import { HttpAgent } from '@dfinity/agent';
// // Helper function to initialize HttpAgent and create the actor
// function* initializeActor(identity, backendCanisterId) {
//   try {
//     if (!identity) {
//       throw new Error('Identity is not provided. Please log in first.');
//     }

//     const networkHost =
//       process.env.DFX_NETWORK === 'ic'
//         ? 'https://icp0.io'
//         : 'http://127.0.0.1:4943';

//     const agent = new HttpAgent({
//       identity,
//       host: networkHost,
//     });

//     if (process.env.DFX_NETWORK !== 'ic') {
//       yield call([agent, agent.fetchRootKey]);
//     }
// if(agent){
//     const actor = createActor(backendCanisterId, { agent });
  
//     console.log('Actor successfully created:', actor);

//     return actor;
// }
//   } catch (error) {
//     console.error('Failed to initialize actor:', error.message);
//     throw new Error(error.message);
//   }
// }

// // Saga to initialize actor
// function* initActorSaga(action) {
//   try {
//     const { identity } = action.payload || {};
//     if (!identity) {
//       console.warn('Identity is missing. Ensure the user is logged in.');
//       yield put(actorError('Identity is not provided. Please log in first.'));
//       return;
//     }

//     const backendCanisterId =
//       process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND

//     const actor = yield call(initializeActor, identity, backendCanisterId);

//     if (actor) {
//       console.log('Actor initialized successfully.');
//       yield put(setActor(actor)); // Update Redux state
//     } else {
//       throw new Error('Actor initialization failed.');
//     }
//   } catch (error) {
//     console.error('Error in initActorSaga:', error.message);
//     yield put(actorError(error.message));
//   }
// }

// // Watcher saga
// export function* actorSaga() {
//   yield takeLatest(handleActorRequest().type, initActorSaga);
// }




import { takeLatest, call, put } from 'redux-saga/effects';
import { setActor, handleActorRequest  } from '../Reducers/actorBindReducer';
import { loginSuccess, logoutSuccess, logoutFailure } from '../Reducers/InternetIdentityReducer';
import { createActor } from '../../../../../declarations/icplaunchpad_backend/index';
import { HttpAgent } from '@dfinity/agent';

// Helper function to initialize HttpAgent and create the actor
// function* initializeActor(identity, backendCanisterId) {
//   try {
//     if (!identity) {
//       throw new Error('Identity is not provided. Please log in first.');
//     }

//     const networkHost =
//       process.env.DFX_NETWORK === 'ic'
//         ? 'https://icp0.io'
//         : 'http://127.0.0.1:4943';

//     const agent = new HttpAgent({
//       identity,
//       host: networkHost,
//     });

//     // Fetch the root key if on a local network
//     if (process.env.DFX_NETWORK !== 'ic') {
//       yield call([agent, agent.fetchRootKey]);
//     }

//     const actor = createActor(backendCanisterId, { agent });
//     console.log('Actor successfully created:', actor);

//     return actor;
//   } catch (error) {
//     console.error('Failed to initialize actor:', error.message);
//     throw new Error(error.message);
//   }
// }

// Saga to handle login
function* handleLoginSaga(action) {
  try {
    const { identity, principal } = action.payload;

    if (!identity || !principal) {
      throw new Error('Identity or principal information is missing.');
    }

    const backendCanisterId = process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND;

    // Initialize the backend actor
    const backendActor = yield call(initializeActor, identity, backendCanisterId);

    if (backendActor) {
      yield put(setActor(backendActor));
      yield put(
        loginSuccess({
          isAuthenticated: true,
          identity,
          principal,
        })
      );
      console.log('Login successful.');
    } else {
      throw new Error('Actor initialization failed during login.');
    }
  } catch (error) {
    console.error('Error in handleLoginSaga:', error.message);
    yield put(logoutFailure(error.message));
  }
}

// Saga to handle logout
function* handleLogoutSaga() {
  try {
    yield put(setActor(null)); // Clear actor
    yield put(
      logoutSuccess()
    ); // Update Redux state
    console.log('Logout successful.');
  } catch (error) {
    console.error('Error in handleLogoutSaga:', error.message);
    yield put(logoutFailure(error.message));
  }
}

// Watcher saga
export function* actorSaga() {
  yield takeLatest('auth/loginRequest', handleLoginSaga); // Triggered when loginRequest is dispatched
  yield takeLatest('auth/logoutRequest', handleLogoutSaga); // Triggered when logoutRequest is dispatched
  // yield takeLatest(handleActorRequest().type, initActorSaga); // Initialize actor if requested
}
