// use candid::{Nat, Principal};
// use ic_cdk::update;
// use icrc_ledger_types::{icrc1::{account::Account, transfer::BlockIndex}, icrc2::transfer_from::{TransferFromArgs, TransferFromError}};

// // Replace this with your actual backend canister ID
// const BACKEND_CANISTER_ID: &str = "bw4dl-smaaa-aaaaa-qaacq-cait";

// // ledger handlers
// async fn transfer(tokens: u64, user_principal: Principal) -> Result<BlockIndex, String> {
//     let transfer_args = TransferFromArgs {
//         amount: tokens.into(),
//         to: Account {
//             owner: Principal::from_text(BACKEND_CANISTER_ID).expect("Could not decode the backend canister principal."),
//             subaccount: None,
//         },
//         fee: None,
//         memo: None,
//         created_at_time: None,
//         spender_subaccount: None,
//         from: Account {
//             owner: user_principal,
//             subaccount: None,
//         },
//     };

//     ic_cdk::call::<(TransferFromArgs,), (Result<BlockIndex, TransferFromError>,)>( 
//         Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai") // ICP ledger principal
//             .expect("Could not decode the principal if ICP ledger."),
//         "icrc2_transfer_from",
//         (transfer_args,),
//     )
//     .await
//     .map_err(|e| format!("failed to call ledger: {:?}", e))?
//     .0
//     .map_err(|e| format!("ledger transfer error {:?}", e))
// }

// #[update]
// async fn make_payment(tokens: u64, user: Principal) -> Result<Nat, String> {
//     // add check for admin
//     transfer(tokens, user).await
// }

