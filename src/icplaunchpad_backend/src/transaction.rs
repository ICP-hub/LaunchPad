use std::collections::HashMap;

use candid::{CandidType, Nat, Principal};
use ic_cdk::{api, query};
use ic_cdk::api::call::{CallResult, RejectionCode};
use ic_cdk_macros::update;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc1::transfer::{TransferArg, TransferError};
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
    let sale_id = params.icrc1_ledger_canister_id;

    // Retrieve the hardcap for the sale
    let hardcap = STATE.with(|s| {
        s.borrow()
            .sale_details
            .get(&sale_id)
            .map(|wrapper| wrapper.sale_details.hardcap)
            .unwrap_or(0)
    });

    if hardcap == 0 {
        return Err(format!(
            "Sale ID {} not found or has no hardcap set.",
            sale_id.to_text()
        ));
    }

    // Retrieve funds already raised for the sale
    let funds_raised = STATE.with(|s| {
        s.borrow()
            .funds_raised
            .get(&sale_id)
            .map(|wrapper| wrapper.0)
            .unwrap_or(0)
    });

    let remaining_cap = hardcap.saturating_sub(funds_raised);

    if remaining_cap == 0 {
        return Err("Hardcap already reached, contributions are closed.".to_string());
    }

    let accepted_amount = remaining_cap.min(params.tokens);

    if accepted_amount < params.tokens {
        ic_cdk::println!(
            "Requested tokens: {}, Accepted tokens: {}. Contribution capped at remaining cap.",
            params.tokens, accepted_amount
        );
    }

    // Update funds_raised atomically
    let updated_funds_raised = STATE.with(|s| {
        let mut state = s.borrow_mut();
        if let Some(wrapper) = state.funds_raised.get(&sale_id) {
            let new_amount = wrapper.0 + accepted_amount;
            state.funds_raised.insert(sale_id, U64Wrapper(new_amount));
            Ok(new_amount)
        } else {
            Err(format!(
                "Sale ID {} not found in funds_raised. Unable to update funds.",
                sale_id.to_text()
            ))
        }
    })?;

    // Perform the transfer using `icrc2_transfer_from`
    let ledger_canister_id = Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap();
    let backend_canister_id = ic_cdk::id();

    let transfer_args = TransferFromArgs {
        amount: Nat::from(accepted_amount),
        to: Account {
            owner: backend_canister_id,
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
        from: Account {
            owner: params.buyer_principal,
            subaccount: None,
        },
    };

    let response: CallResult<(TransferFromResult,)> = ic_cdk::call(
        ledger_canister_id,
        "icrc2_transfer_from",
        (transfer_args,),
    )
    .await;

    match response {
        Ok((TransferFromResult::Ok(block_index),)) => {
            ic_cdk::println!("Transfer successful. Block index: {}", block_index);

            // Add contribution to ContributionsMap after successful transfer
            let contribution_key = (sale_id, params.buyer_principal);
            STATE.with(|s| {
                let mut state = s.borrow_mut();
                let current_contribution = state
                    .contributions
                    .get(&contribution_key)
                    .map(|wrapper| wrapper.0)
                    .unwrap_or(0);
                let new_contribution = current_contribution + accepted_amount;
                state
                    .contributions
                    .insert(contribution_key, U64Wrapper(new_contribution));
            });

            // Mark the sale as ended if the hardcap is reached
            if updated_funds_raised >= hardcap {
                mark_sale_as_ended(&sale_id)
                    .map_err(|e| format!("Failed to mark sale as ended: {}", e))?;
            }

            Ok(block_index)
        }
        Ok((TransferFromResult::Err(error),)) => {
            // Revert funds_raised on transfer failure
            STATE.with(|s| {
                let mut state = s.borrow_mut();
                if let Some(wrapper) = state.funds_raised.get(&sale_id) {
                    let reverted_amount = wrapper.0.saturating_sub(accepted_amount);
                    state.funds_raised.insert(sale_id, U64Wrapper(reverted_amount));
                }
            });

            Err(format!("Ledger transfer error: {:?}", error))
        }
        Err((code, message)) => {
            // Revert funds_raised on call failure
            STATE.with(|s| {
                let mut state = s.borrow_mut();
                if let Some(wrapper) = state.funds_raised.get(&sale_id) {
                    let reverted_amount = wrapper.0.saturating_sub(accepted_amount);
                    state.funds_raised.insert(sale_id, U64Wrapper(reverted_amount));
                }
            });

            Err(format!("Failed to call ledger: {:?} - {}", code, message))
        }
    }
}


