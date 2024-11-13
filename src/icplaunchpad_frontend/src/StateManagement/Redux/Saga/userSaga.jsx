import { takeLatest, call, put, select } from "redux-saga/effects";
import { Principal } from "@dfinity/principal";
import {
  userRegisteredHandlerFailure,
  userRegisteredHandlerRequest,
  userRegisteredHandlerSuccess,
} from "../Reducers/userRegisteredData";

const selectActor = (currState) => currState.actors.actor;
const selectPrincipal = (currState) => currState.internet.principal;

function* fetchUserHandler() {
  console.log("Calling fetchUserHandler");

  try {
    const actor = yield select(selectActor);
    const principalString = yield select(selectPrincipal);

    console.log("Actor in user saga:", actor);
    console.log("Methods on actor:", actor ? Object.keys(actor) : "Actor is undefined");
    console.log("Principal string in user saga:", principalString);

    if (actor && typeof actor.get_user_account === "function" && principalString) {
      console.log("Actor and principal string are available, proceeding...");

      // Convert the principal string to a Principal if required
      const principal = Principal.fromText(principalString);

      // Call the actor's method to get the user data
      const userData = yield call([actor, actor.get_user_account], principal);
      console.log("UserData in saga:", userData);

      // Dispatch success action with the user data
      yield put(userRegisteredHandlerSuccess(userData));
    } else {
      let errorMessage = "Failed to fetch user data due to missing dependencies.";
      if (!actor) errorMessage += " Actor is undefined or invalid. ";
      if (!principalString) errorMessage += " Principal string is undefined or invalid.";
      if (actor && typeof actor.get_user_account !== "function") errorMessage += " Actor method get_user_account is not available.";

      console.error("Error fetching user data:", errorMessage);
      yield put(userRegisteredHandlerFailure(errorMessage));
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
