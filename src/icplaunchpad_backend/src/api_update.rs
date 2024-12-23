use std::sync::Arc;

use candid::{encode_one, Nat, Principal};
use ic_cdk::{
    api::{
        call::{call_with_payment128, CallResult, RejectionCode},
        management_canister::main::{CanisterInstallMode, WasmModule},
    },
    update,
};
use ic_ledger_types::Subaccount;

use crate::{
    create_canister, deposit_cycles, index_install_code, install_code, mutate_state, params::{self}, read_state, Account, CanisterIdRecord, CanisterIdWrapper, CoverImageData, CoverImageIdWrapper, CreateCanisterArgument, CreateFileInput, ImportedCanisterIdWrapper, IndexArg, IndexCanisterIdWrapper, IndexInitArgs, IndexInstallCodeArgument, InitArgs, InstallCodeArgument, LedgerArg, ProfileImageData, ProfileImageIdWrapper, ReturnResult, SaleDetails, SaleDetailsUpdate, SaleDetailsWrapper, SaleInputParams, TokenCreationResult, TokenImageData, TokenImageIdWrapper, U64Wrapper, UserAccount, UserAccountWrapper, UserInputParams
};

use canfund::api::cmc::IcCyclesMintingCanister;
use canfund::operations::fetch::FetchCyclesBalance;
use canfund::operations::obtain::MintCycles;
use canfund::{
    api::ledger::IcLedgerCanister,
    operations::{fetch::FetchCyclesBalanceFromCanisterStatus, obtain::ObtainCycles},
};

#[ic_cdk::update]
async fn fetch_canister_balance(canister_id: Principal) -> Result<u128, String> {
    ic_cdk::println!("Fetching cycles balance for canister ID: {}", canister_id);
    // Assuming you have the permission to call 'canister_status' on this canister.
    let fetcher =
        FetchCyclesBalanceFromCanisterStatus::new().with_proxy(Principal::management_canister()); // This is typically only permissible if 'canister_id' is managed by your principal.

    ic_cdk::println!("Fetching cycles balance from canister ID: {}", canister_id);
    let balance_result = fetcher.fetch_cycles_balance(canister_id).await;
    match balance_result {
        Ok(balance) => {
            ic_cdk::println!("Cycles balance for canister ID {}: {}", canister_id, balance);
            Ok(balance)
        }
        Err(e) => {
            ic_cdk::println!("Failed to fetch balance for canister ID {}: {:?}", canister_id, e);
            Err(format!("Failed to fetch balance: {:?}", e))
        }
    }
}

#[ic_cdk::update]
pub async fn obtain_cycles_for_canister(
    amount: u128,
    target_canister_id: Principal,
) -> Result<Nat, String> {
    ic_cdk::println!("Calling obtain_cycles_for_canister with amount: {} and target_canister_id: {}", amount, target_canister_id);
    let caller_principal = ic_cdk::api::caller();

    let mut from_subaccount_bytes = [0u8; 32];
    let caller_bytes = caller_principal.as_slice();
    from_subaccount_bytes[..caller_bytes.len()].copy_from_slice(caller_bytes);
    let from_subaccount = Subaccount(from_subaccount_bytes);

    // Mainnet Canister IDs for the Cycles Minting Canister (CMC) and the ICP Ledger
    let cmc_principal = Principal::from_text("rkp4c-7iaaa-aaaaa-aaaca-cai").unwrap();
    let ledger_principal = Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap();

    // Setup the cycle minting components
    let cmc = Arc::new(IcCyclesMintingCanister::new(cmc_principal));
    let ledger = Arc::new(IcLedgerCanister::new(ledger_principal));

    let mint_cycles = MintCycles {
        cmc,
        ledger,
        from_subaccount,
    };

    // Attempt to obtain cycles
    match mint_cycles.obtain_cycles(amount, target_canister_id).await {
        Ok(cycles) => {
            ic_cdk::println!("Successfully obtained {} cycles", cycles);
            Ok(Nat::from(cycles))
        }
        Err(e) => {
            ic_cdk::println!("Failed to obtain cycles with error: {}", e.details);
            Err(format!("Failed to obtain cycles: {}", e.details))
        }
    }
}

