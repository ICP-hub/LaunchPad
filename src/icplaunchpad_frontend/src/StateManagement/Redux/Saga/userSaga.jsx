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

    console.log("Actor:", actor);
    console.log("Principal String:", principalString);

    if (actor && principalString) {
      const principal = Principal.fromText(principalString);
      console.log("Converted Principal:", principal);

      const userData = yield call([actor, 'get_user_account'], principal);
      console.log("UserData in saga:", userData);

      if (userData) {
        yield put(userRegisteredHandlerSuccess(userData));
      } else {
        console.error("User data is undefined from actor method.");
        yield put(userRegisteredHandlerFailure("User data is undefined."));
      }
    } else {
      console.error("Actor or principal is undefined.");
      yield put(userRegisteredHandlerFailure("Actor or principal is undefined."));
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    yield put(userRegisteredHandlerFailure(`Failed to fetch user data: ${error.message}`));
  }
}



export function* fetchUserSaga() {
  yield takeLatest(userRegisteredHandlerRequest.type, fetchUserHandler);
}