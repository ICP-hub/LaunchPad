use candid::{Nat, Principal};
use ic_cdk::api;
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

async fn transfer(tokens: Nat, user_principal: Principal) -> Result<Nat, String> {
    let canister_id: Principal = ic_cdk::api::id();
    ic_cdk::println!("Canister id: {}", canister_id);

    let transfer_args = TransferFromArgs {
        amount: tokens.clone(),
        to: Account {
            owner: canister_id,
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

    let result: Result<(TransferFromResult,), _> =
        ic_cdk::call::<(TransferFromArgs,), (TransferFromResult,)>(
            Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai")
                .expect("Could not decode the principal for ICP ledger."),
            "icrc2_transfer_from",
            (transfer_args,),
        )
        .await;

    match result {
        Ok((TransferFromResult::Ok(block_index),)) => Ok(block_index.into()),
        Ok((TransferFromResult::Err(transfer_error),)) => Err(format!("Ledger transfer error: {:?}", transfer_error)),
        Err(call_error) => Err(format!("Failed to call ledger: {:?}", call_error)),
    }
}

#[update(guard = "prevent_anonymous")]
pub async fn make_payment(tokens: Nat, user: Principal) -> Result<Nat, String> {
    transfer(tokens, user).await
}