#[ic_cdk::update]
pub fn create_account(user_input: UserAccount) -> Result<String, String> {
    ic_cdk::println!("Starting account creation for username: {}", user_input.username);

    // Validate input fields
    if user_input.username.trim().is_empty() {
        ic_cdk::println!("Validation failed: Username is empty.");
        return Err("Username cannot be empty.".to_string());
    }
    if user_input.name.trim().is_empty() {
        ic_cdk::println!("Validation failed: Name is empty.");
        return Err("Name cannot be empty.".to_string());
    }

    // Check if the username is unique
    let is_unique = read_state(|state| {
        state
            .user_accounts
            .iter()
            .all(|(_, wrapper)| wrapper.user_account.username != user_input.username)
    });

    if !is_unique {
        ic_cdk::println!("Username '{}' already exists.", user_input.username);
        return Err("Username already exists.".to_string());
    }

    let principal = ic_cdk::api::caller();
    ic_cdk::println!("Caller principal: {}", principal);

    // Create a new UserAccount from the input struct
    let new_user_account = UserAccount {
        name: user_input.name.clone(),
        username: user_input.username.clone(),
        profile_picture: user_input.profile_picture.clone(),
        links: user_input.links.clone(),
        tag: user_input.tag.clone(),
    };

    // Store the new user account in the map
    mutate_state(|state| {
        state.user_accounts.insert(
            principal,
            UserAccountWrapper {
                user_account: new_user_account,
            },
        );
    });

    ic_cdk::println!("Account created successfully for principal: {}", principal);
    Ok("User Created Successfully!".to_string())
}

#[ic_cdk::update]
pub fn update_user_account(
    principal: Principal,
    updated_account: UserAccount,
) -> Result<(), String> {
    ic_cdk::println!("Attempting to update user account for principal: {}", principal);

    // Check if the user account exists
    let existing_user_account = read_state(|state| {
        state
            .user_accounts
            .get(&principal)
            .map(|wrapper| wrapper.clone())
    });

    if let Some(mut user_account_wrapper) = existing_user_account {
        ic_cdk::println!("User account found for principal: {}", principal);

        // Ensure the username remains unique if it has changed
        if user_account_wrapper.user_account.username != updated_account.username {
            ic_cdk::println!(
                "Username change detected. Checking uniqueness for new username: {}",
                updated_account.username
            );

            let is_unique = read_state(|state| {
                state
                    .user_accounts
                    .iter()
                    .all(|(_, wrapper)| wrapper.user_account.username != updated_account.username)
            });

            if !is_unique {
                ic_cdk::println!("Username '{}' already exists.", updated_account.username);
                return Err("Username already exists.".to_string());
            }

            // Update the username since it has passed the uniqueness check
            ic_cdk::println!("Username '{}' is unique. Proceeding with update.", updated_account.username);
            user_account_wrapper.user_account.username = updated_account.username.clone();
        }

        // Validate input fields
        if updated_account.name.trim().is_empty() {
            ic_cdk::println!("Validation failed: User name is empty.");
            return Err("User name cannot be empty.".to_string());
        }

        ic_cdk::println!("Updating user account fields for principal: {}", principal);
        // Update the user account fields
        user_account_wrapper.user_account.name = updated_account.name;
        user_account_wrapper.user_account.profile_picture = updated_account.profile_picture;
        user_account_wrapper.user_account.links = updated_account.links;
        user_account_wrapper.user_account.tag = updated_account.tag;

        // Reinsert the updated user account back into the map
        mutate_state(|state| {
            state.user_accounts.insert(principal, user_account_wrapper);
        });

        ic_cdk::println!("User account successfully updated for principal: {}", principal);
        Ok(())
    } else {
        ic_cdk::println!("User account not found for principal: {}", principal);
        Err("User account not found.".to_string())
    }
}

