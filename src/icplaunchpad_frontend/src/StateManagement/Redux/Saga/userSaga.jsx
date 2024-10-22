import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  userRegisteredHandlerFailure,
  userRegisteredHandlerRequest,
  userRegisteredHandlerSuccess,
} from "../Reducers/userRegisteredData";

const selectActor = (currState) => currState.actors.actor;


function uint8ArrayToBase64(uint8Arr) {
  if (!uint8Arr || uint8Arr.length === 0 || !uint8Arr[0]) {
    console.error("Invalid Uint8Array provided:", uint8Arr);
    return "";
  }

  var rawString = new TextDecoder().decode(uint8Arr[0]);
  var canister_id = rawString.split("/")[0];
  var key = rawString.substring(rawString.indexOf("/"));

  var finalString = "";
  if (process.env.DFX_NETWORK === "ic") {
    finalString = "https://" + canister_id + ".icp0.io" + key;
  } else {
    finalString = "http://" + canister_id + ".localhost:4943" + key;
  }

  return finalString;
}

function* fetchUserHandler() {
  console.log("calling fetchUserHandler");
  try {
    const actor = yield select(selectActor);
    console.log('actor in saga',actor)
    let userData = yield call([actor, actor.get_user_account],);

    console.log("userData in saga", userData);
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

export function* fetchUserSaga() {
  yield takeLatest(userRegisteredHandlerRequest.type, fetchUserHandler);
}
