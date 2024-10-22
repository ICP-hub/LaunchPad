import { takeLatest, call, put, select } from "redux-saga/effects";
import { Principal } from "@dfinity/principal"; // Import Principal class
import {
  userRegisteredHandlerFailure,
  userRegisteredHandlerRequest,
  userRegisteredHandlerSuccess,
} from "../Reducers/userRegisteredData";

// Selectors
const selectActor = (currState) => currState.actors.actor;
const selectPrincipal = (currState) => currState.internet.principal;

// Helper function to convert Uint8Array to Base64 URL
function uint8ArrayToBase64(uint8Arr) {
  if (!uint8Arr || uint8Arr.length === 0) {
    console.error("Invalid Uint8Array provided:", uint8Arr);
    return "";
  }

  const rawString = new TextDecoder().decode(uint8Arr);
  const canister_id = rawString.split("/")[0];
  const key = rawString.substring(rawString.indexOf("/"));

  let finalString = "";
  if (process.env.DFX_NETWORK === "ic") {
    finalString = "https://" + canister_id + ".icp0.io" + key;
  } else {
    finalString = "http://" + canister_id + ".localhost:4943" + key;
  }

  return finalString;
}

// Saga worker function to fetch user data
function* fetchUserHandler() {
  console.log("Calling fetchUserHandler");
  try {
    const actor = yield select(selectActor);
    const principalString = yield select(selectPrincipal);

    console.log("Actor in saga:", actor);
    console.log("Principal string in saga:", principalString);

    // Convert the string to a Principal type
    const principal = Principal.fromText(principalString);

    console.log("Converted Principal:", principal);

    const userData = yield call([actor, actor.get_user_account], principal);

    console.log("UserData in saga:", userData);

    if (userData?.Ok) {
      const {
        profile_picture = [],
        full_name = "Anonymous",
        email = "Not provided",
      } = userData.Ok;

      // Convert profile_picture from Uint8Array to Base64 URL
      if (profile_picture.length > 0) {
        const updatedProfileData = uint8ArrayToBase64(profile_picture[0]);
        userData.Ok.profile_picture[0] = updatedProfileData;
      }

      // Dispatch success action with updated user data
      yield put(userRegisteredHandlerSuccess(userData));
    } else if (userData?.Err) {
      // Handle backend error
      throw new Error(userData.Err);
    } else {
      throw new Error("Invalid user data format");
    }
        // if (userData?.Ok) {
    //   const {
    //     profile_picture = [],
    //     full_name = "Anonymous",
    //     email = "Not provided",
    //   } = userData.Ok;

    //   if (profile_picture.length > 0) {
    //     const updatedProfileData = uint8ArrayToBase64(profile_picture);
    //     userData.Ok.profile_picture[0] = updatedProfileData;
    //   }

    //   // Proceed with dispatching the success action
    //   yield put(userRegisteredHandlerSuccess(userData));
    // } else if (userData?.Err) {
    //   // Handle backend error
    //   throw new Error(userData.Err);
    // } else {
    //   throw new Error("Invalid user data format");
    // }

  } catch (error) {
    console.error("Error fetching user data:", error);
    yield put(
      userRegisteredHandlerFailure(
        `Failed to fetch user data: ${error.message}`
      )
    );
  }
}

// Saga watcher function to watch for userRegisteredHandlerRequest action
export function* fetchUserSaga() {
  yield takeLatest(userRegisteredHandlerRequest.type, fetchUserHandler);
}
