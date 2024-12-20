import { takeLatest, call, put, select ,delay} from "redux-saga/effects";
import {
  TokensInfoHandlerRequest,
  TokensInfoHandlerSuccess,
  TokensInfoHandlerFailure,
} from "../Reducers/TokensInfo";

// Selector to access actor from state
const selectActorFromState = (currState) => {
  console.log("Current state:", currState); // Inspecting the state structure
  return currState?.actors?.actor; // Adjusted based on your state structure
};
function* fetchTokensInfo() {
  try {
    let actor;
    let retries = 0;
    while (!actor && retries < 5) {
      actor = yield select(selectActorFromState);
      if (!actor) {
        console.log("Actor not found, retrying...");
        retries += 1;
        yield delay(500); // Wait 500ms before retrying
      }
    }

    if (!actor) {
      throw new Error("Actor not found after retries");
    }

    const TokensData = yield call([actor, actor.get_tokens_info]);

    console.log("Fetched TokensData:", TokensData);

    if (Array.isArray(TokensData?.Ok) && TokensData?.Ok?.length > 0) {
      const lastTokenData = TokensData?.Ok[TokensData?.Ok?.length - 1];
      console.log("Canister ID in saga:", lastTokenData.canister_id);
      yield put(TokensInfoHandlerSuccess(TokensData?.Ok));
    } else {
      console.warn("Empty or invalid TokensData received");
      yield put(TokensInfoHandlerSuccess([])); // Handle empty data as a valid state
    }
  } catch (error) {
    console.error("Error in fetchTokensInfo saga:", error.message);
    yield put(TokensInfoHandlerFailure(`Failed to fetch Tokens data: ${error.message}`));
  }
}


// Watcher saga to trigger fetchTokensInfo on TokensInfoHandlerRequest
export function* fetchTokensInfoSaga() {
  yield takeLatest(TokensInfoHandlerRequest.type, fetchTokensInfo);
}
