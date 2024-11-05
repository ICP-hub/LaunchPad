use candid::{CandidType, Nat, Principal};
use ic_cdk::api::management_canister::main::{CanisterInstallMode, WasmModule};
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;

use crate::state_handler::*;

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
pub struct UserAccount {
    pub name: String,
    pub username: String,
    pub profile_picture: Option<ByteBuf>, // Placeholder for profile picture data
    pub links: Vec<String>,               // Social media links
    pub tag: Vec<String>,                      // User's role like block explorer, investor, etc.
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]

pub struct Account {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct TransferFromArgs {
    pub spender_subaccount: Option<Vec<u8>>, // SubAccount is a blob
    pub from: Account,
    pub to: Account,
    pub amount: Nat, // Icrc1Tokens is a nat
    pub fee: Option<Nat>,
    pub memo: Option<Vec<u8>>,
    pub created_at_time: Option<u64>, // Icrc1Timestamp is a nat64
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct Metadata {
    pub key: String,
    pub value: MetadataValue,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub enum MetadataValue {
    Nat(Nat),
    Int(i64),
    Text(String),
    Blob(Vec<u8>),
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct FeatureFlags {
    pub icrc2: bool,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct InitArgs {
    pub minting_account: Account,
    pub fee_collector_account: Option<Account>,
    pub transfer_fee: Nat,
    pub decimals: Option<u8>,
    pub max_memo_length: Option<u16>,
    pub token_symbol: String,
    pub token_name: String,
    pub metadata: Vec<Metadata>,
    pub initial_balances: Vec<(Account, Nat)>,
    pub feature_flags: Option<FeatureFlags>,
    pub maximum_number_of_accounts: Option<u64>,
    pub accounts_overflow_trim_quantity: Option<u64>,
    pub archive_options: ArchiveOptions,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct ArchiveOptions {
    pub num_blocks_to_archive: u64,
    pub max_transactions_per_response: Option<u64>,
    pub trigger_threshold: u64,
    pub max_message_size_bytes: Option<u64>,
    pub cycles_for_archive_creation: Option<u64>,
    pub node_max_memory_size_bytes: Option<u64>,
    pub controller_id: Principal,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub enum LedgerArg {
    Init(InitArgs),
    Upgrade(Option<UpgradeArgs>),
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct UpgradeArgs {
    pub metadata: Option<Vec<Metadata>>,
    pub token_symbol: Option<String>,
    pub token_name: Option<String>,
    pub transfer_fee: Option<Nat>,
    pub change_fee_collector: Option<ChangeFeeCollector>,
    pub max_memo_length: Option<u16>,
    pub feature_flags: Option<FeatureFlags>,
    pub maximum_number_of_accounts: Option<u64>,
    pub accounts_overflow_trim_quantity: Option<u64>,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub enum ChangeFeeCollector {
    Unset,
    SetTo(Account),
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct TokenParams {
    pub token_symbol: String,
    pub token_name: String,
    pub decimals: Option<u8>,
    pub minting_account: Account,
    pub transfer_fee: Nat,
    pub metadata: Vec<Metadata>,
    pub feature_flags: Option<FeatureFlags>,
    pub initial_balances: Vec<(Account, Nat)>,
    pub archive_options: ArchiveOptions,
    pub maximum_number_of_accounts: Option<u64>,
    pub accounts_overflow_trim_quantity: Option<u64>,
    pub fee_collector_account: Option<Account>,
    pub max_memo_length: Option<u16>,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct UserInputParams {
    pub token_symbol: String,
    pub token_name: String,
    pub decimals: Option<u8>,
    pub initial_balances: Vec<(Account, Nat)>,
}

#[derive(
    CandidType, Serialize, Deserialize, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone, Default,
)]
pub struct CanisterSettings {
    pub controllers: Option<Vec<Principal>>,
    pub compute_allocation: Option<Nat>,
    pub memory_allocation: Option<Nat>,
    pub freezing_threshold: Option<Nat>,
    pub reserved_cycles_limit: Option<Nat>,
}

#[derive(
    CandidType, Serialize, Deserialize, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone,
)]
pub(crate) struct InstallCodeArgumentExtended {
    pub mode: CanisterInstallMode,
    pub canister_id: CanisterId,
    pub wasm_module: WasmModule,
    pub arg: Vec<u8>,
    pub sender_canister_version: Option<u64>,
}

#[derive(
    CandidType, Serialize, Deserialize, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone,
)]
pub(crate) struct IndexInstallCodeArgumentExtended {
    pub mode: CanisterInstallMode,
    pub canister_id: CanisterId,
    pub wasm_module: WasmModule,
    pub sender_canister_version: Option<u64>,
    pub arg: Vec<u8>,
}

#[derive(
    CandidType, Serialize, Deserialize, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone, Default,
)]
pub struct CreateCanisterArgument {
    pub settings: Option<CanisterSettings>,
}

#[derive(
    CandidType, Serialize, Deserialize, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone,
)]
pub struct InstallCodeArgument {
    pub mode: CanisterInstallMode,
    pub canister_id: CanisterId,
    pub wasm_module: WasmModule,
    pub arg: Vec<u8>,
}

#[derive(
    CandidType, Serialize, Deserialize, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone,
)]
pub struct IndexInstallCodeArgument {
    pub mode: CanisterInstallMode,
    pub canister_id: CanisterId,
    pub wasm_module: WasmModule,
    pub arg: Vec<u8>,
}

