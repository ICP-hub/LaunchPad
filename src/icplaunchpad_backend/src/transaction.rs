use candid::{CandidType, Nat, Principal};
use ic_cdk::api;
use ic_cdk::api::call::{CallResult, RejectionCode};
use ic_cdk_macros::update;
use ic_ledger_types::TransferError;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc1::transfer::TransferArg;
use icrc_ledger_types::icrc2::transfer_from::TransferFromArgs;
use serde::{Deserialize, Serialize};

use crate::{TransferFromResult, U64Wrapper, STATE};

pub fn prevent_anonymous() -> Result<(), String> {
    if api::caller() == Principal::anonymous() {
        return Err(String::from("Anonymous principal not allowed!"));
    }
    Ok(())
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct BuyTransferParams {
    pub tokens: u64,
    pub buyer_principal: Principal,
    pub icrc1_ledger_canister_id: Principal,
}

async fn buy_transfer(params: BuyTransferParams) -> Result<Nat, String> {
    let sale_id = params.icrc1_ledger_canister_id.to_text(); // Assuming the sale_id is the ledger canister ID
    let hardcap = STATE.with(|s| {
        s.borrow()
            .sale_details
            .get(&sale_id)
            .map(|wrapper| wrapper.sale_details.hardcap)
            .unwrap_or(0)
    });

    // Check how much funds have already been raised
    let funds_raised = STATE.with(|s| {
        s.borrow()
            .funds_raised
            .get(&Principal::from_text(&sale_id).unwrap())
            .map(|wrapper| wrapper.0)
            .unwrap_or(0)
    });

    let remaining_cap = if hardcap > funds_raised {
        hardcap - funds_raised
    } else {
        0
    };

    if remaining_cap == 0 {
        return Err("Hardcap already reached, contributions are closed.".to_string());
    }

    let accepted_amount = if params.tokens > remaining_cap {
        remaining_cap // Accept only the remaining cap
    } else {
        params.tokens
    };

    // Update funds_raised atomically using StableBTreeMap
    let updated_funds_raised = STATE.with(|s| {
        let mut state = s.borrow_mut();
        let sale_principal = Principal::from_text(&sale_id).unwrap();

        if let Some(wrapper) = state.funds_raised.get(&sale_principal) {
            let new_amount = wrapper.0 + accepted_amount;
            state.funds_raised.insert(sale_principal.clone(), U64Wrapper(new_amount));
            Ok(new_amount)
        } else {
            Err("Sale ID not found in funds_raised.".to_string())
        }
    })?;

    // Perform the transfer
    let transfer_result = perform_transfer(BuyTransferParams {
        tokens: accepted_amount,
        buyer_principal: params.buyer_principal.clone(),
        icrc1_ledger_canister_id: params.icrc1_ledger_canister_id.clone(),
    })
    .await;

    match transfer_result {
        Ok(block_index) => {
            if updated_funds_raised >= hardcap {
                mark_sale_as_ended(&sale_id)?; // Mark the sale as ended
            }
            Ok(block_index)
        }
        Err(e) => Err(e),
    }
}



async fn perform_transfer(params: BuyTransferParams) -> Result<Nat, String> {
    let ledger_canister_id = params.icrc1_ledger_canister_id;

    let transfer_args = TransferArg {
        from_subaccount: None,
        to: Account {
            owner: ic_cdk::id(), // Assuming the canister is receiving the tokens
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        amount: Nat::from(params.tokens),
    };

    let result: CallResult<(Result<Nat, TransferError>,)> = ic_cdk::call(
        ledger_canister_id,
        "icrc1_transfer",
        (transfer_args,),
    )
    .await;

    match result {
        Ok((Ok(block_index),)) => Ok(block_index),
        Ok((Err(error),)) => Err(format!("Transfer error: {:?}", error)),
        Err((code, message)) => Err(format!(
            "Inter-canister call failed: {:?} - {}",
            code, message
        )),
    }
}




#[update(guard = prevent_anonymous)]
async fn buy_tokens(params: BuyTransferParams) -> Result<Nat, String> {
    buy_transfer(params).await
}

pub fn mark_sale_as_ended(sale_id: &str) -> Result<(), String> {
    STATE.with(|s| {
        let mut state = s.borrow_mut();

        if let Some(mut sale_wrapper) = state.sale_details.get(&sale_id.to_string()) {
            let current_time_utc = get_current_time(); // Now it fetches current time
            
            // Check if the sale has ended based on the end_time_utc
            if current_time_utc > sale_wrapper.sale_details.end_time_utc {
                // Mark the sale as ended (you could add some other status tracking)
                sale_wrapper.sale_details.is_ended = true; // Mark as ended
            }

            // Reinsert the modified sale_wrapper back into the map
            state.sale_details.insert(sale_id.to_string(), sale_wrapper);
            Ok(())
        } else {
            Err(format!("Sale with ID {} not found", sale_id))
        }
    })
}


fn get_current_time() -> u64 {
    ic_cdk::api::time() // Returns the current time in nanoseconds since UNIX epoch
}




pub async fn perform_refund(contributor: &Principal, amount: u64) -> Result<(), String> {
    let ledger_canister_id = option_env!("CANISTER_ID_ICP_LEDGER_CANISTER")
        .ok_or("Environment variable `CANISTER_ID_ICP_LEDGER_CANISTER` not set")?;
    
    let args = TransferArg {
        from_subaccount: None, // Omitted by default
        to: Account {
            owner: contributor.clone(),
            subaccount: None,
        },
        fee: None, // Default
        memo: None, // Default
        created_at_time: None, // Default
        amount: Nat::from(amount),
    };

    let result: CallResult<(TransferFromResult,)> = ic_cdk::call(
        Principal::from_text(ledger_canister_id).unwrap(),
        "icrc1_transfer",
        (args,),
    )
    .await;

    match result {
        Ok((TransferFromResult::Ok(_),)) => Ok(()),
        Ok((TransferFromResult::Err(error),)) => Err(format!("Transfer error: {:?}", error)),
        Err((code, message)) => Err(format!(
            "Inter-canister call failed: {:?} - {}",
            code, message
        )),
    }
}

pub async fn send_tokens_to_contributor(
    contributor: &Principal,
    tokens: u64,
) -> Result<(), String> {
    let ledger_canister_id = option_env!("CANISTER_ID_ICP_LEDGER_CANISTER")
        .ok_or("Environment variable `CANISTER_ID_ICP_LEDGER_CANISTER` not set")?;

    let transfer_args = TransferFromArgs {
        from: Account {
            owner: ic_cdk::id(),
            subaccount: None,
        },
        to: Account {
            owner: contributor.clone(),
            subaccount: None,
        },
        amount: Nat::from(tokens),
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
    };

    let result: CallResult<(TransferFromResult,)> = ic_cdk::call(
        Principal::from_text(ledger_canister_id).unwrap(),
        "icrc1_transfer",
        (transfer_args,),
    )
    .await;

    match result {
        Ok((TransferFromResult::Ok(_),)) => Ok(()),
        Ok((TransferFromResult::Err(error),)) => Err(format!("Transfer error: {:?}", error)),
        Err((code, message)) => Err(format!(
            "Inter-canister call failed: {:?} - {}",
            code, message
        )),
    }
}

#[update]
pub async fn icrc_get_balance(id: Principal) -> Result<Nat, String> {
    let ledger_canister_id = option_env!("CANISTER_ID_ICP_LEDGER_CANISTER")
        .ok_or("Environment variable `CANISTER_ID_ICP_LEDGER_CANISTER` not set")?;
    call_inter_canister::<Account, Nat>(
        "icrc1_balance_of",
        Account {
            owner: id,
            subaccount: None,
        },
        Principal::from_text(ledger_canister_id).unwrap(),
    )
    .await
}

// execute methods of other canisters
pub async fn call_inter_canister<T, U>(
    function: &str,
    args: T,
    canister_id: Principal,
) -> Result<U, String>
where
    T: CandidType + Serialize,
    U: CandidType + for<'de> serde::Deserialize<'de>,
{
    let response: CallResult<(U,)> = ic_cdk::call(canister_id, function, (args,)).await;

    let res0: Result<(U,), (RejectionCode, String)> = response;

    match res0 {
        Ok(val) => Ok(val.0),
        Err((code, message)) => match code {
            RejectionCode::NoError => Err("NoError".to_string()),
            RejectionCode::SysFatal => Err("SysFatal".to_string()),
            RejectionCode::SysTransient => Err("SysTransient".to_string()),
            RejectionCode::DestinationInvalid => Err("DestinationInvalid".to_string()),
            RejectionCode::CanisterReject => Err("CanisterReject".to_string()),
            _ => Err(format!("Unknown rejection code: {:?}: {}", code, message)),
        },
    }
}
