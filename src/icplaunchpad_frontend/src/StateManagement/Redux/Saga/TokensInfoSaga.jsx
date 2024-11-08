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

    console.log("get_tokens_info in saga", TokensData);

    if (TokensData && TokensData.length > 0) {
      const lastTokenData = TokensData[TokensData.length - 1];
      console.log("canisterid in saga", lastTokenData.canister_id);

      // Proceed with dispatching the success action
      yield put(TokensInfoHandlerSuccess(TokensData));
      
    } else {
      yield put(TokensInfoHandlerSuccess([]));
      throw new Error("Invalid or empty Tokens data");
      
    }
  } catch (error) {
    console.error("Error fetching Tokens data:", error);
    yield put(
      TokensInfoHandlerFailure(`Failed to fetch Tokens data: ${error.message}`)
    );
  }
}

export function* fetchTokensInfoSaga() {
  yield takeLatest(TokensInfoHandlerRequest.type, fetchTokensInfo);
}
