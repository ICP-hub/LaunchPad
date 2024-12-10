import { takeLatest, call, put } from 'redux-saga/effects';
import {
  setActor,
  handleActorRequest,
  actorError,
} from '../Reducers/actorBindReducer';
import { createActor } from '../../../../../declarations/icplaunchpad_backend/index';
import { useAgent } from '@nfid/identitykit/react';

function* initActorSaga(action) {
  try {
    const { identity } = action.payload || {};

    const backendCanisterId = process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND;

    if (!identity) {
      yield put(actorError('Identity is not provided. Please log in first.'));
      return;
    }
    if (!backendCanisterId) {
      console.error("CANISTER_ID_ICPLAUNCHPAD_BACKEND is undefined");
      return;
  }
    const actor = yield call(
      createActor,
      backendCanisterId,
      {
        agentOptions: { identity, verifyQuerySignatures: false },
      }
    );
    console.log('actor in saga',actor)
    yield put(setActor(actor));
  } catch (error) {
    console.error('Error in initActorSaga:', error);
    yield put(actorError(error.message));
  }
}

export function* actorSaga() {
  yield takeLatest(handleActorRequest().type, initActorSaga);
}