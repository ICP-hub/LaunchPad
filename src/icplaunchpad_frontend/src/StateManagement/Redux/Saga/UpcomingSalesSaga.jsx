import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  upcomingSalesHandlerRequest,
  upcomingSalesHandlerSuccess,
  upcomingSalesHandlerFailure
} from "../Reducers/UpcomingSales";

const selectActor = (currState) => currState.actors.actor;

function* fetchUpcomingSales() {
  console.log("calling fetchUpcomingSales");
  try {
    const actor = yield select(selectActor);
    let salesData = yield call([actor, actor.get_upcoming_sales]);

    console.log("get_upcoming_sales in saga", salesData);
    if (salesData) {
      // Proceed with dispatching the success action
      yield put(upcomingSalesHandlerSuccess(salesData));
    }else {
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