#[ic_cdk::update]
pub async fn create_token(user_params: UserInputParams) -> Result<TokenCreationResult, String> {
    let caller = ic_cdk::api::caller();
    ic_cdk::println!("Starting token creation for caller: {}", caller);

    // Ensure the user account exists before proceeding
    let account_exists = read_state(|state| state.user_accounts.contains_key(&caller));
    if !account_exists {
        ic_cdk::println!("Account does not exist for caller: {}", caller);
        return Err("Please create an account before creating a token.".into());
    }

    // Validate user_params
    if user_params.token_symbol.trim().is_empty() {
        ic_cdk::println!("Validation failed: Token symbol is empty.");
        return Err("Token symbol cannot be empty.".into());
    }
    if user_params.token_name.trim().is_empty() {
        ic_cdk::println!("Validation failed: Token name is empty.");
        return Err("Token name cannot be empty.".into());
    }
    if user_params.initial_balances.is_empty() {
        ic_cdk::println!("Validation failed: Initial balances are empty.");
        return Err("Initial balances cannot be empty.".into());
    }

    let arg = CreateCanisterArgument { settings: None };

    // Create ledger canister
    let (canister_id,) = create_canister(arg.clone())
        .await
        .map_err(|(_, err_string)| {
            ic_cdk::println!("Error creating ledger canister: {}", err_string);
            format!("Error creating ledger canister: {}", err_string)
        })?;
    ic_cdk::println!("Ledger canister created with ID: {:?}", canister_id);

    // Create index canister
    let (index_canister_id,) = create_canister(arg.clone())
        .await
        .map_err(|(_, err_string)| {
            ic_cdk::println!("Error creating index canister: {}", err_string);
            format!("Error creating index canister: {}", err_string)
        })?;
    ic_cdk::println!("Index canister created with ID: {:?}", index_canister_id);

    // Add cycles to the ledger canister
    deposit_cycles(canister_id, 150_000_000_000)
        .await
        .map_err(|(_, err_string)| {
            ic_cdk::println!("Error adding cycles to ledger canister: {}", err_string);
            format!("Error adding cycles to ledger canister: {}", err_string)
        })?;
    ic_cdk::println!("Cycles added to ledger canister: {:?}", canister_id);

    // Add cycles to the index canister
    deposit_cycles(index_canister_id, 100_000_000_000)
        .await
        .map_err(|(_, err_string)| {
            ic_cdk::println!("Error adding cycles to index canister: {}", err_string);
            format!("Error adding cycles to index canister: {}", err_string)
        })?;
    ic_cdk::println!("Cycles added to index canister: {:?}", index_canister_id);

    let canister_id_principal = canister_id.canister_id;
    let index_canister_id_principal = index_canister_id.canister_id;

    // Calculate total supply from initial balances
    let total_supply: Nat = user_params
        .initial_balances
        .iter()
        .fold(Nat::from(0u64), |acc, (_, balance)| acc + balance.clone());
    ic_cdk::println!("Calculated total supply: {}", total_supply);

    // Ledger Init Args
    let init_args = LedgerArg::Init(InitArgs {
        minting_account: params::MINTING_ACCOUNT.clone().unwrap(),
        fee_collector_account: Some(Account {
            owner: caller,
            subaccount: None,
        }),
        transfer_fee: params::TRANSFER_FEE.clone(),
        decimals: user_params.decimals,
        max_memo_length: Some(params::MAX_MEMO_LENGTH),
        token_symbol: user_params.token_symbol.clone(),
        token_name: user_params.token_name.clone(),
        metadata: vec![],
        initial_balances: user_params.initial_balances.clone(),
        feature_flags: Some(params::FEATURE_FLAGS),
        maximum_number_of_accounts: Some(params::MAXIMUM_NUMBER_OF_ACCOUNTS),
        accounts_overflow_trim_quantity: Some(params::ACCOUNTS_OVERFLOW_TRIM_QUANTITY),
        archive_options: params::ARCHIVE_OPTIONS.lock().unwrap().clone().unwrap(),
    });

    let init_arg: Vec<u8> = encode_one(init_args).map_err(|e| {
        ic_cdk::println!("Error encoding init args for ledger canister: {}", e);
        e.to_string()
    })?;

    let wasm_module =
        include_bytes!("../../../.dfx/local/canisters/token_deployer/token_deployer.wasm.gz")
            .to_vec();
    let index_wasm_module =
        include_bytes!("../../../.dfx/local/canisters/index_canister/index_canister.wasm.gz")
            .to_vec();

    let arg1 = InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: canister_id_principal,
        wasm_module: WasmModule::from(wasm_module.clone()),
        arg: init_arg.clone(),
    };

    // Index Init Args
    let index_init_args = IndexInitArgs {
        ledger_id: canister_id_principal,
        retrieve_blocks_from_ledger_interval_seconds: Some(10),
    };

    let index_arg = IndexArg::Init(index_init_args);
    let index_init_arg: Vec<u8> = encode_one(Some(index_arg)).map_err(|e| {
        ic_cdk::println!("Error encoding init args for index canister: {}", e);
        e.to_string()
    })?;

    let arg2 = IndexInstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: index_canister_id_principal,
        wasm_module: WasmModule::from(index_wasm_module.clone()),
        arg: index_init_arg,
    };

    // Install code for the ledger canister
    install_code(arg1.clone(), wasm_module)
        .await
        .map_err(|(code, msg)| {
            ic_cdk::println!("Error installing ledger code: {} - {}", code as u8, msg);
            format!("Error installing ledger code: {} - {}", code as u8, msg)
        })?;
    ic_cdk::println!("Ledger code installed successfully for canister ID: {:?}", canister_id_principal);

    // Update state with ledger canister details
    mutate_state(|state| {
        state.canister_ids.insert(
            canister_id_principal.to_string(),
            CanisterIdWrapper {
                canister_ids: canister_id_principal,
                token_name: user_params.token_name.clone(),
                token_symbol: user_params.token_symbol.clone(),
                image_id: None,
                ledger_id: Some(canister_id_principal),
                owner: caller,
                total_supply,
            },
        );
    });
    ic_cdk::println!("Ledger canister details updated in state.");

    // Install code for the index canister
    index_install_code(arg2, index_wasm_module)
        .await
        .map_err(|(code, msg)| {
            ic_cdk::println!("Error installing index code: {} - {}", code as u8, msg);
            format!("Error installing index code: {} - {}", code as u8, msg)
        })?;
    ic_cdk::println!("Index code installed successfully for canister ID: {:?}", index_canister_id_principal);

    // Update state with index canister details
    mutate_state(|state| {
        state.index_canister_ids.insert(
            index_canister_id_principal.to_string(),
            IndexCanisterIdWrapper {
                index_canister_ids: index_canister_id_principal,
            },
        )
    });
    ic_cdk::println!("Index canister details updated in state.");

    ic_cdk::println!("Token creation completed successfully for caller: {}", caller);
    Ok(TokenCreationResult {
        ledger_canister_id: canister_id_principal,
        index_canister_id: index_canister_id_principal,
    })
}

