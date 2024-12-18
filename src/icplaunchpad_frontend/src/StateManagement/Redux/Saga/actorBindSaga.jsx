import { takeLatest, call, put } from 'redux-saga/effects';
import { setActor, handleActorRequest, actorError } from '../Reducers/actorBindReducer';
import { createActor } from '../../../../../declarations/icplaunchpad_backend/index';
import { HttpAgent } from '@dfinity/agent';

// Helper function to initialize HttpAgent and create the actor
function* initializeActor(identity, backendCanisterId) {
  try {
    if (!identity) {
      throw new Error('Identity is not provided. Please log in first.');
    }

    const networkHost =
      process.env.DFX_NETWORK === 'ic'
        ? 'https://icp0.io'
        : 'http://127.0.0.1:4943';

    const agent = new HttpAgent({
      identity,
      host: networkHost,
    });

    if (process.env.DFX_NETWORK !== 'ic') {
      yield call([agent, agent.fetchRootKey]);
    }

    const actor = createActor(backendCanisterId, { agent });
    console.log('Actor successfully created:', actor);

    return actor;
  } catch (error) {
    console.error('Failed to initialize actor:', error.message);
    throw new Error(error.message);
  }
}

// Saga to initialize actor
function* initActorSaga(action) {
  try {
    const { identity } = action.payload || {};
    if (!identity) {
      console.warn('Identity is missing. Ensure the user is logged in.');
      yield put(actorError('Identity is not provided. Please log in first.'));
      return;
    }

    const backendCanisterId =
      process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND

    const actor = yield call(initializeActor, identity, backendCanisterId);

    if (actor) {
      console.log('Actor initialized successfully.');
      yield put(setActor(actor)); // Update Redux state
    } else {
      throw new Error('Actor initialization failed.');
    }
  } catch (error) {
    console.error('Error in initActorSaga:', error.message);
    yield put(actorError(error.message));
  }
}

// Watcher saga
export function* actorSaga() {
  yield takeLatest(handleActorRequest().type, initActorSaga);
}
