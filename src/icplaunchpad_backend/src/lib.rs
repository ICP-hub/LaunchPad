use candid::{encode_one, CandidType, Nat, Principal};
use ic_cdk::{
    api::{
        call::{call_with_payment128, CallResult},
        canister_version,
        management_canister::main::{CanisterInstallMode, WasmModule},
    }, export_candid, query, update
};
use serde::{Deserialize, Serialize};
use state_handler::{mutate_state, read_state, CanisterIdWrapper};
mod state_handler;


#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct Account {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>,
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

#[derive(CandidType, Serialize, Deserialize, Debug)]
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

#[derive(CandidType, Serialize, Deserialize)]
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

// create canister
async fn create_canister(
    arg: CreateCanisterArgument, // cycles: u128,
) -> CallResult<(CanisterIdRecord,)> {
    let extended_arg = CreateCanisterArgumentExtended {
        settings: arg.settings,
        sender_canister_version: Some(canister_version()),
    };
    let cycles: u128 = 100_000_000_000;

    call_with_payment128(
        Principal::management_canister(),
        "create_canister",
        (extended_arg,),
        cycles,
    )
    .await
}

async fn deposit_cycles(arg: CanisterIdRecord, cycles: u128) -> CallResult<()> {
    call_with_payment128(
        Principal::management_canister(),
        "deposit_cycles",
        (arg,),
        cycles,
    )
    .await
}

async fn install_code(arg: InstallCodeArgument, wasm_module: Vec<u8>) -> CallResult<()> {
    let cycles: u128 = 10_000_000_000;

    let extended_arg = InstallCodeArgumentExtended {
        mode: arg.mode,
        canister_id: arg.canister_id,
        wasm_module: WasmModule::from(wasm_module),
        arg: arg.arg,
        sender_canister_version: Some(canister_version()),
    };

    call_with_payment128(
        Principal::management_canister(),
        "install_code",
        (extended_arg,),
        cycles,
    )
    .await
}

#[update]
pub async fn create_token(params: TokenParams) -> Result<String, String> {
    // // Print the user inputted token params for debugging
    // ic_cdk::println!("Token Symbol: {:?}", params.token_symbol);
    // ic_cdk::println!("Token Name: {:?}", params.token_name);
    // ic_cdk::println!("Decimals: {:?}", params.decimals);
    // ic_cdk::println!("Minting Account Owner: {:?}", params.minting_account.owner);
    // ic_cdk::println!("Minting Account Subaccount: {:?}", params.minting_account.subaccount);
    // ic_cdk::println!("Transfer Fee: {:?}", params.transfer_fee);
    // ic_cdk::println!("Metadata: {:?}", params.metadata);
    // ic_cdk::println!("Feature Flags: {:?}", params.feature_flags);
    // ic_cdk::println!("Initial Balances: {:?}", params.initial_balances);
    // ic_cdk::println!("Archive Options: {:?}", params.archive_options);
    // ic_cdk::println!("Maximum Number of Accounts: {:?}", params.maximum_number_of_accounts);
    // ic_cdk::println!("Accounts Overflow Trim Quantity: {:?}", params.accounts_overflow_trim_quantity);
    // ic_cdk::println!("Fee Collector Account: {:?}", params.fee_collector_account);
    // ic_cdk::println!("Max Memo Length: {:?}", params.max_memo_length);

    let arg = CreateCanisterArgument { settings: None };
    let (canister_id,) = match create_canister(arg).await {
        Ok(id) => id,
        Err((_, err_string)) => {
            ic_cdk::println!("error in canister id");
            return Err(format!("Error: {}", err_string));
        }
    };

    let _addcycles = deposit_cycles(canister_id, 100000000).await.unwrap();
    let canister_id_principal = canister_id.canister_id;

    let init_args = LedgerArg::Init(InitArgs {
        minting_account: params.minting_account,
        fee_collector_account: params.fee_collector_account,
        transfer_fee: params.transfer_fee,
        decimals: params.decimals,
        max_memo_length: params.max_memo_length,
        token_symbol: params.token_symbol,
        token_name: params.token_name,
        metadata: params.metadata,
        initial_balances: params.initial_balances,
        feature_flags: params.feature_flags,
        maximum_number_of_accounts: params.maximum_number_of_accounts,
        accounts_overflow_trim_quantity: params.accounts_overflow_trim_quantity,
        archive_options: params.archive_options,
    });

    let init_arg = encode_one(init_args).map_err(|e| e.to_string())?;

    let wasm_module = include_bytes!("../../../.dfx/local/canisters/token_deployer/token_deployer.wasm.gz").to_vec();

    let arg1 = InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: canister_id_principal,
        wasm_module: WasmModule::from(wasm_module.clone()),
        arg: init_arg,
    };

    match install_code(arg1, wasm_module).await {
        Ok(_) => {
            ic_cdk::println!("Canister ID: {:?}", canister_id_principal.to_string());

            // Store the canister ID
            mutate_state(|state| {
                state.canister_ids.insert(canister_id_principal.to_string(), CanisterIdWrapper {
                    canister_id: canister_id_principal,
                });
            });

            Ok(format!("Canister ID: {}", canister_id_principal.to_string()))
        }
        Err((code, msg)) => {
            ic_cdk::println!("Error installing code: {} - {}", code as u8, msg);
            Err(format!("Error installing code: {} - {}", code as u8, msg))
        }
    }
}

#[query]
pub fn get_all_canister_ids() -> Vec<String> {
    read_state(|state| {
        state.canister_ids.iter().map(|(key, _)| key.clone()).collect()
    })
}


export_candid!();
