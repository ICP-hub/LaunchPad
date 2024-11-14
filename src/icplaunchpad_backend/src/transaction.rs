use candid::{CandidType, Nat, Principal};
use ic_cdk::api;
use ic_cdk::api::call::CallResult;
use ic_cdk_macros::update;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc2::transfer_from::TransferFromArgs;
use serde::{Deserialize, Serialize};

use crate::api_query::get_sale_params;
use crate::TransferFromResult;

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

    // Fetch the sale parameters directly from your backend storage
    let sale_params = get_sale_params(params.icrc1_ledger_canister_id)?;
    let seller_principal = sale_params.creator;

    // Define the transfer arguments for the ICP Ledger canister
    let transfer_args = TransferFromArgs {
        amount: Nat::from(params.tokens),
        to: Account {
            owner: seller_principal, // Send ICP to the creator's account specified in the sale parameters
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

    // Call the ICP ledger to transfer ICP to the seller
    let response: CallResult<(TransferFromResult,)> = ic_cdk::call(
        icp_ledger_canister_id,
        "icrc2_transfer_from",
        (transfer_args,),
    ).await;

    match response {
        Ok((TransferFromResult::Ok(block_index),)) => Ok(block_index),
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





