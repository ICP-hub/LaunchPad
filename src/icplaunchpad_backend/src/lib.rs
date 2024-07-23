use ic_cdk::{api::call, export_candid};
use candid::{candid_method, CandidType, Deserialize, Principal};
use ic_cdk_macros::update;

#[derive(CandidType, Deserialize)]
pub struct CreateTokenArgs {
    pub token_name: String,
    pub token_symbol: String,
    pub minting_account: Account,
    pub transfer_fee: u64,
    pub metadata: Vec<MetadataEntry>,
    pub initial_balances: Vec<InitialBalance>,
    pub archive_options: ArchiveOptions,
}

#[derive(CandidType, Deserialize)]
pub struct Account {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>,
}

#[derive(CandidType, Deserialize)]
pub struct MetadataEntry {
    pub text: String,
    pub value: MetadataValue,
}

#[derive(CandidType, Deserialize)]
pub enum MetadataValue {
    Nat(u64),
    Int(i64),
    Text(String),
    Blob(Vec<u8>),
}

#[derive(CandidType, Deserialize)]
pub struct InitialBalance {
    pub account: Account,
    pub amount: u64,
}

#[derive(CandidType, Deserialize)]
pub struct ArchiveOptions {
    pub num_blocks_to_archive: u64,
    pub trigger_threshold: u64,
    pub controller_id: Principal,
    pub cycles_for_archive_creation: Option<u64>,
}

#[update]
#[candid_method(update)]
async fn create_token(args: CreateTokenArgs) -> Result<String, String> {
    let prac_canister_id = Principal::from_text("be2us-64aaa-aaaaa-qaabq-cai").unwrap();
    let result: Result<(), (ic_cdk::api::call::RejectionCode, String)> = call::call(
        prac_canister_id,
        "init",
        (args,),
    ).await;

    match result {
        Ok(_) => Ok("Token created successfully".to_string()),
        Err((code, msg)) => Err(format!("Failed with code {:?}: {}", code, msg)),
    }
}

export_candid!();