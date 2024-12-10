use candid::{CandidType, Nat, Principal};
use ic_cdk::api;
use ic_cdk::api::call::{CallResult, RejectionCode};
use ic_cdk_macros::update;
use ic_ledger_types::TransferError;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc1::transfer::TransferArg;
use icrc_ledger_types::icrc2::transfer_from::TransferFromArgs;
use serde::{Deserialize, Serialize};

use crate::{mutate_state, TransferFromResult, U64Wrapper, STATE};

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
    // Fetch the sale ID (assumed to be the ledger canister ID)
    let sale_id = params.icrc1_ledger_canister_id.to_text();

    // Retrieve the hardcap for the sale
    let hardcap = STATE.with(|s| {
        s.borrow()
            .sale_details
            .get(&sale_id)
            .map(|wrapper| wrapper.sale_details.hardcap)
            .unwrap_or(0)
    });

    if hardcap == 0 {
        return Err(format!("Sale ID {} not found or has no hardcap set.", sale_id));
    }

    // Retrieve funds already raised for the sale
    let funds_raised = STATE.with(|s| {
        s.borrow()
            .funds_raised
            .get(&Principal::from_text(&sale_id).unwrap())
            .map(|wrapper| wrapper.0)
            .unwrap_or(0)
    });

    let remaining_cap = hardcap.saturating_sub(funds_raised);

    if remaining_cap == 0 {
        return Err("Hardcap already reached, contributions are closed.".to_string());
    }

    // Determine the amount to accept
    let accepted_amount = params.tokens.min(remaining_cap);

    // Update funds_raised atomically
    let updated_funds_raised = STATE.with(|s| {
        let mut state = s.borrow_mut();
        let sale_principal = Principal::from_text(&sale_id).unwrap();

        if let Some(wrapper) = state.funds_raised.get(&sale_principal) {
            let new_amount = wrapper.0 + accepted_amount;
            state.funds_raised.insert(sale_principal.clone(), U64Wrapper(new_amount));
            Ok(new_amount)
        } else {
            Err(format!(
                "Sale ID {} not found in funds_raised. Unable to update funds.",
                sale_id
            ))
        }
    })?;

    // Perform the transfer
    match perform_transfer(BuyTransferParams {
        tokens: accepted_amount,
        buyer_principal: params.buyer_principal.clone(),
        icrc1_ledger_canister_id: params.icrc1_ledger_canister_id.clone(),
    })
    .await
    {
        Ok(block_index) => {
            // Mark the sale as ended if the hardcap is reached
            if updated_funds_raised >= hardcap {
                mark_sale_as_ended(&sale_id)
                    .map_err(|e| format!("Failed to mark sale as ended: {}", e))?;
            }

            Ok(block_index)
        }
        Err(e) => {
            // Revert funds_raised update on failure
            STATE.with(|s| {
                let mut state = s.borrow_mut();
                let sale_principal = Principal::from_text(&sale_id).unwrap();
                if let Some(wrapper) = state.funds_raised.get(&sale_principal) {
                    let reverted_amount = wrapper.0.saturating_sub(accepted_amount);
                    state.funds_raised.insert(sale_principal, U64Wrapper(reverted_amount));
                }
            });

            Err(format!("Token transfer failed: {}", e))
        }
    }
}




async fn perform_transfer(params: BuyTransferParams) -> Result<Nat, String> {
    // Validate the input parameters
    if params.tokens == 0 {
        return Err("Transfer amount must be greater than zero.".to_string());
    }

    let ledger_canister_id = params.icrc1_ledger_canister_id;

    // Construct transfer arguments
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

    // Perform the inter-canister call to initiate the transfer
    let result: CallResult<(Result<Nat, TransferError>,)> = ic_cdk::call(
        ledger_canister_id,
        "icrc1_transfer",
        (transfer_args,),
    )
    .await;

    // Handle the result of the inter-canister call
    match result {
        Ok((Ok(block_index),)) => {
            ic_cdk::println!(
                "Transfer successful. Block index: {}. Tokens: {}",
                block_index, params.tokens
            );
            Ok(block_index)
        }
        Ok((Err(error),)) => {
            ic_cdk::println!("Transfer error: {:?}", error);
            Err(format!("Transfer error: {:?}", error))
        }
        Err((code, message)) => {
            ic_cdk::println!(
                "Inter-canister call to ledger failed. Code: {:?}, Message: {}",
                code, message
            );
            Err(format!(
                "Inter-canister call failed. Code: {:?}, Message: {}",
                code, message
            ))
        }
    }
}


#[update(guard = prevent_anonymous)]
async fn buy_tokens(params: BuyTransferParams) -> Result<Nat, String> {
    buy_transfer(params).await
}

