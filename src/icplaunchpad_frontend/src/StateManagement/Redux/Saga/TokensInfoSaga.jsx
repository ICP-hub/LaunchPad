import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  TokensInfoHandlerRequest,
  TokensInfoHandlerSuccess,
  TokensInfoHandlerFailure,
} from "../Reducers/TokensInfo";


const selectActorFromState = (currState) => currState.actors.actor;

function* fetchTokensInfo() {
  console.log("calling fetchTokensInfo");
  try {
    const actor = yield select(selectActorFromState);
    const TokensData = yield call([actor, actor.get_tokens_info]);

    if (TokensData && TokensData.length > 0) {
      const lastTokenData = TokensData[TokensData.length - 1];
      console.log("canisterid in saga", lastTokenData.canister_id);

      yield put(TokensInfoHandlerSuccess(TokensData));
    } else {
      console.warn("Empty TokensData received");
      yield put(TokensInfoHandlerSuccess([]));
    }
  } catch (error) {
    console.error("Error in fetchTokensInfo saga:", error);
    yield put(
      TokensInfoHandlerFailure(`Failed to fetch Tokens data: ${error.message}`)
    );
  }
 
}

export function* fetchTokensInfoSaga() {
  yield takeLatest(TokensInfoHandlerRequest.type, fetchTokensInfo);
}
