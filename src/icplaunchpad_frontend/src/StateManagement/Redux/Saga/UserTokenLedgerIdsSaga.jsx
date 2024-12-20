import { takeLatest, call, put, select } from "redux-saga/effects";
import {
    UserTokenLedgerIdsHandlerRequest,
    UserTokenLedgerIdsHandlerSuccess,
    UserTokenLedgerIdsHandlerFailure,
} from "../Reducers/UserTokenLedgerIds";
import { Principal } from "@dfinity/principal";

const selectActor = (currState) => currState.actors.actor;
const selectPrincipal = (currState) => currState.internet.principal;

function* fetchUserTokenLedgerIds() {
  try {
    const actor = yield select(selectActor);
    const principalString = yield select(selectPrincipal);
    
    if (!actor) {
        throw new Error("Actor not found after retries");
        
      }

    if (!principalString || typeof principalString !== "string") {
      throw new Error("Principal string is invalid or not found");
  
    }
    
    console.log("Principal string is found:", principalString);

     const principal = Principal.fromText(principalString);
    const TokensData = yield call([actor, actor.get_user_ledger_ids],principal);
    console.log("get_user_ledger_ids in saga", TokensData);

    if (TokensData && TokensData?.Ok?.length > 0) {
      yield put(UserTokenLedgerIdsHandlerSuccess(TokensData?.Ok));
    } else {
      throw new Error("Invalid or empty Tokens data");
    }
  } catch (error) {
    console.error("Error fetching user Tokens data:", error);
    yield put(
        UserTokenLedgerIdsHandlerFailure(`Failed to fetch Tokens data: ${error.message}`)
    );
  }
}


export function* fetchUserTokenLedgerIdsSaga() {
  yield takeLatest(UserTokenLedgerIdsHandlerRequest.type, fetchUserTokenLedgerIds);
}