#[update]
pub async fn import_token(
    ledger_canister_id: Principal,
    optional_index_canister_id: Option<Principal>,
) -> Result<bool, String> {
    ic_cdk::println!("Importing ledger canister ID: {:?}", ledger_canister_id);
    let user_principal = ic_cdk::api::caller(); // Get the Principal of the caller (user)

    ic_cdk::println!("Checking if ledger canister ID is already imported...");
    // Check if the ledger_canister_id is already imported
    let already_exists = read_state(|state| {
        state
            .imported_canister_ids
            .values()
            .any(|wrapper| wrapper.ledger_canister_id == ledger_canister_id)
    });

    if already_exists {
        return Err(format!(
            "Ledger canister ID {:?} has already been imported.",
            ledger_canister_id
        ));
    }

    // Determine the index_canister_id
    let index_canister_id = if let Some(provided_index_id) = optional_index_canister_id {
        ic_cdk::println!("Using provided index canister ID: {:?}", provided_index_id);
        provided_index_id
    } else {
        ic_cdk::println!("Creating a new index canister...");
        // If index canister ID is not provided, create a new index canister
        let arg = CreateCanisterArgument { settings: None };

        let (created_index_canister_id,) =
            create_canister(arg.clone())
                .await
                .map_err(|(_, err_string)| {
                    ic_cdk::println!("Error creating index canister: {}", err_string);
                    format!("Error creating index canister: {}", err_string)
                })?;

        // Add cycles to the newly created index canister
        ic_cdk::println!("Adding cycles to the newly created index canister...");
        deposit_cycles(created_index_canister_id, 100_000_000_000)
            .await
            .map_err(|(_, err_string)| {
                ic_cdk::println!("Error adding cycles to index canister: {}", err_string);
                format!("Error adding cycles to index canister: {}", err_string)
            })?;

        let index_canister_id_principal = created_index_canister_id.canister_id;

        // Install the index canister with appropriate arguments
        ic_cdk::println!("Installing index canister with arguments...");
        let index_init_args = IndexInitArgs {
            ledger_id: ledger_canister_id,
            retrieve_blocks_from_ledger_interval_seconds: Some(10),
        };

        let index_arg = IndexArg::Init(index_init_args);
        let index_init_arg: Vec<u8> = encode_one(Some(index_arg)).map_err(|e| {
            ic_cdk::println!("Error encoding init args for index canister: {}", e);
            e.to_string()
        })?;

        let index_wasm_module =
            include_bytes!("../../../.dfx/local/canisters/index_canister/index_canister.wasm.gz")
                .to_vec();

        let arg = IndexInstallCodeArgument {
            mode: CanisterInstallMode::Install,
            canister_id: index_canister_id_principal,
            wasm_module: WasmModule::from(index_wasm_module.clone()),
            arg: index_init_arg,
        };

        ic_cdk::println!("Installing index code...");
        index_install_code(arg, index_wasm_module)
            .await
            .map_err(|(code, msg)| {
                ic_cdk::println!("Error installing index code: {} - {}", code as u8, msg);
                format!("Error installing index code: {} - {}", code as u8, msg)
            })?;

        index_canister_id_principal
    };

    // Store the ledger and index canister IDs in the `imported_canister_ids` map
    mutate_state(|state| {
        state.imported_canister_ids.insert(
            ledger_canister_id.to_string(), // Use the ledger canister ID as the key
            ImportedCanisterIdWrapper {
                caller: user_principal,
                ledger_canister_id,
                index_canister_id, // Store the index canister ID
            },
        );
    });

    ic_cdk::println!(
        "Token ledger canister ID {:?} and index canister ID {:?} imported successfully by {:?}",
        ledger_canister_id,
        index_canister_id,
        user_principal
    );

    Ok(true)
}

