use candid::{CandidType, Nat, Principal};
use ic_cdk::api;
use ic_cdk::api::call::CallResult;
use ic_cdk_macros::update;
use ic_ledger_types::TransferResult;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc1::transfer::TransferArg;
use icrc_ledger_types::icrc2::transfer_from::TransferFromArgs;
use serde::{Deserialize, Serialize};

use crate::api_query::get_sale_params;
use crate::api_update::insert_funds_raised;
use crate::{read_state, TransferFromResult};

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
    let icp_ledger_canister_id = Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap(); // ICP Ledger Canister ID
    let backend_canister_id = ic_cdk::id(); // Use the backend canister's principal as the recipient
    ic_cdk::println!("{}", backend_canister_id);

    // Define the transfer arguments for the ICP Ledger canister
    let transfer_args = TransferFromArgs {
        amount: Nat::from(params.tokens),
        to: Account {
            owner: backend_canister_id, // Send ICP to the backend canister
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

    // Call the ICP ledger to transfer ICP to the backend
    let response: CallResult<(TransferFromResult,)> = ic_cdk::call(
        icp_ledger_canister_id,
        "icrc2_transfer_from",
        (transfer_args,),
    )
    .await;

    match response {
        Ok((TransferFromResult::Ok(block_index),)) => {
            // Update funds raised for the sale
            let amount_u64 = params.tokens;
            insert_funds_raised(params.icrc1_ledger_canister_id, amount_u64)?;

            Ok(block_index)
        }
        Ok((TransferFromResult::Err(error),)) => Err(format!("Ledger transfer error: {:?}", error)),
        Err((code, message)) => Err(format!("Failed to call ledger: {:?} - {}", code, message)),
    }
}





#[update(guard = prevent_anonymous)]
async fn buy_tokens(params: BuyTransferParams) -> Result<Nat, String> {
    buy_transfer(params).await
}


#[derive(CandidType, Deserialize, Serialize)]
pub struct SellTransferParams {
    pub tokens: u64,
    pub to_principal: Principal,
    pub token_ledger_canister_id: Principal,
}

async fn sell_transfer(params: SellTransferParams) -> Result<Nat, String> {
    // Fetch the sale parameters directly from your backend storage
    let sale_params = get_sale_params(params.token_ledger_canister_id)?;
    let from_principal = sale_params.creator;

    let transfer_args = TransferFromArgs {
        amount: Nat::from(params.tokens),
        to: Account {
            owner: params.to_principal,
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
        from: Account {
            owner: from_principal, // Use the creator as the sender
            subaccount: None,
        },
    };

    let response: CallResult<(TransferFromResult,)> = ic_cdk::call(
        params.token_ledger_canister_id,
        "icrc2_transfer_from",
        (transfer_args,),
    )
    .await;

    match response {
        Ok((TransferFromResult::Ok(block_index),)) => Ok(block_index),
        Ok((TransferFromResult::Err(error),)) => Err(format!("Ledger transfer error: {:?}", error)),
        Err((code, message)) => Err(format!("Failed to call ledger: {:?} - {}", code, message)),
    }
}

#[update(guard = prevent_anonymous)]
async fn sell_tokens(params: SellTransferParams) -> Result<Nat, String> {
    sell_transfer(params).await
}

// REFUND LOGIC
// after end time--if softcap didn't reach---we'll refund

#[update]
pub async fn process_refunds(ledger_canister_id: Principal) -> Result<(), String> {
    let current_time = ic_cdk::api::time() / 1_000_000_000; // Convert to seconds

    // Read the sale details
    let sale_details = read_state(|state| {
        state.sale_details.get(&ledger_canister_id.to_string())
            .map(|wrapper| wrapper.sale_details.clone())
    }).ok_or("Sale not found")?;

    // Check if the sale has ended and failed to meet the soft cap
    if current_time < sale_details.end_time_utc {
        return Err("Sale has not ended yet".to_string());
    }

    let total_raised = read_state(|state| {
        state.funds_raised.get(&ledger_canister_id).map(|wrapper| wrapper.0)
    }).unwrap_or(0);

    if total_raised >= sale_details.softcap {
        return Err("Sale met or exceeded the soft cap; no refunds needed".to_string());
    }

    // Iterate through all contributions for this sale
    let contributions = read_state(|state| {
        state.contributions.iter()
            .filter_map(|((sale_id, contributor), amount)| {
                if sale_id == ledger_canister_id { 
                    Some((contributor.clone(), amount.0)) 
                } else {
                    None
                }
            })
            .collect::<Vec<_>>()
    });
    
    


    // Refund each contributor
    for (contributor, amount) in contributions {
        let transfer_args = TransferArg {
            to: Account {
                owner: contributor,
                subaccount: None,
            },
            fee: None,
            memo: None,
            from_subaccount: None,
            created_at_time: None,
            amount: Nat::from(amount),
        };

        let response: CallResult<(TransferResult,)> = ic_cdk::api::call::call(
            ledger_canister_id,
            "icrc1_transfer",
            (transfer_args,),
        )
        .await;

        match response {
            Ok((TransferResult::Ok(_),)) => {
                // Log success
                ic_cdk::println!("Refunded {} ICP to {}", amount, contributor);
            }
            Ok((TransferResult::Err(err),)) => {
                // Log specific error for this contributor
                ic_cdk::println!("Failed to refund {} ICP to {}: {:?}", amount, contributor, err);
            }
            Err((code, message)) => {
                // Log general error
                ic_cdk::println!(
                    "Error refunding {} ICP to {}: Code {:?}, Message {}",
                    amount, contributor, code, message
                );
            }
        }
    }

    Ok(())
}



