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
  try {
    const actor = yield select(selectActor);
    console.log('actor', actor);
    const principalString = yield select(selectPrincipal);

    if (actor && principalString) {
      // Check if the principalString is valid before converting it to Principal
      if (principalString) {
        const principal = Principal.fromText(principalString);
        // Call the actor's method to get the user data
        const userData = yield call([actor, actor.get_user_account], principal);
        console.log("UserData in saga:", userData);
        // Dispatch success action with the user data
        yield put(userRegisteredHandlerSuccess(userData));
      } else {
        throw new Error("Principal string is invalid or undefined.");
      }
    } else {
      let errorMessage = "";
      if (!actor) {
        errorMessage += "Actor is undefined or invalid. ";
      }
      if (!principalString) {
        errorMessage += "Principal string is undefined or invalid.";
      }
      console.error("Error fetching user data:", errorMessage);
      yield put(userRegisteredHandlerFailure(`Failed to fetch user data: ${errorMessage}`));
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