pub type CanisterId = Principal;

#[derive(
    CandidType, Serialize, Deserialize, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone, Copy,
)]
pub struct CanisterIdRecord {
    pub canister_id: CanisterId,
}

#[derive(
    CandidType, Serialize, Deserialize, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone, Default,
)]
pub(crate) struct CreateCanisterArgumentExtended {
    pub settings: Option<CanisterSettings>,
    pub sender_canister_version: Option<u64>,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct IndexInitArgs {
    pub ledger_id: Principal,
    pub retrieve_blocks_from_ledger_interval_seconds: Option<u64>, // Add this field
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct CanisterIndexInfo {
    pub canister_id: String,
    pub index_canister_id: String,
    pub token_name: String,
    pub token_symbol: String,
}
#[derive(CandidType, Deserialize, Debug)]
pub struct Icrc28TrustedOriginsResponse {
    pub(crate) trusted_origins: Vec<String>,
}

#[derive(CandidType, Deserialize, Serialize, Debug)]
pub struct TokenCreationResult {
    pub ledger_canister_id: Principal,
    pub index_canister_id: Principal,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub enum IndexArg {
    Init(IndexInitArgs),
    Upgrade(UpgradeArgs),
}

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct TokenImageData {
    pub content: Option<ByteBuf>,
    pub ledger_id: Principal,
    // you can add more params
}

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct ProfileImageData {
    pub content: Option<ByteBuf>,
    // You can add more fields if necessary
}

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct CoverImageData {
    pub content: Option<ByteBuf>,  // The image content for the cover image
    pub ledger_id: Principal,      // Ledger ID associated with the cover image
    // Additional parameters specific to cover images can be added here if needed
}


#[derive(CandidType, Clone, Debug, Default, Deserialize, Serialize)]
pub struct CreateFileInput {
    // pub parent: u32,
    pub name: String,
    pub content_type: String,
    pub size: Option<Nat>, // if provided, can be used to detect the file is fully filled
    pub content: Option<ByteBuf>, // should <= 1024 * 1024 * 2 - 1024
    pub status: Option<i8>, // when set to 1, the file must be fully filled, and hash must be provided
    pub hash: Option<ByteBuf>, // recommend sha3 256
    pub ert: Option<String>,
    pub crc32: Option<u32>,
}

pub type ReturnResult = Result<u32, String>;

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct SaleDetailsUpdate {
    pub start_time_utc: Option<u64>,
    pub end_time_utc: Option<u64>,
    pub website: Option<String>,
    pub social_links: Option<Vec<String>>,
    pub description: Option<String>,
    pub project_video: Option<String>, // Optional field to update the project video
}


pub struct State {
    pub canister_ids: CanisterIdsMap,
    pub index_canister_ids: IndexCanisterIdsMap,
    pub image_ids: ImageIdsMap,
    pub sale_details: SaleDetailsMap,
    pub user_accounts: UserAccountsMap,
    pub cover_image_ids: CoverImageIdsMap,
}

#[derive(CandidType, Deserialize, Debug, Clone)]
pub struct CanisterIdWrapper {
    pub canister_ids: Principal,
    pub token_name: String,
    pub token_symbol: String,
    pub image_id: Option<u32>,
    pub ledger_id: Option<Principal>,  
    pub owner: Principal,  
}


#[derive(CandidType, Deserialize, Debug, Clone)]
pub struct IndexCanisterIdWrapper {
    pub index_canister_ids: Principal,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct ImageIdWrapper {
    pub image_id: u32,
}

#[derive(CandidType, Deserialize, Debug, Clone)]
pub struct SaleDetailsWrapper {
    pub sale_details: SaleDetails,
}
#[derive(CandidType, Deserialize, Debug, Clone)]
pub struct UserAccountWrapper {
    pub user_account: UserAccount,
}

#[derive(CandidType, Deserialize, Debug, Clone)]
pub struct CoverImageIdWrapper {
    pub image_id: u32,
}

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct SaleDetails {
    pub creator: Principal, // Principal of the user who created the token and sale
    pub listing_rate: f64,  // Price of 1 token in ICP
    pub min_buy: u64,
    pub max_buy: u64,
    pub start_time_utc: u64,
    pub end_time_utc: u64,
    pub website: String,
    pub social_links: Vec<String>, // Vector of URLs for the social links
    pub description: String,
    pub project_video: String, // URL or string identifier for the project video
}


#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct SaleDetailsWithID {
    pub ledger_canister_id: String,
    pub sale_details: SaleDetails,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum TransferFromError {
    BadFee { expected_fee: Nat },
    BadBurn { min_burn_amount: Nat },
    InsufficientFunds { balance: Nat },
    InsufficientAllowance { allowance: Nat },
    TooOld,
    CreatedInFuture { ledger_time: u64 },
    Duplicate { duplicate_of: Nat },
    TemporarilyUnavailable,
    GenericError { error_code: Nat, message: String },
}

// Result type for transfer operations
#[derive(CandidType, Deserialize, Debug)]
pub enum TransferFromResult {
    Ok(Nat), // Icrc1BlockIndex is a nat
    Err(TransferFromError),
}