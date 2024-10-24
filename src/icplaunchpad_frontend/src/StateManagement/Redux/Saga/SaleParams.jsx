import { takeLatest, call, put, select } from "redux-saga/effects";
import {
    SaleParamsHandlerRequest,
    SaleParamsHandlerSuccess,
    SaleParamsHandlerFailure,
} from "../Reducers/SaleParams"; // Ensure these are action creators
import { Principal } from "@dfinity/principal";

const selectActor = (state) => state.actors.actor; // Selector returning actor from state
const selectLedgerId = (state) => state.LedgerId.data.ledger_canister_id; // Correct selector for ledgerId

function* fetchSaleParams() {
  console.log("Calling fetchSaleParams saga...");
  
  try {
    const actor = yield select(selectActor); // Select actor from state
    const ledger = yield select(selectLedgerId); // Select ledgerId from state
    console.log("selectLedgerId in saga...", ledger);
    
    if (!ledger) {
      throw new Error("Ledger ID is missing");
    }
    
    const ledgerPrincipal = Principal.fromText(ledger); // Create Principal object from ledger ID
    let SaleParamsData = yield call([actor, actor.get_sale_params], ledgerPrincipal); // Call the actor's get_sale_params function
    
    if (SaleParamsData) {
      console.log("get_sale_params response in saga:", SaleParamsData);
      // Dispatch success action with fetched data
      yield put(SaleParamsHandlerSuccess(SaleParamsData));
    } else {
      throw new Error("Invalid Sale Params data format");
    }
  } catch (error) {
    console.error("Error fetching Sale Params data:", error);
    
    // Dispatch failure action with error message using template literals
    yield put(SaleParamsHandlerFailure(`Failed to fetch Sale Params data: ${error.message}`));
  }
}

export function* fetchSaleParamsSaga() {
  yield takeLatest(SaleParamsHandlerRequest.type, fetchSaleParams); // Watch for request action
}
