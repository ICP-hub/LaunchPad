use candid::{encode_one, CandidType, Nat, Principal};
use ic_cdk::{
    api::{
        call::{call_with_payment128, CallResult, RejectionCode},
        canister_version,
        management_canister::main::{CanisterInstallMode, WasmModule},

    }, export_candid
};
use ic_ledger_types::Tokens;
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;
use state_handler::{mutate_state, read_state, CanisterIdWrapper, IndexCanisterIdWrapper, SaleDetails, SaleDetailsWrapper, UserAccountWrapper, STATE};
mod state_handler;
mod params;
mod transaction;
use mint_cycles::mint_cycles;
use crate::state_handler::ImageIdWrapper;

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
pub struct UserAccount {
    pub name: String,
    pub username: String,
    pub profile_picture: Option<ByteBuf>,  // Placeholder for profile picture data
    pub links: Vec<String>,  // Social media links
    pub tag: String,  // User's role like block explorer, investor, etc.
}

#[ic_cdk::update]
pub fn create_user_account(user_input: UserAccount) -> Result<(), String> {
    // Check if the username is unique
    let is_unique = STATE.with(|state| {
        state.borrow().user_accounts.iter().all(|(_, wrapper)| {
            wrapper.user_account.username != user_input.username
        })
    });

    if !is_unique {
        return Err("Username already exists".to_string());
    }

    let principal = ic_cdk::api::caller();

    // Create a new UserAccount from the input struct
    let new_user_account = UserAccount {
        name: user_input.name,
        username: user_input.username,
        profile_picture: user_input.profile_picture,
        links: user_input.links,
        tag: user_input.tag,
    };

    // Store the new user account in the map
    mutate_state(|state| {
        state.user_accounts.insert(principal, UserAccountWrapper {
            user_account: new_user_account,
        });
    });

    Ok(())
}


#[ic_cdk::query]
pub fn get_user_account(principal: Principal) -> Option<UserAccount> {
    read_state(|state| {
        state.user_accounts.get(&principal).map(|wrapper| wrapper.user_account.clone())
    })
}

#[ic_cdk::query]
pub fn get_user_by_username(username: String) -> Option<UserAccount> {
    read_state(|state| {
        for (_, wrapper) in state.user_accounts.iter() {
            if wrapper.user_account.username == username {
                return Some(wrapper.user_account.clone());
            }
        }
        None
    })
}

#[ic_cdk::query]
pub fn is_account_created() -> String {
    let caller = ic_cdk::api::caller();

    read_state(|state| {
        if state.user_accounts.contains_key(&caller) {
            format!("Account for principal {} is already created.", caller)
        } else {
            format!("Account for principal {} has not been created yet.", caller)
        }
    })
}




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
    trusted_origins: Vec<String>,
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


