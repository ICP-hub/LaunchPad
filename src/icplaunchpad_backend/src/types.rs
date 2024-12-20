use candid::{CandidType, Nat, Principal};
use ic_cdk::api::management_canister::main::{CanisterInstallMode, WasmModule};
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;

use crate::state_handler::*;

pub struct State {
    pub canister_ids: CanisterIdsMap,
    pub index_canister_ids: IndexCanisterIdsMap,
    pub image_ids: ImageIdsMap,
    pub sale_details: SaleDetailsMap,
    pub user_accounts: UserAccountsMap,
    pub cover_image_ids: CoverImageIdsMap,
    pub funds_raised: FundsRaisedMap,
    pub contributions: ContributionsMap,
    pub imported_canister_ids: ImportedCanisterIdsMap,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
pub struct UserAccount {
    pub name: String,
    pub username: String,
    pub profile_picture: Option<ByteBuf>, // Placeholder for profile picture data
    pub links: Vec<String>,               // Social media links
    pub tag: Vec<String>,                 // User's role like block explorer, investor, etc.
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

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct CanisterIndexInfo {
    pub canister_id: String,
    pub index_canister_id: String,
    pub token_name: String,
    pub token_symbol: String,
    pub total_supply: Nat,
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

#[derive(
    CandidType,
    Deserialize,
    Serialize,
    Debug,
    Clone,
    Copy,
    PartialEq,
    Eq,
    PartialOrd,
    Ord,
    Hash,
    Default,
)]
pub struct U64Wrapper(pub u64);

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
    pub content: Option<ByteBuf>, // The image content for the cover image
    pub ledger_id: Principal,     // Ledger ID associated with the cover image
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

#[derive(CandidType, Deserialize, Debug, Clone)]
pub struct CanisterIdWrapper {
    pub canister_ids: Principal,
    pub token_name: String,
    pub token_symbol: String,
    pub image_id: Option<u32>,
    pub ledger_id: Option<Principal>,
    pub owner: Principal,
    pub total_supply: Nat,
}

#[derive(CandidType, Deserialize, Debug, Clone)]
pub enum TokenInfo {
    UserCreated {
        canister_id: CanisterIdWrapper,
        index_canister_id: IndexCanisterIdWrapper, 
    },
    Imported {
        ledger_canister_id: Principal,
        index_canister_id: Principal,
        caller: Principal,
    },
}

#[derive(CandidType, Deserialize, Debug, Clone)]
pub struct ImportedCanisterIdWrapper {
    pub caller: Principal,
    pub ledger_canister_id: Principal,
    pub index_canister_id: Principal, // Add this field
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
pub struct SaleInputParams {
    pub tokens_for_fairlaunch: u64, // Tokens allocated for fairlaunch
    pub softcap: u64,               // Minimum funds to be raised
    pub max_contribution: u64,      // Maximum contribution per user
    pub min_contribution: u64,      // Minimum contribution per user
    pub description: String,        // Project description
    pub liquidity_percentage: u8,   // Percentage of funds allocated to DEX liquidity
    pub website: String,            // Project website URL
    pub social_links: Vec<String>,  // List of social media links
    pub project_video: String,      // URL for project video
    pub creator: Principal,         // Creator of the sale (user input)
    pub start_time_utc: u64,        // Start time of the sale (user input)
    pub end_time_utc: u64,          // End time of the sale (user input)
    pub hardcap: u64,               // Hardcap for the sale (user input)
}

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct SaleDetails {
    pub creator: Principal,         // Principal of the user who created the sale
    pub start_time_utc: u64,        // Start time of the sale (UTC timestamp)
    pub end_time_utc: u64,          // End time of the sale (UTC timestamp)
    pub hardcap: u64,               // Maximum funds to be raised (in ICP or other base currency)
    pub softcap: u64,               // Minimum funds to be raised (in ICP or other base currency)
    pub min_contribution: u64,      // Minimum contribution per user (in ICP or other base currency)
    pub max_contribution: u64,      // Maximum contribution per user (in ICP or other base currency)
    pub tokens_for_fairlaunch: u64, // Total tokens allocated for the fairlaunch
    pub liquidity_percentage: u8,   // Percentage of funds allocated to DEX liquidity
    pub website: String,            // Project website URL
    pub social_links: Vec<String>,  // List of social media links
    pub description: String,        // Project description
    pub project_video: String,      // URL or string identifier for the project video
    pub processed: bool,            // Processed flag, initialized as false by default
    pub tokens_for_liquidity_after_fee: u64, // Store the liquidity tokens after the fee
    pub tokens_for_approval: u64,   // Amount of tokens for fairlaunch + liquidity for approval
    pub fee_for_approval: u64,      // Amount of the 5% fee for approval
    pub is_ended: bool,
}

impl SaleDetails {
    // Method to calculate the tokens for liquidity based on the liquidity percentage
    pub fn calculate_tokens_for_liquidity(&self) -> u64 {
        (self.tokens_for_fairlaunch * self.liquidity_percentage as u64) / 100
    }

