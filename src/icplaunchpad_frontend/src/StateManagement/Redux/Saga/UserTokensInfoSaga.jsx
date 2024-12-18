import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  UserTokensInfoHandlerRequest,
  UserTokensInfoHandlerSuccess,
  UserTokensInfoHandlerFailure,
} from "../Reducers/UserTokensInfo";
import { SetLedgerIdHandler } from "../Reducers/LedgerId";

const selectActorFromState = (currState) => currState.actors.actor;

function* fetchUserTokensInfo() {
  try {
    const actor = yield select(selectActorFromState);
    if (!actor) {
      throw new Error("Actor not found in state");
    }
    
    console.log("Actor found:", actor);
    
    const TokensData = yield call([actor, actor.get_user_tokens_info]);
    console.log("get_user_tokens_info in saga", TokensData);

    if (TokensData && TokensData?.Ok?.length > 0) {
      const lastTokenData = TokensData?.Ok?.[TokensData?.Ok?.length - 1];
      console.log("canisterid in saga", lastTokenData.canister_id);

      yield put(UserTokensInfoHandlerSuccess(TokensData?.Ok));
      yield put(
        SetLedgerIdHandler({
          ledger_canister_id: lastTokenData.canister_id,
          index_canister_id: lastTokenData.index_canister_id,
        })
      );
    } else {
      throw new Error("Invalid or empty Tokens data");
    }
  } catch (error) {
    console.error("Error fetching user Tokens data:", error);
    yield put(
      UserTokensInfoHandlerFailure(`Failed to fetch Tokens data: ${error.message}`)
    );
  }
}


export function* fetchUserTokensInfoSaga() {
  yield takeLatest(UserTokensInfoHandlerRequest.type, fetchUserTokensInfo);
}
