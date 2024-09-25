use candid::{encode_one, CandidType, Nat, Principal};
use ic_cdk::{
    api::{
        call::{call_with_payment128, CallResult, RejectionCode},
        canister_version,
        management_canister::main::{CanisterInstallMode, WasmModule},
    }, export_candid, update
};
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;
use state_handler::{mutate_state, read_state, CanisterIdWrapper, ImageIdWrapper, IndexCanisterIdWrapper, SaleDetails, SaleDetailsWrapper};
mod state_handler;
mod params;
mod transaction;



#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
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
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct CanisterIndexInfo {
    pub canister_id: String,
    pub index_canister_id: String,
    pub token_name: String,       
    pub token_symbol: String, 
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

async fn index_install_code(arg: IndexInstallCodeArgument, wasm_module: Vec<u8>) -> CallResult<()> {
    let cycles: u128 = 10_000_000_000;

    let extended_arg = IndexInstallCodeArgumentExtended {
        mode: arg.mode,
        arg: arg.arg,
        canister_id: arg.canister_id,
        wasm_module: WasmModule::from(wasm_module),
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
pub async fn create_token(user_params: UserInputParams) -> Result<(String, String), String> {
    let arg = CreateCanisterArgument { settings: None };
    
    // Create ledger canister
    let (canister_id,) = match create_canister(arg.clone()).await {
        Ok(id) => id,
        Err((_, err_string)) => {
            ic_cdk::println!("error in canister id");
            return Err(format!("Error: {}", err_string));
        }
    };
    
    // Create index canister
    let (index_canister_id,) = match create_canister(arg.clone()).await {
        Ok(id) => id,
        Err((_, err_string)) => {
            ic_cdk::println!("error in canister id");
            return Err(format!("Error: {}", err_string));
        }
    };

    let _addcycles = deposit_cycles(canister_id, 150_000_000_000).await.unwrap();
    let _addcycles_index = deposit_cycles(index_canister_id, 100_000_000_000).await.unwrap();
    let canister_id_principal = canister_id.canister_id;
    let index_canister_id_principal = index_canister_id.canister_id;

    let minting_account = params::MINTING_ACCOUNT.lock().unwrap().clone().map_err(|e| e.to_string())?;

    // Handle potential error from FEE_COLLECTOR_ACCOUNT
    let fee_collector_account = params::FEE_COLLECTOR_ACCOUNT.lock().unwrap().clone().map_err(|e| e.to_string())?;

    // Handle potential error from ARCHIVE_OPTIONS
    let archive_options = params::ARCHIVE_OPTIONS.lock().unwrap().clone().map_err(|e| e.to_string())?;


    // Ledger Init Args
    let init_args = LedgerArg::Init(InitArgs {
        minting_account, // Hardcoded value from params.rs
        fee_collector_account: Some(fee_collector_account), // Hardcoded value from params.rs
        transfer_fee: params::TRANSFER_FEE.clone(), // Hardcoded value
        decimals: user_params.decimals, // User-supplied value
        max_memo_length: Some(params::MAX_MEMO_LENGTH), // Hardcoded value
        token_symbol: user_params.token_symbol.clone(),  // User-supplied value
        token_name: user_params.token_name.clone(),  // User-supplied value
        metadata: vec![], // Empty or pre-defined metadata if needed
        initial_balances: user_params.initial_balances, // User-supplied value
        feature_flags: Some(params::FEATURE_FLAGS), // Hardcoded value
        maximum_number_of_accounts: Some(params::MAXIMUM_NUMBER_OF_ACCOUNTS), // Hardcoded value
        accounts_overflow_trim_quantity: Some(params::ACCOUNTS_OVERFLOW_TRIM_QUANTITY), // Hardcoded value
        archive_options, // Hardcoded value from params.rs
    });

    let init_arg: Vec<u8> = encode_one(init_args).map_err(|e| e.to_string())?;

    let wasm_module = include_bytes!("../../../.dfx/local/canisters/token_deployer/token_deployer.wasm.gz").to_vec();
    let index_wasm_module = include_bytes!("../../../.dfx/local/canisters/index_canister/index_canister.wasm.gz").to_vec();

    let arg1: InstallCodeArgument = InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: canister_id_principal,
        wasm_module: WasmModule::from(wasm_module.clone()),
        arg: init_arg.clone(),
    };

    // Index Init Args
    let index_init_args = IndexInitArgs {
        ledger_id: canister_id_principal,
    };
    let index_init_arg: Vec<u8> = encode_one(index_init_args).map_err(|e| e.to_string())?;

    let arg2: IndexInstallCodeArgument = IndexInstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: index_canister_id_principal,
        wasm_module: WasmModule::from(index_wasm_module.clone()),
        arg: index_init_arg,
    };

    // Install code for the ledger canister
    match install_code(arg1.clone(), wasm_module).await {
        Ok(_) => {
            mutate_state(|state| {
                state.canister_ids.insert(canister_id_principal.to_string(), CanisterIdWrapper {
                    canister_ids: canister_id_principal,
                    token_name: user_params.token_name.clone(),  // Store token name
                    token_symbol: user_params.token_symbol.clone(),  // Store token symbol
                });
            });
        }
        Err((code, msg)) => {
            ic_cdk::println!("Error installing code: {} - {}", code as u8, msg);
            return Err(format!("Error installing code: {} - {}", code as u8, msg));
        }
    }

    // Install code for the index canister
    match index_install_code(arg2, index_wasm_module).await {
        Ok(_) => {
            mutate_state(|state|{ 
                state.index_canister_ids.insert(index_canister_id_principal.to_string(), IndexCanisterIdWrapper {
                    index_canister_ids : index_canister_id_principal,
                })
            });
            Ok((canister_id_principal.to_string(), index_canister_id_principal.to_string()))
        }
        Err((code, msg)) => {
            Err(format!("Error installing index code: {} - {}", code as u8, msg))
        }
    }
}


#[ic_cdk::query]
pub fn get_tokens_info() -> Vec<CanisterIndexInfo> {
    read_state(|state| {
        state.canister_ids.iter().zip(state.index_canister_ids.iter()).map(|((canister_key, canister_wrapper), (index_key, _))| {
            CanisterIndexInfo {
                canister_id: canister_key.clone(),
                index_canister_id: index_key.clone(),
                token_name: canister_wrapper.token_name.clone(),   // Include token name
                token_symbol: canister_wrapper.token_symbol.clone(), // Include token symbol
            }
        }).collect()
    })
}

#[ic_cdk::query]
pub fn search_by_token_name(token_name: String) -> Option<CanisterIndexInfo> {
    read_state(|state| {
        // Iterate through the canister_ids map
        for (canister_key, canister_wrapper) in state.canister_ids.iter() {
            // Check if the token_name matches
            if canister_wrapper.token_name == token_name {
                // Find the corresponding index canister
                let index_canister_id = state.index_canister_ids.get(&canister_key).map(|index_wrapper| index_wrapper.index_canister_ids.to_string()).unwrap_or_default();

                // Return the relevant CanisterIndexInfo
                return Some(CanisterIndexInfo {
                    canister_id: canister_key.clone(),
                    index_canister_id,
                    token_name: canister_wrapper.token_name.clone(),
                    token_symbol: canister_wrapper.token_symbol.clone(),
                });
            }
        }
        None // Return None if no matching token name is found
    })
}



#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct ImageData {
    pub content: Option<ByteBuf>,
    pub name: String,
    pub content_type: String,
    // you can add more params
}

