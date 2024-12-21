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
    
    if (!actor) {
      console.log("Actor is not available, waiting for it...");
      return; // Don't proceed until actor is available
    }

    // Fetch upcoming sales data
    const salesData = yield call([actor, actor.get_upcoming_sales]);
    console.log('salesData',salesData)
    if (salesData) {
      yield put(upcomingSalesHandlerSuccess(salesData.Ok));
    } else {
      throw new Error("Invalid upcoming sales data format");
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
