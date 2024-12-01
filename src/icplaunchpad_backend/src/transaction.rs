use candid::{CandidType, Nat, Principal};
use ic_cdk::api;
use ic_cdk::api::call::{CallResult, RejectionCode};
use ic_cdk_macros::update;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc2::transfer_from::TransferFromArgs;
use serde::{Deserialize, Serialize};

use crate::{mutate_state, TransferFromResult, U64Wrapper};

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

#[ic_cdk::update]
pub fn insert_funds_raised(ledger_canister_id: Principal, amount: u64) -> Result<(), String> {
    mutate_state(|state| {
        let new_amount = U64Wrapper(amount);

        // Update or insert the funds
        if let Some(existing) = state.funds_raised.get(&ledger_canister_id) {
            state
                .funds_raised
                .insert(ledger_canister_id, U64Wrapper(existing.0 + new_amount.0));
        } else {
            state.funds_raised.insert(ledger_canister_id, new_amount);
        }

        Ok(())
    })
}

#[update(guard = prevent_anonymous)]
async fn buy_tokens(params: BuyTransferParams) -> Result<Nat, String> {
    buy_transfer(params).await
}

// #[derive(CandidType, Deserialize, Serialize)]
// pub struct SellTransferParams {
//     pub tokens: u64,
//     pub to_principal: Principal,
//     pub token_ledger_canister_id: Principal,
// }

// async fn sell_transfer(params: SellTransferParams) -> Result<Nat, String> {
//     // Fetch the sale parameters directly from your backend storage
//     let sale_params = get_sale_params(params.token_ledger_canister_id)?;
//     let from_principal = sale_params.creator;

//     let transfer_args = TransferFromArgs {
//         amount: Nat::from(params.tokens),
//         to: Account {
//             owner: params.to_principal,
//             subaccount: None,
//         },
//         fee: None,
//         memo: None,
//         created_at_time: None,
//         spender_subaccount: None,
//         from: Account {
//             owner: from_principal, // Use the creator as the sender
//             subaccount: None,
//         },
//     };

//     let response: CallResult<(TransferFromResult,)> = ic_cdk::call(
//         params.token_ledger_canister_id,
//         "icrc2_transfer_from",
//         (transfer_args,),
//     )
//     .await;

//     match response {
//         Ok((TransferFromResult::Ok(block_index),)) => Ok(block_index),
//         Ok((TransferFromResult::Err(error),)) => Err(format!("Ledger transfer error: {:?}", error)),
//         Err((code, message)) => Err(format!("Failed to call ledger: {:?} - {}", code, message)),
//     }
// }

// #[update(guard = prevent_anonymous)]
// async fn sell_tokens(params: SellTransferParams) -> Result<Nat, String> {
//     sell_transfer(params).await
// }

pub async fn perform_refund(contributor: &Principal, amount: u64) -> Result<(), String> {
    let backend_canister_id = ic_cdk::id();
    let transfer_args = TransferFromArgs {
        from: Account {
            owner: backend_canister_id,
            subaccount: None,
        },
        to: Account {
            owner: contributor.clone(),
            subaccount: None,
        },
        amount: Nat::from(amount),
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
    };

    let result: CallResult<(TransferFromResult,)> =
        ic_cdk::call(backend_canister_id, "icrc1_transfer", (transfer_args,)).await;

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
    let ledger_canister_id = Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai")
        .expect("Failed to parse the ICP ledger canister ID");

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

    let result: CallResult<(TransferFromResult,)> =
        ic_cdk::call(ledger_canister_id, "icrc1_transfer", (transfer_args,)).await;

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
pub async fn icrc_get_balance(ledger_canister_id: Principal, id: Principal) -> Result<Nat, String> {
    call_inter_canister::<Account, Nat>(
        "icrc1_balance_of",
        Account {
            owner: id,
            subaccount: None,
        },
        ledger_canister_id,
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
