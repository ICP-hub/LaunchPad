import { takeLatest, call, put, select } from "redux-saga/effects";
import {
    TokenImageIDHandlerRequest,
    TokenImageIDHandlerSuccess,
    TokenImageIDHandlerFailure,
} from "../Reducers/TokenImageID";

const selectActor = (currState) => currState.actors.actor;

function* fetchTokenImageID() {
  console.log("calling fetchTokenImageID");
  try {
    const actor = yield select(selectActor);
    let TokenImageID = yield call([actor, actor.get_token_image_id]);

    console.log("get_token_image_id in saga", TokenImageID);
    if (TokenImageID) {
      // Proceed with dispatching the success action
      yield put(TokenImageIDHandlerSuccess(TokenImageID));
    }else {
      throw new Error("Invalid TokenImageID data format");
    }
  } catch (error) {
    console.error("Error fetching TokenImageID data:", error);
    yield put(
        TokenImageIDHandlerFailure(
        `Failed to fetch TokenImageID data: ${error.message}`
      )
    );
  }
}

export function* fetchTokenImageIDSaga() {
  yield takeLatest(TokenImageIDHandlerRequest.type, fetchTokenImageID);
}
