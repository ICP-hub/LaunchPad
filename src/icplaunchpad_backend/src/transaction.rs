use std::collections::HashMap;

use candid::{CandidType, Nat, Principal};
use ic_cdk::{api, query};
use ic_cdk::api::call::{CallResult, RejectionCode};
use ic_cdk_macros::update;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc1::transfer::{TransferArg, TransferError};
use icrc_ledger_types::icrc2::transfer_from::TransferFromArgs;
use serde::{Deserialize, Serialize};

use crate::api_query::get_funds_raised;
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

//This is the fee function for when user creates token with create_token and we accept ICP. OR when import token is done but they don't have index canister id
#[ic_cdk::update]
pub async fn token_fee_transfer(
    buyer_principal: Principal,
    amount: u64,
    icp_ledger_canister_id: Principal,
) -> Result<(), String> {
    let backend_canister_id = ic_cdk::id();
    //change backend canister id to a fee collector principal.

    // Create transfer arguments
    let transfer_args = TransferFromArgs {
        amount: Nat::from(amount),
        to: Account {
            owner: backend_canister_id,
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
        from: Account {
            owner: buyer_principal,
            subaccount: None,
        },
    };

    // Make the inter-canister call to `icrc2_transfer_from`
    let response: CallResult<(TransferFromResult,)> = ic_cdk::call(
        icp_ledger_canister_id,
        "icrc2_transfer_from",
        (transfer_args,),
    )
    .await;

    match response {
        Ok((TransferFromResult::Ok(block_index),)) => {
            ic_cdk::println!("Transfer successful. Block index: {}", block_index);
            Ok(())
        }
        Ok((TransferFromResult::Err(error),)) => {
            // If there's an error in the transfer, return the error message
            Err(format!("Transfer failed: {:?}", error))
        }
        Err((code, message)) => {
            // If the inter-canister call failed, return the error code and message
            Err(format!("Failed to call ledger: {:?} - {}", code, message))
        }
    }
}

//Transfers 5% of funds raised to a fee collector principal
pub async fn tax_transfer_on_funds_raised(
    ledger_canister_id: Principal,
) -> Result<(), String> {
    // Step 1: Retrieve funds raised from the sale canister
    let funds_raised = get_funds_raised(ledger_canister_id)?;

    // Step 2: Calculate 5% of the funds raised as the fee
    let fee_amount = funds_raised / 20; // This calculates 5% (i.e., funds_raised * 0.05)

    ic_cdk::println!("Funds raised: {}, Fee amount (5%): {}", funds_raised, fee_amount);

    // Step 3: Fee collector principal (hardcoded as per your requirement)
    let fee_collector_principal: Principal = "s4yaz-piiqq-tbbu5-kdv4h-pirny-gfddr-qs7ti-m4353-inls6-tubud-qae".parse().unwrap();

    let icp_ledger_canister_id = option_env!("CANISTER_ID_ICP_LEDGER_CANISTER")
        .ok_or("Environment variable `CANISTER_ID_ICP_LEDGER_CANISTER` not set")?;
    let icp_ledger_principal = Principal::from_text(icp_ledger_canister_id).map_err(|_| {
        format!("Failed to parse CANISTER_ID_ICP_LEDGER_CANISTER: {}", ledger_canister_id)
    })?;

    // Step 4: Transfer the fee to the fee collector
    let transfer_args = TransferArg {
        from_subaccount: None,
        to: Account {
            owner: fee_collector_principal,
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        amount: Nat::from(fee_amount),
    };

    let transfer_result: CallResult<(Result<Nat, TransferError>,)> =
        ic_cdk::call(icp_ledger_principal, "icrc1_transfer", (transfer_args,)).await;

    match transfer_result {
        Ok((Ok(_),)) => {
            ic_cdk::println!("Fee of {} transferred successfully to the fee collector.", fee_amount);
        }
        Ok((Err(error),)) => {
            return Err(format!("Refund transfer error: {:?}", error));
        }
        Err((code, message)) => {
            return Err(format!("Inter-canister call failed: {:?} - {}", code, message));
        }
    }

    // We are no longer updating the funds raised, so we don't need to modify anything further.
    Ok(())
}





pub async fn tax_transfer_on_tokens(
    ledger_principal: Principal,
    amount: u64,
) -> Result<(), String> {
    // Fee collector principal passed as a constant
    let fee_collector_principal: Principal = "s4yaz-piiqq-tbbu5-kdv4h-pirny-gfddr-qs7ti-m4353-inls6-tubud-qae".parse().unwrap();
    //preminter is the principal for now.

    let args = TransferArg {
        from_subaccount: None,
        to: Account {
            owner: fee_collector_principal, // Using the fee collector principal here
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        amount: Nat::from(amount),
    };
    ic_cdk::println!("Transferring tax on tokens: {}", amount);
    let result: CallResult<(Result<Nat, TransferError>,)> =
        ic_cdk::call(ledger_principal, "icrc1_transfer", (args,)).await;

    match result {
        Ok((Ok(_),)) => Ok(()),
        Ok((Err(error),)) => Err(format!("Refund transfer error: {:?}", error)),
        Err((code, message)) => Err(format!("Inter-canister call failed: {:?} - {}", code, message)),
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
    sale_canister_id: &Principal,
    creator: &Principal,
    contributor: &Principal,
    tokens: u64,
) -> Result<(), String> {
    // Validate input tokens
    if tokens == 0 {
        return Err("Token amount must be greater than zero.".to_string());
    }

    // Construct transfer arguments
    let transfer_args = TransferFromArgs {
        amount: Nat::from(tokens),
        to: Account {
            owner: *contributor, // Recipient is the contributor
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
        from: Account {
            owner: *creator, // Sender is the creator
            subaccount: None, // Use the sale canister ID as a subaccount
        },
    };

    // Perform the `icrc2_transfer_from` call
    let result: CallResult<(TransferFromResult,)> = ic_cdk::call(
        *sale_canister_id, // Sale canister ID acts as the ledger canister
        "icrc2_transfer_from",
        (transfer_args,),
    )
    .await;

    // Handle the result
    match result {
        Ok((TransferFromResult::Ok(_),)) => {
            ic_cdk::println!(
                "Successfully transferred {} tokens from creator {} (sale {}) to contributor {}",
                tokens,
                creator,
                sale_canister_id,
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
