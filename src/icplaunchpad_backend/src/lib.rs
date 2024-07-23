use ic_cdk::export_candid;
use ic_cdk_macros::update;
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, CandidType)]
struct TokenDetails {
    token_symbol: String,
    token_name: String,
    transfer_fee: u64,
    feature_flags: bool,
    pre_minted_tokens: u64,
    default_owner: Principal,
    archive_controller: Principal,
    trigger_threshold: u64,
    cycle_for_archive_creation: u64,
    num_of_block_to_archive: u64,
    minter: Principal,
}

#[update]
fn create_token(details: TokenDetails) -> String {
    // Serialize the details to JSON
    let serialized = serde_json::to_string(&details).unwrap();

    // Return the serialized details
    serialized
}
//to check if pr can be raised
export_candid!();