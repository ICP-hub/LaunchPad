import { takeLatest, call, put, select } from 'redux-saga/effects';
import {
  setActor,
  handleActorRequest,
  actorError,
} from '../Reducers/actorBindReducer';
import { createActor } from "../../../../../declarations/icplaunchpad_backend/index";
const selectedIdentity = (state) => state.internet.identity;

function* initActorSaga() {
  try {
    const identity = yield select(selectedIdentity);
    console.log('Identity in initActorSaga:', identity);

    const canisterId =
      process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND ||
      process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND;

    const actor = yield call(createActor, canisterId, {
      agentOptions: { identity, verifyQuerySignatures: false },
    });
  
    console.log('Actor initialized in initActorSaga:', actor);

    yield put(setActor(actor));
  } catch (error) {
    console.error('Error in initActorSaga:', error);
    yield put(actorError(error.toString()));
  }
}

export function* actorSaga() {
  yield takeLatest(handleActorRequest().type, initActorSaga);
}





// import { takeLatest, call, put, select } from 'redux-saga/effects';
// import {
//   setActor,
//   handleActorRequest,
//   actorError,
// } from '../Reducers/actorBindReducer';
// import { createActor } from "../../../../../declarations/icplaunchpad_backend/index";

// const selectedIdentity = (state) => state.internet.identity;

// function* initActorSaga() {
//   try {
//     const identity = yield select(selectedIdentity);

//     if (!identity || identity === 'AnonymousIdentity') {
//       throw new Error('Invalid identity. User must be authenticated.');
//     }

//     const canisterId = process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND;

//     console.log('Using canister ID:', canisterId);

//     const actor = yield call(createActor, canisterId, {
//       agentOptions: { identity, verifyQuerySignatures: false },
//     });

//     yield put(setActor(actor));
//   } catch (error) {
//     console.error('Error in initActorSaga:', error);
//     yield put(actorError(error.toString()));
//   }
// }

// export function* actorSaga() {
//   yield takeLatest(handleActorRequest().type, initActorSaga);
// }
