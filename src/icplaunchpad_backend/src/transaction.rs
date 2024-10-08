// // use candid::{Nat, Principal};
// // use ic_cdk::update;
// // use icrc_ledger_types::{icrc1::{account::Account, transfer::BlockIndex}, icrc2::transfer_from::{TransferFromArgs, TransferFromError}};

// // // Replace this with your actual backend canister ID
// // const BACKEND_CANISTER_ID: &str = "bw4dl-smaaa-aaaaa-qaacq-cait";

// // // ledger handlers
// // async fn transfer(tokens: u64, user_principal: Principal) -> Result<BlockIndex, String> {
// //     let transfer_args = TransferFromArgs {
// //         amount: tokens.into(),
// //         to: Account {
// //             owner: Principal::from_text(BACKEND_CANISTER_ID).expect("Could not decode the backend canister principal."),
// //             subaccount: None,
// //         },
// //         fee: None,
// //         memo: None,
// //         created_at_time: None,
// //         spender_subaccount: None,
// //         from: Account {
// //             owner: user_principal,
// //             subaccount: None,
// //         },
// //     };

// //     ic_cdk::call::<(TransferFromArgs,), (Result<BlockIndex, TransferFromError>,)>( 
// //         Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai") // ICP ledger principal
// //             .expect("Could not decode the principal if ICP ledger."),
// //         "icrc2_transfer_from",
// //         (transfer_args,),
// //     )
// //     .await
// //     .map_err(|e| format!("failed to call ledger: {:?}", e))?
// //     .0
// //     .map_err(|e| format!("ledger transfer error {:?}", e))
// // }

// // #[update]
// // async fn make_payment(tokens: u64, user: Principal) -> Result<Nat, String> {
// //     // add check for admin
// //     transfer(tokens, user).await
// // }
// use candid::{CandidType, Nat, Principal};
// use ic_cdk::api::call::call;
// use ic_cdk_macros::*;
// use serde::{Deserialize, Serialize};

// type Tokens = Nat; // Update to Nat to match the ledger's candid definition
// type BlockIndex = Nat; // Use Nat instead of u64 as per .did file
// type Timestamp = u64;
// type Subaccount = Vec<u8>;

// #[derive(CandidType, Serialize, Deserialize, Clone)]
// struct Account {
//     owner: Principal,
//     subaccount: Option<Subaccount>,
// }

// #[derive(CandidType, Serialize, Deserialize, Clone)]
// struct TransferArg {
//     from_subaccount: Option<Subaccount>,
//     to: Account,
//     amount: Nat, // This should remain Nat
//     fee: Option<Nat>, // This should be Nat as well
//     memo: Option<Vec<u8>>,
//     created_at_time: Option<u64>, // Should correspond to `nat64`
// }

// #[derive(CandidType, Deserialize, Clone, Debug)]
// enum TransferError {
//     BadFee { expected_fee: Tokens }, // Change to Nat
//     InsufficientFunds { balance: Tokens }, // Change to Nat
//     TemporarilyUnavailable,
//     Duplicate { duplicate_of: BlockIndex }, // Change to Nat
//     GenericError { error_code: Nat, message: String }, // Change to Nat
// }

// #[derive(CandidType, Deserialize, Clone, Debug)]
// enum TransferResult {
//     Ok(BlockIndex), // Change to Nat
//     Err(TransferError),
// }

// #[update]
// async fn transfer_tokens(ledger_canister_id: Principal, transfer_arg: TransferArg) -> Result<Nat, String> {
//     // Call the icrc1_transfer method on the ledger canister, passing in TransferArg
//     let transfer_result: Result<(TransferResult,), _> = call(ledger_canister_id, "icrc1_transfer", (transfer_arg,)).await;

//     match transfer_result {
//         Ok((TransferResult::Ok(block_index),)) => Ok(block_index),
//         Ok((TransferResult::Err(error),)) => Err(format!("Transfer failed: {:?}", error)),
//         Err(e) => Err(format!("Call to ledger canister failed: {:?}", e)),
//     }
// }



