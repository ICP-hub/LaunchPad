import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  UserTokensInfoHandlerRequest,
  UserTokensInfoHandlerSuccess,
  UserTokensInfoHandlerFailure,
} from "../Reducers/UserTokensInfo";
import { SetLedgerIdHandler } from "../Reducers/LedgerId";

const selectActorFromState = (currState) => currState.actors.actor;

function* fetchUserTokensInfo() {
  console.log("calling fetchUserTokensInfo");
  try {
    const actor = yield select(selectActorFromState);
    console.log(actor)
    const TokensData = yield call([actor, actor.get_user_tokens_info]);

    console.log("get_user_tokens_info in saga", TokensData);

    if (TokensData && TokensData.length > 0) {
      const lastTokenData = TokensData[TokensData.length - 1];
      console.log("canisterid in saga", lastTokenData.canister_id);

      // Proceed with dispatching the success action
      yield put(UserTokensInfoHandlerSuccess(TokensData));
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
