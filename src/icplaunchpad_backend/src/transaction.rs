use candid::{Nat, Principal};
use ic_cdk::api;
use ic_cdk::api::call::CallResult;
use ic_cdk_macros::update;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc2::transfer_from::TransferFromArgs;

use crate::TransferFromResult;

pub fn prevent_anonymous() -> Result<(), String> {
    if api::caller() == Principal::anonymous() {
        return Err(String::from("Anonymous principal not allowed!"));
    }
    Ok(())
}

async fn get_seller_principal(icrc1_ledger_canister_id: Principal) -> Result<Principal, String> {
    // Call `icrc1_minting_account` on the ICRC1 token ledger canister
    let response: CallResult<(Option<Account>,)> = ic_cdk::call(
        icrc1_ledger_canister_id,
        "icrc1_minting_account",
        (),
    )
    .await;

    match response {
        Ok((Some(account),)) => Ok(account.owner), // Return the owner (seller's principal)
        Ok((None,)) => Err("Minting account not found.".to_string()),
        Err((code, message)) => Err(format!("Failed to fetch minting account: {:?} - {}", code, message)),
    }
}


async fn transfer(tokens: u64, user_principal: Principal, icrc1_ledger_canister_id: Principal) -> Result<Nat, String> {
    let icp_ledger_canister_id = Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap(); // ICP Ledger Canister ID

    // Fetch the seller's principal from the ICRC1 token ledger
    let seller_principal = get_seller_principal(icrc1_ledger_canister_id).await?;

    // Define the transfer arguments for the ICP Ledger canister
    let transfer_args = TransferFromArgs {
        amount: Nat::from(tokens),
        to: Account {
            owner: seller_principal, // Send ICP to the seller's account
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
        from: Account {
            owner: user_principal,
            subaccount: None,
        },
    };

    // Call the ICP ledger to transfer ICP to the seller
    let response: CallResult<(TransferFromResult,)> = ic_cdk::call(
        icp_ledger_canister_id,
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


async fn sell_transfer(
    tokens: u64,
    from_principal: Principal,
    to_principal: Principal,
    token_ledger_canister_id: Principal
) -> Result<Nat, String> {
    let transfer_args = TransferFromArgs {
        amount: Nat::from(tokens),
        to: Account {
            owner: to_principal,
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
        from: Account {
            owner: from_principal,
            subaccount: None,
        },
    };

    let response: CallResult<(TransferFromResult,)> = ic_cdk::call(
        token_ledger_canister_id,
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
async fn buy_tokens(tokens: u64, user: Principal, icrc1_ledger_canister_id: Principal) -> Result<Nat, String> {
    transfer(tokens, user, icrc1_ledger_canister_id).await
}

#[update(guard = prevent_anonymous)]
async fn sell_tokens(
    tokens: u64,
    from_user: Principal,
    to_user: Principal,
    token_ledger_canister_id: Principal
) -> Result<Nat, String> {
    sell_transfer(tokens, from_user, to_user, token_ledger_canister_id).await
}



