import { takeLatest, call, put, select } from "redux-saga/effects";
import {
TokensInfoHandlerRequest,
  TokensInfoHandlerSuccess,
  TokensInfoHandlerFailure
} from "../Reducers/TokensInfo";

const selectActor = (currState) => currState.actors.actor;

function* fetchTokensInfo() {
  console.log("calling fetchTokensInfo");
  try {
    const actor = yield select(selectActor);
    let TokensData = yield call([actor, actor.get_tokens_info]);

    console.log("get_tokens_info in saga", TokensData);
    if (TokensData) {
      // Proceed with dispatching the success action
      yield put(TokensInfoHandlerSuccess(TokensData));
    }else {
      throw new Error("Invalid Tokens data format");
    }
  } catch (error) {
    console.error("Error fetching Tokens data:", error);
    yield put(
        TokensInfoHandlerFailure(
        `Failed to fetch Tokens data: ${error.message}`
      )
    );
  }
}

export function* fetchTokensInfoSaga() {
  yield takeLatest(TokensInfoHandlerRequest.type, fetchTokensInfo);
}