#[ic_cdk::update]
async fn deposit_cycles_to_canister(arg: CanisterIdRecord, cycles: u128) -> CallResult<()> {
    call_with_payment128(
        Principal::management_canister(),
        "deposit_cycles",
        (arg,),
        cycles,
    )
    .await
}

#[ic_cdk::update]
pub async fn upload_token_image(
    asset_canister_id: String,
    image_data: TokenImageData,
) -> Result<String, String> {
    let principal = ic_cdk::api::caller();
    ic_cdk::println!("Caller principal: {}", principal);

    // Validate inputs
    if image_data.content.is_none() {
        ic_cdk::println!("Validation failed: Image content is empty.");
        return Err("Image content cannot be empty.".to_string());
    }
    ic_cdk::println!("Image content validated.");

    // Convert the asset canister ID to a Principal
    let asset_canister_principal = Principal::from_text(&asset_canister_id)
        .map_err(|_| {
            ic_cdk::println!("Invalid asset canister ID: {}", asset_canister_id);
            format!("Invalid asset canister ID: {}", asset_canister_id)
        })?;
    ic_cdk::println!("Asset canister principal: {}", asset_canister_principal);

    // Create input for the file upload
    let input = CreateFileInput {
        name: "token_image.png".to_string(),
        content_type: "image/png".to_string(),
        size: None,
        content: image_data.content.clone(),
        status: Some(1),
        hash: None,
        ert: None,
        crc32: None,
    };
    ic_cdk::println!("File input created for upload.");

    // Make the call to the asset canister to create the file
    let response: CallResult<(ReturnResult,)> =
        ic_cdk::call(asset_canister_principal, "create_file", (input,)).await;
    ic_cdk::println!("Received response from asset canister.");

    match response {
        Ok((Ok(image_id),)) => {
            ic_cdk::println!("Image uploaded successfully with ID: {}", image_id);
            // Update the image ID in the state mapping after successful upload
            mutate_state(|state| {
                ic_cdk::println!("Updating state with new image ID.");
                state.token_image_ids.insert(principal.to_string(), TokenImageIdWrapper { image_id });
            });

            Ok(format!(
                "Token image uploaded successfully with ID: {}",
                image_id
            ))
        },
        Ok((Err(err),)) => {
            ic_cdk::println!("Error from asset canister: {}", err);
            Err(format!("Error from asset canister: {}", err))
        },
        Err((code, message)) => {
            ic_cdk::println!("Error with rejection code {:?}: {}", code, message);
            match code {
                RejectionCode::NoError => Err("Unexpected error with NoError rejection code.".to_string()),
                RejectionCode::SysFatal => Err("System fatal error occurred.".to_string()),
                RejectionCode::SysTransient => Err("Transient system error occurred. Please retry.".to_string()),
                RejectionCode::DestinationInvalid => Err("Invalid destination canister.".to_string()),
                RejectionCode::CanisterReject => Err(format!("Canister rejected the request: {}", message)),
                _ => Err(format!("Unknown rejection code: {:?}: {}", code, message)),
            }
        },
    }
}





