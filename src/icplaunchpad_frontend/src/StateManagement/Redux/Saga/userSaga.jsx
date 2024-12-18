import { takeLatest, call, put, select } from "redux-saga/effects";
import { Principal } from "@dfinity/principal";
import {
  userRegisteredHandlerFailure,
  userRegisteredHandlerRequest,
  userRegisteredHandlerSuccess,
} from "../Reducers/userRegisteredData";

const selectActor = (currState) => currState?.actors?.actor;
const selectPrincipal = (currState) => currState?.internet?.principal;

function* fetchUserHandler() {
  try {
    const actor = yield select(selectActor);
    console.log('Actor in user saga:', actor);

    const principalString = yield select(selectPrincipal);
    console.log('Principal from state:', principalString);

    // Guard clause: exit early if principalString is undefined or actor is null
    if (!principalString) {
      console.error("Principal string is not defined in the state.");
      yield put(userRegisteredHandlerFailure("Principal string is undefined or null."));
      return;
    }

    if (!actor) {
      console.error("Actor is undefined.");
      yield put(userRegisteredHandlerFailure("Actor is undefined."));
      return;
    }

    try {
      const principal = Principal.fromText(principalString);
      console.log('Converted Principal:', principal);

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