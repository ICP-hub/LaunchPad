import { takeLatest, call, put, select } from "redux-saga/effects";
import {
    SuccessfulSalesHandlerRequest,
    SuccessfulSalesHandlerSuccess,
    SuccessfulSalesHandlerFailure,
} from "../Reducers/SuccessfulSales";

const selectActor = (currState) => currState.actors.actor;

function* fetchSuccessfulSales() {
  // console.log("calling fetchSuccessfulSales");
  try {
    const actor = yield select(selectActor);
    let SuccessfulSalesData = yield call([actor, actor.get_successful_sales]);

    console.log("get_successful_sales in saga", SuccessfulSalesData);
    if (SuccessfulSalesData) {
      // Proceed with dispatching the success action
      yield put(SuccessfulSalesHandlerSuccess(SuccessfulSalesData));
    }else {
      throw new Error("Invalid SuccessfulSales data format");
    }
  } catch (error) {
    console.error("Error fetching SuccessfulSales data:", error);
    yield put(
        SuccessfulSalesHandlerFailure(
        `Failed to fetch SuccessfulSales data: ${error.message}`
      )
    );
  }
}

export function* fetchSuccessfulSalesSaga() {
  yield takeLatest(SuccessfulSalesHandlerRequest.type, fetchSuccessfulSales);
}