#[query]
fn get_contributions_for_sale(sale_id: Principal) -> HashMap<Principal, u64> {
    // Create a new HashMap to store the results
    let mut contributions: HashMap<Principal, u64> = HashMap::new();

    // Access the ContributionsMap and filter by sale_id
    STATE.with(|s| {
        let state = s.borrow();
        for ((contribution_sale_id, buyer_principal), wrapper) in state.contributions.iter() {
            if contribution_sale_id == sale_id {
                // Add the buyer_principal and contributed amount to the results
                contributions.insert(buyer_principal, wrapper.0);
            }
        }
    });

    contributions
}


#[update(guard = prevent_anonymous)]
async fn buy_tokens(params: BuyTransferParams) -> Result<Nat, String> {
    buy_transfer(params).await
}

pub fn mark_sale_as_ended(sale_id: &Principal) -> Result<(), String> {
    mutate_state(|state| {
        // Fetch the sale details
        if let Some(mut sale_wrapper) = state.sale_details.get(sale_id) {
            let current_time_utc = get_current_time(); // Fetch the current time

            // Check if the sale has ended based on the end_time_utc
            if current_time_utc > sale_wrapper.sale_details.end_time_utc {
                if sale_wrapper.sale_details.is_ended {
                    return Err(format!(
                        "Sale with ID {:?} is already marked as ended.",
                        sale_id
                    ));
                }

                // Mark the sale as ended
                sale_wrapper.sale_details.is_ended = true;

                // Reinsert the modified sale_wrapper back into the map
                state.sale_details.insert(*sale_id, sale_wrapper);

                Ok(())
            } else {
                Err(format!(
                    "Sale with ID {:?} has not yet reached its end time.",
                    sale_id
                ))
            }
        } else {
            Err(format!("Sale with ID {:?} not found.", sale_id))
        }
    })
}




fn get_current_time() -> u64 {
    ic_cdk::api::time() // Returns the current time in nanoseconds since UNIX epoch
}

pub async fn perform_refund(
    sale_principal: &Principal,
    contributor: &Principal,
    amount: u64,
) -> Result<(), String> {
    let _ = sale_principal;
    if amount == 0 {
        return Err("Refund amount must be greater than zero.".to_string());
    }

    let ledger_canister_id = option_env!("CANISTER_ID_ICP_LEDGER_CANISTER")
        .ok_or("Environment variable `CANISTER_ID_ICP_LEDGER_CANISTER` not set")?;
    let ledger_principal = Principal::from_text(ledger_canister_id).map_err(|_| {
        format!("Failed to parse CANISTER_ID_ICP_LEDGER_CANISTER: {}", ledger_canister_id)
    })?;

    let args = TransferArg {
        from_subaccount: None,
        to: Account {
            owner: contributor.clone(),
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        amount: Nat::from(amount),
    };

    let result: CallResult<(Result<Nat, TransferError>,)> =
        ic_cdk::call(ledger_principal, "icrc1_transfer", (args,)).await;

    match result {
        Ok((Ok(_),)) => Ok(()),
        Ok((Err(error),)) => Err(format!("Refund transfer error: {:?}", error)),
        Err((code, message)) => Err(format!("Inter-canister call failed: {:?} - {}", code, message)),
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