type ReturnResult = Result<u32, String>;

#[ic_cdk::update]
pub async fn upload_image(canister_id: String, image_data: ImageData) -> Result<String, String> {
    let response: CallResult<(ReturnResult,)> = ic_cdk::call(
        Principal::from_text(canister_id).unwrap(),
        "create_file",
        (image_data,)
    ).await;

    let res0: Result<(Result<u32, String>,), (RejectionCode, String)> = response;

    let formatted_value = match res0 {
        Ok((Ok(image_id),)) => {
            // Store the image ID in stable memory
            mutate_state(|state| {
                state.image_ids.insert(format!("{}", image_id), ImageIdWrapper { image_id });
            });
            Ok(format!("{}", image_id))
        }
        Ok((Err(err),)) => Err(err),
        Err((code, message)) => {
            match code {
                RejectionCode::NoError => Err("NoError".to_string()),
                RejectionCode::SysFatal => Err("SysFatal".to_string()),
                RejectionCode::SysTransient => Err("SysTransient".to_string()),
                RejectionCode::DestinationInvalid => Err("DestinationInvalid".to_string()),
                RejectionCode::CanisterReject => Err("CanisterReject".to_string()),
                _ => Err(format!("Unknown rejection code: {:?}: {}", code, message)),
            }
        }
    };

    formatted_value
}


#[ic_cdk::query]
pub fn get_image_ids() -> Vec<u32> {
    // Read the image_ids map and collect all image IDs stored in stable memory
    read_state(|state| {
        let mut image_ids = Vec::new();
        for (_, image_wrapper) in state.image_ids.iter() {
            image_ids.push(image_wrapper.image_id);
        }
        image_ids
    })
}



#[ic_cdk::update]
pub fn store_sale_params(
    ledger_canister_id: Principal,
    sale_details: SaleDetails,
) -> Result<(), String> {
    // Store the SaleDetails in stable memory using the ledger_canister_id
    mutate_state(|state| {
        if state
            .sale_details
            .insert(ledger_canister_id.to_string(), SaleDetailsWrapper { sale_details })
            .is_none()  // Handle the insert result, as it returns Option
        {
            Ok(())
        } else {
            Err("Failed to store sale details.".into())
        }
    })
}

#[ic_cdk::query]
pub fn get_sale_params(ledger_canister_id: Principal) -> Result<SaleDetails, String> {
    // Retrieve the sale parameters from stable memory using ledger_canister_id
    let sale_details = read_state(|state| {
        state.sale_details.get(&ledger_canister_id.to_string()).map(|wrapper| wrapper.sale_details.clone())
    }).ok_or("Sale details not found")?;

    // Return the sale details
    Ok(sale_details)
}


#[ic_cdk_macros::update]
async fn convert_icp_to_cycles(amount: u64) -> Result<Nat, String> {
    let icp_amount = Tokens::from_e8s(amount);

    // Call the mint_cycles function
    match mint_cycles(icp_amount).await {
        Ok(cycles) => Ok(cycles),
        Err(err) => Err(format!("Failed to mint cycles: {:?}", err)),
    }
}



export_candid!();