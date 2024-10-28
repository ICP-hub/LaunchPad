use candid::{Nat, Principal};
use ic_cdk::api;
use ic_cdk_macros::update;
use ic_ledger_types::BlockIndex;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc2::transfer_from::{TransferFromArgs, TransferFromError};

// Guard function to prevent anonymous calls
pub fn prevent_anonymous() -> Result<(), String> {
    pub const WARNING_ANONYMOUS_CALL: &str = "Anonymous principal not allowed!";
    if api::caller() == Principal::anonymous() {
        return Err(String::from(WARNING_ANONYMOUS_CALL));
    }
    Ok(())
}

// The transfer function, which remains async
async fn transfer(tokens: u64, user_principal: Principal) -> Result<BlockIndex, String> {
    let canister_id: Principal = ic_cdk::api::id();

    let transfer_args = TransferFromArgs {
        amount: tokens.into(),
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

    // ryjl3-tyaaa-aaaaa-aaaba-cai
    let result: Result<(Result<BlockIndex, TransferFromError>,), _> =
        ic_cdk::call::<(TransferFromArgs,), (Result<BlockIndex, TransferFromError>,)>(
            Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai")
                .expect("Could not decode the principal for ICP ledger."),
            "icrc2_transfer_from",
            (transfer_args,),
        ).await;

    match result {
        Ok((Ok(block_index),)) => Ok(block_index),
        Ok((Err(transfer_error),)) => Err(format!("Ledger transfer error: {:?}", transfer_error)),
        Err(call_error) => Err(format!("Failed to call ledger: {:?}", call_error)),
    }
}

// The payment function, which also remains async
#[update(guard = "prevent_anonymous")]
pub async fn make_payment(tokens: u64, user: Principal) -> Result<Nat, String> {
    transfer(tokens, user).await.map(|block_index| Nat::from(block_index))
}
