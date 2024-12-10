import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  TokensInfoHandlerRequest,
  TokensInfoHandlerSuccess,
  TokensInfoHandlerFailure,
} from "../Reducers/TokensInfo";

const selectActorFromState = (currState) => currState.actors.actor;

function* fetchTokensInfo() {
  try {
    const actor = yield select(selectActorFromState);
    if (!actor) {
      throw new Error("Actor not found in state");
    }

    const TokensData = yield call([actor, actor.get_tokens_info]);

    console.log("Fetched TokensData:", TokensData);

    if (Array.isArray(TokensData) && TokensData.length > 0) {
      const lastTokenData = TokensData[TokensData.length - 1];
      console.log("canisterid in saga", lastTokenData.canister_id);
    
      yield put(TokensInfoHandlerSuccess(TokensData));
    } else {
      console.warn("Empty or invalid TokensData received");
      yield put(TokensInfoHandlerSuccess([])); // Handle empty data as a valid state
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