#[ic_cdk::update]
pub async fn upload_profile_image(
    asset_canister_id: String,
    image_data: ProfileImageData,
) -> Result<String, String> {
    let principal = ic_cdk::api::caller();
    ic_cdk::println!("Caller principal: {}", principal);

    // Validate inputs
    if image_data.content.is_none() {
        ic_cdk::println!("Validation failed: Image content is empty.");
        return Err("Image content cannot be empty.".to_string());
    }
    ic_cdk::println!("Image content validated.");

    // Convert the asset canister ID to a Principal
    let asset_canister_principal = Principal::from_text(&asset_canister_id)
        .map_err(|_| {
            ic_cdk::println!("Invalid asset canister ID: {}", asset_canister_id);
            format!("Invalid asset canister ID: {}", asset_canister_id)
        })?;
    ic_cdk::println!("Asset canister principal: {}", asset_canister_principal);

    // Create input for the file upload
    let input = CreateFileInput {
        name: "profile_image.png".to_string(),
        content_type: "image/png".to_string(),
        size: None,
        content: image_data.content.clone(),
        status: Some(1),
        hash: None,
        ert: None,
        crc32: None,
    };
    ic_cdk::println!("File input created for upload.");

    // Make the call to the asset canister to create the file
    let response: CallResult<(ReturnResult,)> =
        ic_cdk::call(asset_canister_principal, "create_file", (input,)).await;
    ic_cdk::println!("Received response from asset canister.");

    match response {
        Ok((Ok(image_id),)) => {
            ic_cdk::println!("Image uploaded successfully with ID: {}", image_id);
            // Update the image ID in the state mapping after successful upload
            mutate_state(|state| {
                ic_cdk::println!("Updating state with new image ID.");
                state
                    .profile_image_ids
                    .insert(principal.to_string(), ProfileImageIdWrapper { image_id });
            });

            Ok(format!(
                "Profile image uploaded successfully with ID: {}",
                image_id
            ))
        }
        Ok((Err(err),)) => {
            ic_cdk::println!("Error from asset canister: {}", err);
            Err(format!("Error from asset canister: {}", err))
        }
        Err((code, message)) => {
            ic_cdk::println!("Error with rejection code {:?}: {}", code, message);
            match code {
                RejectionCode::NoError => {
                    Err("Unexpected error with NoError rejection code.".to_string())
                }
                RejectionCode::SysFatal => Err("System fatal error occurred.".to_string()),
                RejectionCode::SysTransient => {
                    Err("Transient system error occurred. Please retry.".to_string())
                }
                RejectionCode::DestinationInvalid => Err("Invalid destination canister.".to_string()),
                RejectionCode::CanisterReject => {
                    Err(format!("Canister rejected the request: {}", message))
                }
                _ => Err(format!("Unknown rejection code: {:?}: {}", code, message)),
            }
        }
    }
}

#[ic_cdk::update]
pub async fn upload_cover_image(
    asset_canister_id: String,
    image_data: CoverImageData,
) -> Result<String, String> {
    ic_cdk::println!("Starting upload_cover_image with asset_canister_id: {}", asset_canister_id);

    // Validate inputs
    if image_data.content.is_none() {
        ic_cdk::println!("Validation failed: Image content is empty.");
        return Err("Image content cannot be empty.".to_string());
    }
    ic_cdk::println!("Image content validated.");

    // Create input for the file upload
    let input = CreateFileInput {
        name: "cover_image.png".to_string(),
        content_type: "image/png".to_string(),
        size: None,
        content: image_data.content.clone(),
        status: Some(1), // Status for fully filled
        hash: None,
        ert: None,
        crc32: None,
    };
    ic_cdk::println!("File input created for upload.");

    // Attempt to create the Principal from the asset_canister_id
    let principal = Principal::from_text(&asset_canister_id).map_err(|_| {
        ic_cdk::println!("Invalid asset canister ID: {}", asset_canister_id);
        format!("Invalid asset canister ID: {}", asset_canister_id)
    })?;
    ic_cdk::println!("Asset canister principal: {}", principal);

    // Make the call to the asset canister to create the file
    let response: CallResult<(ReturnResult,)> =
        ic_cdk::call(principal, "create_file", (input,)).await;
    ic_cdk::println!("Received response from asset canister.");

    // Handle the response and update the state accordingly
    match response {
        Ok((Ok(image_id),)) => {
            ic_cdk::println!("Image uploaded successfully with ID: {}", image_id);
            // Store the cover image ID with the ledger_id in the cover_image_ids map
            mutate_state(|state| {
                let ledger_id_str = image_data.ledger_id.to_string();
                ic_cdk::println!("Updating state with new cover image ID for ledger_id: {}", ledger_id_str);

                // Insert or update the cover image ID in the cover_image_ids map
                state
                    .cover_image_ids
                    .insert(ledger_id_str, CoverImageIdWrapper { image_id });
            });

            Ok(format!(
                "Cover image uploaded successfully with ID: {}",
                image_id
            ))
        }
        Ok((Err(err),)) => {
            ic_cdk::println!("Error from asset canister: {}", err);
            Err(format!("Error from asset canister: {}", err))
        }
        Err((code, message)) => {
            ic_cdk::println!("Error with rejection code {:?}: {}", code, message);
            match code {
                RejectionCode::NoError => {
                    Err("Unexpected error with NoError rejection code.".to_string())
                }
                RejectionCode::SysFatal => Err("System fatal error occurred.".to_string()),
                RejectionCode::SysTransient => {
                    Err("Transient system error occurred. Please retry.".to_string())
                }
                RejectionCode::DestinationInvalid => Err("Invalid destination canister.".to_string()),
                RejectionCode::CanisterReject => {
                    Err(format!("Canister rejected the request: {}", message))
                }
                _ => Err(format!("Unknown rejection code: {:?}: {}", code, message)),
            }
        }
    }
}

