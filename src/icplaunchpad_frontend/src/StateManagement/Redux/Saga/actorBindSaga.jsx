import { takeLatest, call, put } from 'redux-saga/effects';
import {
  setActor,
  handleActorRequest,
  actorError,
} from '../Reducers/actorBindReducer';
import { createActor } from '../../../../../declarations/icplaunchpad_backend/index';

function* initActorSaga(action) {
  try {
    const { identity } = action.payload || {};
    if (!identity) {
      yield put(actorError('Identity is not provided. Please log in first.'));
      return;
    }
    const actor = yield call(
      createActor,
      process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND,
      {
        agentOptions: { identity, verifyQuerySignatures: false },
      }
    );
    yield put(setActor(actor));
  } catch (error) {
    console.error('Error in initActorSaga:', error);
    yield put(actorError(error.message));
  }
}

export function* actorSaga() {
  yield takeLatest(handleActorRequest().type, initActorSaga);
}