import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  upcomingSalesHandlerRequest,
  upcomingSalesHandlerSuccess,
  upcomingSalesHandlerFailure
} from "../Reducers/UpcomingSales";

const selectActor = (currState) => currState.actors.actor;

function* fetchUpcomingSales() {
  try {
    const actor = yield select(selectActor);
    if (!actor) {
      throw new Error("Actor is not initialized");
    }
    let salesData = yield call([actor, actor.get_upcoming_sales]);
    if (salesData) {
      yield put(upcomingSalesHandlerSuccess(salesData));
    } else {
      throw new Error("Invalid upcoming sales data format");
    }
  } catch (error) {
    console.error("Error fetching upcoming Sales data:", error);
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