#[ic_cdk::update]
pub fn create_sale(
    ledger_canister_id: Principal,
    sale_input: SaleInputParams, // Use the updated struct with hardcap included
) -> Result<u64, String> {
    let caller = ic_cdk::api::caller(); // Get the caller's principal

    ic_cdk::println!("Starting create_sale with caller: {}", caller);

    // Validate input parameters
    if sale_input.hardcap < sale_input.softcap {
        ic_cdk::println!("Validation failed: Hardcap cannot be less than the softcap.");
        return Err("Hardcap cannot be less than the softcap.".to_string());
    }
    if sale_input.start_time_utc >= sale_input.end_time_utc {
        ic_cdk::println!("Validation failed: Start time must be before the end time.");
        return Err("Start time must be before the end time.".to_string());
    }
    if sale_input.liquidity_percentage < 51 || sale_input.liquidity_percentage > 100 {
        ic_cdk::println!("Validation failed: Liquidity percentage must be between 51 and 100.");
        return Err("Liquidity percentage must be between 51 and 100.".to_string());
    }

    ic_cdk::println!("Validation passed.");

    // Populate the full SaleDetails struct with auto-calculated fields
    let mut sale_details = SaleDetails {
        creator: caller, // Assign the creator as the caller
        start_time_utc: sale_input.start_time_utc,
        end_time_utc: sale_input.end_time_utc,
        hardcap: sale_input.hardcap,
        softcap: sale_input.softcap,
        min_contribution: sale_input.min_contribution,
        max_contribution: sale_input.max_contribution,
        tokens_for_fairlaunch: sale_input.tokens_for_fairlaunch,
        liquidity_percentage: sale_input.liquidity_percentage,
        website: sale_input.website,
        social_links: sale_input.social_links,
        description: sale_input.description,
        project_video: sale_input.project_video,
        processed: false,                  // Set processed to false by default
        tokens_for_liquidity_after_fee: 0, // Will be calculated
        tokens_for_approval: 0,            // Will be calculated
        fee_for_approval: 0,               // Will be calculated
        is_ended: false,                   // Initialize is_ended as false
    };

    ic_cdk::println!("Sale details populated.");

    // Auto-calculate the necessary fields
    sale_details.calculate_and_store_liquidity_tokens_after_fee(); // Calculate liquidity-related fields
    sale_details.calculate_approval_amounts(); // Calculate approval amounts (tokens for approval, etc.)

    ic_cdk::println!("Sale details auto-calculated.");

    // Clone sale_details before saving in the state
    let sale_details_clone = sale_details.clone();

    // Save the sale details and initialize funds_raised in the state
    mutate_state(|state| {
        // Insert sale details
        if state
            .sale_details
            .insert(
                ledger_canister_id,
                SaleDetailsWrapper {
                    sale_details: sale_details_clone,
                },
            )
            .is_some()
        {
            ic_cdk::println!("Sale details already exist for ledger canister ID: {}", ledger_canister_id);
            return Err(format!(
                "Sale details already exist for ledger canister ID: {}",
                ledger_canister_id
            ));
        }

        // Initialize funds_raised for this sale
        state.funds_raised.insert(ledger_canister_id, U64Wrapper(0));

        ic_cdk::println!("Sale details saved and funds_raised initialized.");
        Ok(())
    })?;

    // Return the total tokens to approve (calculated automatically)
    ic_cdk::println!("Returning total tokens to approve: {}", sale_details.tokens_for_approval);
    Ok(sale_details.tokens_for_approval)
}

