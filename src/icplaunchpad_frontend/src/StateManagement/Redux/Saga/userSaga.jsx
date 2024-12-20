import { takeLatest, call, put, select } from "redux-saga/effects";
import { Principal } from "@dfinity/principal";
import {
  userRegisteredHandlerFailure,
  userRegisteredHandlerRequest,
  userRegisteredHandlerSuccess,
} from "../Reducers/userRegisteredData";

const selectPrincipal = (currState) => currState?.internet?.principal;
const selectActor = (currState) => currState.actors.actor;


function* fetchUserHandler(action) {
  try {
      const actor = yield select(selectActor);
    console.log('Actor in user saga:', actor);

    const principalString = yield select(selectPrincipal);
    console.log('Principal from state:', principalString);

    if (!principalString || typeof principalString !== "string" || !principalString.trim()) {
      console.error("Principal string is invalid:", principalString);
      yield put(userRegisteredHandlerFailure("Principal string is invalid."));
      return;
    }

    if (!actor || typeof actor.get_user_account !== "function") {
      console.error("Actor is invalid or missing required method.");
      yield put(userRegisteredHandlerFailure("Actor is invalid or missing required method."));
      return;
    }

    try {
      const principal = Principal.fromText(principalString);
      console.log('Converted Principal:', principal);

      // Log before calling the method
      console.log("Calling actor.get_user_account with:", principal);

      const userData = yield call([actor, actor.get_user_account], principal);
      console.log("User data in saga:", userData);

      if (userData?.Ok) {
        yield put(userRegisteredHandlerSuccess(userData.Ok));
      } else {
        console.error("Error in user data response:", userData?.Err || "Unknown error");
        yield put(userRegisteredHandlerFailure(userData?.Err || "Unknown error from canister."));
      }
    } catch (err) {
      console.error("Error calling canister method:", err);
      yield put(userRegisteredHandlerFailure(err.message));
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    yield put(
      userRegisteredHandlerFailure(
        `Failed to fetch user data: ${error.message}`
      )
    );
  }
}





export function* fetchUserSaga() {
  yield takeLatest(userRegisteredHandlerRequest.type, fetchUserHandler);
}