pub fn mark_sale_as_ended(sale_id: &str) -> Result<(), String> {
    mutate_state(|state| {
        // Fetch the sale details
        if let Some(mut sale_wrapper) = state.sale_details.get(&sale_id.to_string()) {
            let current_time_utc = get_current_time(); // Fetch the current time

            // Check if the sale has ended based on the end_time_utc
            if current_time_utc > sale_wrapper.sale_details.end_time_utc {
                if sale_wrapper.sale_details.is_ended {
                    return Err(format!("Sale with ID {} is already marked as ended.", sale_id));
                }

                // Mark the sale as ended
                sale_wrapper.sale_details.is_ended = true;

                // Reinsert the modified sale_wrapper back into the map
                state.sale_details.insert(sale_id.to_string(), sale_wrapper);

                Ok(())
            } else {
                Err(format!(
                    "Sale with ID {} has not yet reached its end time.",
                    sale_id
                ))
            }
        } else {
            Err(format!("Sale with ID {} not found.", sale_id))
        }
    })
}



fn get_current_time() -> u64 {
    ic_cdk::api::time() // Returns the current time in nanoseconds since UNIX epoch
}


pub async fn perform_refund(contributor: &Principal, amount: u64) -> Result<(), String> {
    // Validate input amount
    if amount == 0 {
        return Err("Refund amount must be greater than zero.".to_string());
    }

    // Retrieve the ledger canister ID from the environment variable
    let ledger_canister_id = option_env!("CANISTER_ID_ICP_LEDGER_CANISTER")
        .ok_or("Environment variable `CANISTER_ID_ICP_LEDGER_CANISTER` not set")?;

    // Parse the ledger canister ID into a Principal
    let ledger_principal = Principal::from_text(ledger_canister_id).map_err(|_| {
        format!(
            "Failed to parse `CANISTER_ID_ICP_LEDGER_CANISTER`: {}",
            ledger_canister_id
        )
    })?;

    // Create transfer arguments
    let args = TransferArg {
        from_subaccount: None, // Default value
        to: Account {
            owner: contributor.clone(),
            subaccount: None,
        },
        fee: None,              // Default value
        memo: None,             // Default value
        created_at_time: None,  // Default value
        amount: Nat::from(amount),
    };

    // Call the ledger canister's `icrc1_transfer` method
    let result: CallResult<(TransferFromResult,)> =
        ic_cdk::call(ledger_principal, "icrc1_transfer", (args,)).await;

    // Handle the result
    match result {
        Ok((TransferFromResult::Ok(_),)) => {
            ic_cdk::println!(
                "Successfully refunded {} tokens to contributor {}",
                amount,
                contributor
            );
            Ok(())
        }
        Ok((TransferFromResult::Err(error),)) => {
            ic_cdk::println!("Refund transfer error: {:?}", error);
            Err(format!("Refund transfer error: {:?}", error))
        }
        Err((code, message)) => {
            ic_cdk::println!(
                "Inter-canister call to ledger failed: {:?} - {}",
                code, message
            );
            Err(format!(
                "Inter-canister call failed: {:?} - {}",
                code, message
            ))
        }
    }
}


pub async fn send_tokens_to_contributor(
    contributor: &Principal,
    tokens: u64,
) -> Result<(), String> {
    // Validate input tokens
    if tokens == 0 {
        return Err("Token amount must be greater than zero.".to_string());
    }

    // Retrieve the ledger canister ID from the environment variable
    let ledger_canister_id = option_env!("CANISTER_ID_ICP_LEDGER_CANISTER")
        .ok_or("Environment variable `CANISTER_ID_ICP_LEDGER_CANISTER` not set")?;

    // Parse the ledger canister ID into a Principal
    let ledger_principal = Principal::from_text(ledger_canister_id).map_err(|_| {
        format!(
            "Failed to parse `CANISTER_ID_ICP_LEDGER_CANISTER`: {}",
            ledger_canister_id
        )
    })?;

    // Create transfer arguments
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

    // Call the ledger canister's `icrc1_transfer` method
    let result: CallResult<(TransferFromResult,)> =
        ic_cdk::call(ledger_principal, "icrc1_transfer", (transfer_args,)).await;

    // Handle the result
    match result {
        Ok((TransferFromResult::Ok(_),)) => {
            ic_cdk::println!(
                "Successfully transferred {} tokens to contributor {}",
                tokens,
                contributor
            );
            Ok(())
        }
        Ok((TransferFromResult::Err(error),)) => {
            ic_cdk::println!("Transfer error: {:?}", error);
            Err(format!("Transfer error: {:?}", error))
        }
        Err((code, message)) => {
            ic_cdk::println!(
                "Inter-canister call to ledger failed: {:?} - {}",
                code, message
            );
            Err(format!(
                "Inter-canister call failed: {:?} - {}",
                code, message
            ))
        }
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