#[ic_cdk::update]
pub fn update_sale_params(
    ledger_canister_id: Principal,
    updated_details: SaleDetailsUpdate,
) -> Result<(), String> {
    ic_cdk::println!("update_sale_params: ledger_canister_id: {}", ledger_canister_id);
    ic_cdk::println!("update_sale_params: updated_details: {:?}", updated_details);

    let caller = ic_cdk::api::caller(); // Get the caller's principal

    mutate_state(|state| {
        if let Some(wrapper) = state.sale_details.get(&ledger_canister_id) {
            ic_cdk::println!("update_sale_params: wrapper: {:?}", wrapper);

            if wrapper.sale_details.creator != caller {
                ic_cdk::println!("update_sale_params: Unauthorized, only the creator can update the sale details.");
                return Err(
                    "Unauthorized: Only the creator can update the sale details.".to_string(),
                );
            }

            let mut sale_details = wrapper.sale_details.clone(); // Clone the sale details to update them

            ic_cdk::println!("update_sale_params: Before updating: sale_details: {:?}", sale_details);

            // Updating various fields if provided
            if let Some(start_time) = updated_details.start_time_utc {
                if start_time > sale_details.end_time_utc {
                    ic_cdk::println!("update_sale_params: Error: Start time cannot be after the end time.");
                    return Err("Start time cannot be after the end time.".to_string());
                }
                sale_details.start_time_utc = start_time;
            }
            if let Some(end_time) = updated_details.end_time_utc {
                if end_time < sale_details.start_time_utc {
                    ic_cdk::println!("update_sale_params: Error: End time cannot be before the start time.");
                    return Err("End time cannot be before the start time.".to_string());
                }
                sale_details.end_time_utc = end_time;
            }
            if let Some(website) = updated_details.website {
                if website.trim().is_empty() {
                    ic_cdk::println!("update_sale_params: Error: Website URL cannot be empty.");
                    return Err("Website URL cannot be empty.".to_string());
                }
                sale_details.website = website;
            }
            if let Some(social_links) = updated_details.social_links {
                if social_links.is_empty() {
                    ic_cdk::println!("update_sale_params: Error: Social links cannot be empty.");
                    return Err("Social links cannot be empty.".to_string());
                }
                sale_details.social_links = social_links;
            }
            if let Some(description) = updated_details.description {
                if description.trim().is_empty() {
                    ic_cdk::println!("update_sale_params: Error: Description cannot be empty.");
                    return Err("Description cannot be empty.".to_string());
                }
                sale_details.description = description;
            }
            if let Some(project_video) = updated_details.project_video {
                if project_video.trim().is_empty() {
                    ic_cdk::println!("update_sale_params: Error: Project video URL cannot be empty.");
                    return Err("Project video URL cannot be empty.".to_string());
                }
                sale_details.project_video = project_video;
            }

            ic_cdk::println!("update_sale_params: After updating: sale_details: {:?}", sale_details);

            // Reinsert the updated wrapper back into the stable map
            state
                .sale_details
                .insert(ledger_canister_id, SaleDetailsWrapper { sale_details });

            ic_cdk::println!("update_sale_params: Updated sale details successfully.");

            Ok(())
        } else {
            ic_cdk::println!("update_sale_params: Error: Sale details not found for ledger_canister_id: {}", ledger_canister_id);
            Err(format!(
                "Sale details not found for ledger_canister_id: {}",
                ledger_canister_id
            ))
        }
    })
}

#[ic_cdk::update]
pub fn insert_funds_raised(ledger_canister_id: Principal, amount: u64) -> Result<(), String> {
    if amount == 0 {
        return Err("Amount to insert cannot be zero.".to_string());
    }

    mutate_state(|state| {
        let new_amount = U64Wrapper(amount);

        // Update or insert the funds
        let updated_amount = match state.funds_raised.get(&ledger_canister_id) {
            Some(existing) => {
                let total = existing.0.checked_add(new_amount.0).ok_or_else(|| {
                    format!(
                        "Overflow error: Total funds raised for ledger ID {} exceed u64 limit.",
                        ledger_canister_id
                    )
                })?;
                U64Wrapper(total)
            }
            None => new_amount,
        };

        state
            .funds_raised
            .insert(ledger_canister_id, updated_amount);

        Ok(())
    })
}
