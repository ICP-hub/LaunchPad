import { takeLatest, call, put, select } from "redux-saga/effects";
import {
    TokenImageIDsHandlerRequest,
    TokenImageIDsHandlerSuccess,
    TokenImageIDsHandlerFailure,
} from "../Reducers/TokenImageIDs";

const selectActor = (currState) => currState.actors.actor;

function* fetchTokenImageIDs() {
  // console.log("calling fetchTokenImageIDs");
  try {
    const actor = yield select(selectActor);
    let TokenImageIDs = yield call([actor, actor.get_token_image_ids]);

    console.log("get_token_image_ids in saga", TokenImageIDs);
    if (TokenImageIDs) {
      // Proceed with dispatching the success action
      yield put(TokenImageIDsHandlerSuccess(TokenImageIDs));
    }else {
      throw new Error("Invalid TokenImageIDs data format");
    }
  } catch (error) {
    console.error("Error fetching TokenImageIDs data:", error);
    yield put(
        TokenImageIDsHandlerFailure(
        `Failed to fetch TokenImageIDs data: ${error.message}`
      )
    );
  }
}

export function* fetchTokenImageIDsSaga() {
  yield takeLatest(TokenImageIDsHandlerRequest.type, fetchTokenImageIDs);
}
