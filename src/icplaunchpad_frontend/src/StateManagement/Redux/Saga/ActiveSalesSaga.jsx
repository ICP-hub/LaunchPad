import { takeLatest, call, put, select } from "redux-saga/effects";
import {
    ActiveSalesHandlerRequest,
    ActiveSalesHandlerSuccess,
    ActiveSalesHandlerFailure,
} from "../Reducers/ActiveSales";

const selectActor = (currState) => currState.actors.actor;

function* fetchActiveSales() {
  console.log("calling fetchActiveSales");
  try {
    const actor = yield select(selectActor);
    let ActiveSalesData = yield call([actor, actor.get_active_sales]);

    console.log("get_successful_sales in saga", ActiveSalesData);
    if (ActiveSalesData) {
      // Proceed with dispatching the success action
      yield put(ActiveSalesHandlerSuccess(ActiveSalesData));
    }else {
      throw new Error("Invalid ActiveSales data format");
    }
  } catch (error) {
    console.error("Error fetching ActiveSales data:", error);
    yield put(
        ActiveSalesHandlerFailure(
        `Failed to fetch ActiveSales data: ${error.message}`
      )
    );
  }
}

export function* fetchActiveSalesSaga() {
  yield takeLatest(ActiveSalesHandlerRequest.type, fetchActiveSales);
}
