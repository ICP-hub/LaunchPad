import { takeLatest, call, put, select } from "redux-saga/effects";
import {
    SaleParamsHandlerRequest,
    SaleParamsHandlerSuccess,
    SaleParamsHandlerFailure,
} from "../Reducers/SaleParams";

const selectActor = (currState) => currState.actors.actor;
const ledgerId = (currState) => currState.ledgerId;

function* fetchSaleParams() {
  console.log("calling fetchSaleParams");
  try {
    const actor = yield select(selectActor);
    let SaleParamsData = yield call([actor, actor.get_sale_params], ledgerId );

    console.log("get_sale_params in saga", SaleParamsData);
    if (SaleParamsData) {
      // Proceed with dispatching the success action
      yield put(SaleParamsHandlerSuccess(SaleParamsData));
    }else {
      throw new Error("Invalid Sale Params data format");
    }
  } catch (error) {
    console.error("Error fetching Sale Params data:", error);
    yield put(
        SaleParamsHandlerFailure(
        `Failed to fetch Sale Params data: ${error.message}`
      )
    );
  }
}

export function* fetchSaleParamsSaga() {
  yield takeLatest(SaleParamsHandlerRequest.type, fetchSaleParams);
}
