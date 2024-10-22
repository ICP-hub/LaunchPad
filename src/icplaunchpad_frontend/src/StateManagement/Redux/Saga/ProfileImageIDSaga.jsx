import { takeLatest, call, put, select } from "redux-saga/effects";
import {
    ProfileImageIDHandlerRequest,
    ProfileImageIDHandlerSuccess,
    ProfileImageIDHandlerFailure,
} from "../Reducers/ProfileImageID";

const selectActor = (currState) => currState.actors.actor;

function* fetchProfileImageID() {
  console.log("calling fetchProfileImageID");
  try {
    const actor = yield select(selectActor);
    let ProfileImageID = yield call([actor, actor.get_profile_image_id]);

    console.log("get_profile_image_id in saga", ProfileImageID);
    if (ProfileImageID) {
      // Proceed with dispatching the success action
      yield put(ProfileImageIDHandlerSuccess(ProfileImageID));
    }else {
      throw new Error("Invalid ProfileImageID data format");
    }
  } catch (error) {
    console.error("Error fetching ProfileImageID data:", error);
    yield put(
        ProfileImageIDHandlerFailure(
        `Failed to fetch ProfileImageID data: ${error.message}`
      )
    );
  }
}

export function* fetchProfileImageIDSaga() {
  yield takeLatest(ProfileImageIDHandlerRequest.type, fetchProfileImageID);
}