#[ic_cdk::update]
pub async fn create_token(user_params: UserInputParams) -> Result<TokenCreationResult, String> {

    let arg = CreateCanisterArgument { settings: None };

    // Create ledger canister
    let (canister_id,) = match create_canister(arg.clone()).await {
        Ok(id) => id,
        Err((_, err_string)) => {
            ic_cdk::println!("Error creating ledger canister: {}", err_string);
            return Err(format!("Error: {}", err_string));
        }
    };

    // Create index canister
    let (index_canister_id,) = match create_canister(arg.clone()).await {
        Ok(id) => id,
        Err((_, err_string)) => {
            ic_cdk::println!("Error creating index canister: {}", err_string);
            return Err(format!("Error: {}", err_string));
        }
    };

    // Add cycles to the ledger canister
    if let Err((_, err_string)) = deposit_cycles(canister_id, 150_000_000_000).await {
        ic_cdk::println!("Error adding cycles to ledger canister: {}", err_string);
        return Err(format!("Error: {}", err_string));
    }

    // Add cycles to the index canister
    if let Err((_, err_string)) = deposit_cycles(index_canister_id, 100_000_000_000).await {
        ic_cdk::println!("Error adding cycles to index canister: {}", err_string);
        return Err(format!("Error: {}", err_string));
    }

    let canister_id_principal = canister_id.canister_id;
    let index_canister_id_principal = index_canister_id.canister_id;

    let minting_account = params::MINTING_ACCOUNT
        .lock()
        .unwrap()
        .clone()
        .map_err(|e| e.to_string())?;

    // Handle potential error from FEE_COLLECTOR_ACCOUNT
    let fee_collector_account = params::FEE_COLLECTOR_ACCOUNT
        .lock()
        .unwrap()
        .clone()
        .map_err(|e| e.to_string())?;

    // Handle potential error from ARCHIVE_OPTIONS
    let archive_options = params::ARCHIVE_OPTIONS
        .lock()
        .unwrap()
        .clone()
        .map_err(|e| e.to_string())?;

    // Ledger Init Args
    let init_args = LedgerArg::Init(InitArgs {
        minting_account,                          // Hardcoded value from params.rs
        fee_collector_account: Some(fee_collector_account), // Hardcoded value from params.rs
        transfer_fee: params::TRANSFER_FEE.clone(),       // Hardcoded value
        decimals: user_params.decimals,           // User-supplied value
        max_memo_length: Some(params::MAX_MEMO_LENGTH),   // Hardcoded value
        token_symbol: user_params.token_symbol.clone(),   // User-supplied value
        token_name: user_params.token_name.clone(),       // User-supplied value
        metadata: vec![],                          // Empty or pre-defined metadata if needed
        initial_balances: user_params.initial_balances,   // User-supplied value
        feature_flags: Some(params::FEATURE_FLAGS),       // Hardcoded value
        maximum_number_of_accounts: Some(params::MAXIMUM_NUMBER_OF_ACCOUNTS), // Hardcoded value
        accounts_overflow_trim_quantity: Some(params::ACCOUNTS_OVERFLOW_TRIM_QUANTITY), // Hardcoded value
        archive_options,                          // Hardcoded value from params.rs
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
        ledger_id: canister_id_principal,               // Ledger canister ID
        retrieve_blocks_from_ledger_interval_seconds: Some(10),  // 10 seconds
    };

    // Wrap the IndexInitArgs in a variant { Init }
    let index_arg = IndexArg::Init(index_init_args);

    // Log index init args for debugging
    ic_cdk::println!("Index init args: {:?}", index_arg);

    // Encode the variant
    let index_init_arg: Vec<u8> = encode_one(Some(index_arg)).map_err(|e| {
        ic_cdk::println!("Error encoding init args for index canister: {}", e);
        e.to_string()
    })?;

    let arg2: IndexInstallCodeArgument = IndexInstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: index_canister_id_principal,
        wasm_module: WasmModule::from(index_wasm_module.clone()),
        arg: index_init_arg,  // Pass the encoded init argument
    };

    // Install code for the ledger canister
    match install_code(arg1.clone(), wasm_module).await {
        Ok(_) => {
            mutate_state(|state| {
                state.canister_ids.insert(
                    canister_id_principal.to_string(), 
                    CanisterIdWrapper {
                        canister_ids: canister_id_principal,
                        token_name: user_params.token_name.clone(),  // Store token name
                        token_symbol: user_params.token_symbol.clone(),  // Store token symbol
                        image_id: None,  // Set image_id as None for now
                        ledger_id: Some(canister_id_principal),  // Set ledger_id to the canister ID
                    }
                );
            });
        }
        Err((code, msg)) => {
            ic_cdk::println!("Error installing ledger code: {} - {}", code as u8, msg);
            return Err(format!("Error installing ledger code: {} - {}", code as u8, msg));
        }
    }

    // Install code for the index canister
    match index_install_code(arg2, index_wasm_module).await {
        Ok(_) => {
            mutate_state(|state| {
                state.index_canister_ids.insert(
                    index_canister_id_principal.to_string(),
                    IndexCanisterIdWrapper {
                        index_canister_ids: index_canister_id_principal,
                    },
                )
            });

            Ok(TokenCreationResult {
                ledger_canister_id: canister_id_principal,
                index_canister_id: index_canister_id_principal,
            })
        }
        Err((code, msg)) => {
            ic_cdk::println!("Error installing index code: {} - {}", code as u8, msg);
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

type ReturnResult = Result<u32, String>;

#[ic_cdk::update]
pub async fn upload_token_image(asset_canister_id: String, image_data: TokenImageData) -> Result<String, String> {
    let ledger_id = image_data.ledger_id;
    
    // Ensure the mandatory fields for CreateFileInput
    let input = CreateFileInput {
        name: "token_image.png".to_string(),   // Example name for token images
        content_type: "image/png".to_string(), // Default content type for images
        size: None,                           // You can calculate or leave None
        content: image_data.content.clone(),  // Pass the content received from the struct
        status: Some(1),                      // Example status, can customize as needed
        hash: None,                           // Optional, but can calculate SHA-256 if needed
        ert: None,                            // Optional field
        crc32: None,                          // Optional, can calculate checksum if needed
    };

    let response: CallResult<(ReturnResult,)> = ic_cdk::call(
        Principal::from_text(asset_canister_id.clone()).unwrap(),
        "create_file",
        (input,)
    ).await;

    let res0: Result<(Result<u32, String>,), (RejectionCode, String)> = response;

    let formatted_value = match res0 {
        Ok((Ok(image_id),)) => {
            // Store image_id and ledger_id in the state
            mutate_state(|state| {
                if let Some(mut canister_entry) = state.canister_ids.get(&ledger_id.to_string()) {
                    canister_entry.image_id = Some(image_id);
                    canister_entry.ledger_id = Some(ledger_id);
                    state.canister_ids.insert(ledger_id.to_string(), canister_entry);
                }
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
pub fn get_token_image_ids() -> Vec<(u32, Principal)> {
    let mut image_ledger_pairs = Vec::new();
    
    read_state(|state| {
        for (_ledger_id, canister_entry) in state.canister_ids.iter() {
            if let Some(image_id) = canister_entry.image_id {
                if let Some(ledger_id) = canister_entry.ledger_id {
                    // Only return image_id and ledger_id
                    image_ledger_pairs.push((image_id, ledger_id));
                }
            }
        }
    });

    image_ledger_pairs
}

#[ic_cdk::query]
pub fn get_token_image_id(ledger_id: Principal) -> Option<u32> {
    read_state(|state| {
        // Search for the given ledger_id in the canister_ids map
        state.canister_ids.get(&ledger_id.to_string()).and_then(|canister_entry| {
            // Return the image_id if available
            canister_entry.image_id
        })
    })
}


#[ic_cdk::update]
pub async fn upload_profile_image(asset_canister_id: String, image_data: ProfileImageData) -> Result<String, String> {
    let principal = ic_cdk::api::caller();  // Get the caller's principal

    // Ensure the mandatory fields for CreateFileInput
    let input = CreateFileInput {
        name: "profile_image.png".to_string(),   // Example name for profile images
        content_type: "image/png".to_string(),   // Default content type for images
        size: None,                             // You can calculate or leave None
        content: image_data.content.clone(),    // Pass the content received from the struct
        status: Some(1),                        // Example status, can customize as needed
        hash: None,                             // Optional, but can calculate SHA-256 if needed
        ert: None,                              // Optional field
        crc32: None,                            // Optional, can calculate checksum if needed
    };

    let response: CallResult<(ReturnResult,)> = ic_cdk::call(
        Principal::from_text(asset_canister_id.clone()).unwrap(),
        "create_file",
        (input,)
    ).await;

    let res0: Result<(Result<u32, String>,), (RejectionCode, String)> = response;

    let formatted_value = match res0 {
        Ok((Ok(image_id),)) => {
            // Store image_id and principal in the state for the profile image
            mutate_state(|state| {
                state.image_ids.insert(
                    principal.to_string(),
                    ImageIdWrapper {
                        image_id,
                    }
                );
            });

            Ok(format!("Profile image uploaded with ID: {}", image_id))
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
pub fn get_profile_image_id() -> Option<u32> {
    let principal = ic_cdk::api::caller();  // Get the caller's principal

    read_state(|state| {
        state.image_ids.get(&principal.to_string()).map(|wrapper| wrapper.image_id)
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


#[ic_cdk::update]
async fn convert_icp_to_cycles(amount: u64) -> Result<Nat, String> {
    let icp_amount = Tokens::from_e8s(amount);

    // Call the mint_cycles function
    match mint_cycles(icp_amount).await {
        Ok(cycles) => Ok(cycles),
        Err(err) => Err(format!("Failed to mint cycles: {:?}", err)),
    }
}

pub async fn icrc28_trusted_origins() -> Icrc28TrustedOriginsResponse {
    let trusted_origins = vec![
        "https://ajzka-lyaaa-aaaak-ak5rq-cai.icp0.io".to_string(),
        "http://localhost:3000".to_string(),
        "http://avqkn-guaaa-aaaaa-qaaea-cai.localhost:4943".to_string(),
        "http://127.0.0.1:4943/?canisterId=aoymu-gaaaa-aaaak-ak5ra-cai".to_string(),
        "http://127.0.0.1:4943".to_string(),
        "http://localhost:4200".to_string(),
    ];

    Icrc28TrustedOriginsResponse {
        trusted_origins,
    }
}


export_candid!();