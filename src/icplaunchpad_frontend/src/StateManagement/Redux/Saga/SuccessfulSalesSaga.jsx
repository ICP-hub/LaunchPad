import { takeLatest, call, put, select } from "redux-saga/effects";
import {
    SuccessfulSalesHandlerRequest,
    SuccessfulSalesHandlerSuccess,
    SuccessfulSalesHandlerFailure,
} from "../Reducers/SuccessfulSales";

const selectActor = (currState) => currState.actors.actor;

function* fetchSuccessfulSales() {
  try {
    const actor = yield select(selectActor);

    if (!actor) {
      console.log("Actor is not available, waiting for it...");
      return; // Don't proceed until actor is available
    }

    let SuccessfulSalesData = yield call([actor, actor.get_successful_sales]);

    if (SuccessfulSalesData) {
      yield put(SuccessfulSalesHandlerSuccess(SuccessfulSalesData?.Ok));
    } else {
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