    // Method to calculate and store the adjusted liquidity tokens after the fee
    pub fn calculate_and_store_liquidity_tokens_after_fee(&mut self) {
        let liquidity_tokens = self.calculate_tokens_for_liquidity();
        let fee_on_tokens_for_liquidity = (liquidity_tokens * 5) / 100; // 5% fee on liquidity tokens
        self.tokens_for_liquidity_after_fee = liquidity_tokens - fee_on_tokens_for_liquidity;
    }

    // Method to calculate the total amount of tokens to approve for the sale
    pub fn calculate_approval_amounts(&mut self) {
        // Calculate liquidity tokens based on liquidity percentage of fairlaunch tokens
        let liquidity_tokens = self.calculate_tokens_for_liquidity();

        // Calculate the fee on liquidity tokens (5% fee)
        let fee_on_tokens_for_liquidity = (liquidity_tokens * 5) / 100;

        // Calculate the liquidity tokens after the fee is deducted
        let tokens_for_liquidity_after_fee = liquidity_tokens - fee_on_tokens_for_liquidity;

        // Total tokens to approve is the sum of:
        // 1. Fairlaunch tokens (no fee involved here)
        // 2. Liquidity tokens after fee (these are the tokens the user needs to approve, already deducted the fee)
        // 3. The fee on liquidity tokens (this will be transferred to the fee collector)
        let total_tokens_to_approve = self.tokens_for_fairlaunch
            + tokens_for_liquidity_after_fee
            + fee_on_tokens_for_liquidity;

        // Set the approval amounts
        self.tokens_for_approval = total_tokens_to_approve;
        self.fee_for_approval = fee_on_tokens_for_liquidity;
    }


}


impl Default for SaleDetails {
    fn default() -> Self {
        Self {
            creator: Principal::anonymous(),
            start_time_utc: 0,
            end_time_utc: 0,
            hardcap: 0,
            softcap: 0,
            min_contribution: 0,
            max_contribution: 0,
            tokens_for_fairlaunch: 0,
            liquidity_percentage: 0,
            website: String::new(),
            social_links: vec![],
            description: String::new(),
            project_video: String::new(),
            processed: false,
            tokens_for_liquidity_after_fee: 0,
            tokens_for_approval: 0,
            fee_for_approval: 0,
            is_ended: false, // Default value
        }
    }
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

#[derive(CandidType, Deserialize, Serialize, Debug)]
pub struct RefundParams {
    pub ledger_canister_id: Principal, // The sale's ledger ID
}

#[derive(CandidType, Debug, Clone, Serialize, Deserialize)]
pub struct AddPoolArgs {
    pub token_0: String,
    pub amount_0: Nat,
    pub tx_id_0: Option<TxId>,
    pub token_1: String,
    pub amount_1: Nat,
    pub tx_id_1: Option<TxId>,
    pub lp_fee_bps: Option<u8>,
    pub kong_fee_bps: Option<u8>,
    pub on_kong: Option<bool>,
}

#[derive(CandidType, Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum TxId {
    BlockIndex(Nat),
    TransactionHash(String),
}

#[derive(CandidType, Debug, Clone, Serialize, Deserialize)]
pub struct AddPoolReply {
    pub tx_id: u64,
    pub symbol: String,
    pub request_id: u64,
    pub status: String,
    pub chain_0: String,
    pub symbol_0: String,
    pub amount_0: Nat,
    pub balance_0: Nat,
    pub chain_1: String,
    pub symbol_1: String,
    pub amount_1: Nat,
    pub balance_1: Nat,
    pub add_lp_token_amount: Nat,
    pub lp_fee_bps: u8,
    pub lp_token_symbol: String,
    pub transfer_ids: Vec<TransferIdReply>,
    pub claim_ids: Vec<u64>,
    pub on_kong: bool,
    pub ts: u64,
}

#[derive(CandidType, Debug, Clone, Serialize, Deserialize)]
pub struct TransferIdReply {
    pub transfer_id: u64,
    pub transfer: TransferReply,
}

#[derive(CandidType, Debug, Clone, Serialize, Deserialize)]
pub enum TransferReply {
    IC(ICTransferReply),
}

#[derive(CandidType, Debug, Clone, Serialize, Deserialize)]
pub struct ICTransferReply {
    pub chain: String,
    pub symbol: String,
    pub is_send: bool, // from user's perspective. so if is_send is true, it means the user is sending the token
    pub amount: Nat,
    pub canister_id: String,
    pub block_index: Nat,
}