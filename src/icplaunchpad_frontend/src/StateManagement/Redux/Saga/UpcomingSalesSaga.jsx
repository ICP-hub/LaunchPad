import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  upcomingSalesHandlerRequest,
  upcomingSalesHandlerSuccess,
  upcomingSalesHandlerFailure,
} from "../Reducers/UpcomingSales";

const selectActor = (currState) => currState.actors.actor;

function* fetchUpcomingSales() {
  try {
    // Select the actor directly
    const actor = yield select(selectActor);

    if (actor) {
    // Fetch upcoming sales data
    const salesData = yield call([actor, actor.get_upcoming_sales]);
    if (salesData?.Ok) {
      yield put(upcomingSalesHandlerSuccess(salesData.Ok));
    } else {
      throw new Error("Invalid upcoming sales data format");
    }
    }else {
      throw new Error("Actor is not initialized");
    }
  } catch (error) {
    console.error("Error fetching upcoming sales data:", error);
    yield put(
      upcomingSalesHandlerFailure(
        `Failed to fetch upcoming sales data: ${error.message}`
      )
    );
  }
}

export function* fetchUpcomingSalesSaga() {
  yield takeLatest(upcomingSalesHandlerRequest.type, fetchUpcomingSales);
}
