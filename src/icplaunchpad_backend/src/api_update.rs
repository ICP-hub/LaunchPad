use std::sync::Arc;

use candid::{encode_one, Nat, Principal};
use ic_cdk::{api::{
    call::{call_with_payment128, CallResult, RejectionCode},
    management_canister::main::{CanisterInstallMode, WasmModule},
}, caller, update};
use ic_ledger_types::Subaccount;

use crate::{
    create_canister, deposit_cycles, index_install_code, install_code, mutate_state, params::{self}, read_state, Account, CanisterIdRecord, CanisterIdWrapper, CoverImageData, CoverImageIdWrapper, CreateCanisterArgument, CreateFileInput, ImageIdWrapper, ImportedCanisterIdWrapper, IndexArg, IndexCanisterIdWrapper, IndexInitArgs, IndexInstallCodeArgument, InitArgs, InstallCodeArgument, LedgerArg, ProfileImageData, ReturnResult, SaleDetails, SaleDetailsUpdate, SaleDetailsWrapper, SaleInputParams, TokenCreationResult, TokenImageData, U64Wrapper, UserAccount, UserAccountWrapper, UserInputParams, STATE
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
    // Assuming you have the permission to call 'canister_status' on this canister.
    let fetcher =
        FetchCyclesBalanceFromCanisterStatus::new().with_proxy(Principal::management_canister()); // This is typically only permissible if 'canister_id' is managed by your principal.

    let balance_result = fetcher.fetch_cycles_balance(canister_id).await;
    balance_result.map_err(|e| format!("Failed to fetch balance: {:?}", e))
}

#[ic_cdk::update]
pub async fn obtain_cycles_for_canister(
    amount: u128,
    target_canister_id: Principal,
) -> Result<Nat, String> {
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
            ic_cdk::api::print(format!("Successfully obtained {} cycles", cycles));
            Ok(Nat::from(cycles))
        }
        Err(e) => {
            let error_message = format!("Failed to obtain cycles: {}", e.details);
            ic_cdk::api::print(&error_message);
            Err(error_message)
        }
    }
}

#[ic_cdk::update]
pub fn create_account(user_input: UserAccount) -> Result<(), String> {
    // Validate input first
    if user_input.username.trim().is_empty() || user_input.name.trim().is_empty() {
        return Err("Username and name cannot be empty".to_string());
    }

    // Check if the username is unique
    let is_unique = STATE.with(|state| {
        state
            .borrow()
            .user_accounts
            .iter()
            .all(|(_, wrapper)| wrapper.user_account.username != user_input.username)
    });

    if !is_unique {
        return Err("Username already exists".to_string());
    }

    let principal = ic_cdk::api::caller();

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

    Ok(())
}

#[ic_cdk::update]
pub fn update_user_account(
    principal: Principal,
    updated_account: UserAccount,
) -> Result<(), String> {
    // Check if the user account exists
    let existing_user_account = STATE.with(|state| state.borrow().user_accounts.get(&principal));

    if let Some(user_account_wrapper) = existing_user_account {
        let mut user_account_wrapper = user_account_wrapper.clone();

        // Ensure the username remains unique if it has changed
        if user_account_wrapper.user_account.username != updated_account.username {
            let is_unique =
                STATE.with(|state| {
                    state.borrow().user_accounts.iter().all(|(_, wrapper)| {
                        wrapper.user_account.username != updated_account.username
                    })
                });

            if !is_unique {
                return Err("Username already exists".to_string());
            }

            // Update the username since it has passed the uniqueness check
            user_account_wrapper.user_account.username = updated_account.username.clone();
        }

        // Update the user account fields
        user_account_wrapper.user_account.name = updated_account.name;
        user_account_wrapper.user_account.profile_picture = updated_account.profile_picture;
        user_account_wrapper.user_account.links = updated_account.links;
        user_account_wrapper.user_account.tag = updated_account.tag; // Now handling Vec<String>

        // Reinsert the updated user account back into the map
        mutate_state(|state| {
            state.user_accounts.insert(principal, user_account_wrapper);
        });

        Ok(())
    } else {
        Err("User account not found".to_string())
    }
}

#[ic_cdk::update]
pub async fn create_token(user_params: UserInputParams) -> Result<TokenCreationResult, String> {
    let caller = ic_cdk::api::caller();

    // Ensure the user account exists before proceeding
    let account_exists = read_state(|state| state.user_accounts.contains_key(&caller));
    if !account_exists {
        return Err("Please create an account before creating a token.".into());
    }

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

    // Calculate total supply from initial balances
    let total_supply: Nat = user_params
        .initial_balances
        .iter()
        .fold(Nat::from(0u64), |acc, (_, balance)| acc + balance.clone());

    // Ledger Init Args with blackhole address as the minter
    let init_args = LedgerArg::Init(InitArgs {
        minting_account: params::MINTING_ACCOUNT.clone().unwrap(), // Blackhole address as the minter
        fee_collector_account: Some(Account {
            owner: caller,
            subaccount: None,
        }), // Caller as fee collector
        transfer_fee: params::TRANSFER_FEE.clone(),                // Hardcoded value
        decimals: user_params.decimals,                            // User-supplied value
        max_memo_length: Some(params::MAX_MEMO_LENGTH),            // Hardcoded value
        token_symbol: user_params.token_symbol.clone(),            // User-supplied value
        token_name: user_params.token_name.clone(),                // User-supplied value
        metadata: vec![], // Empty or pre-defined metadata if needed
        initial_balances: user_params.initial_balances.clone(), // Clone of the user-supplied value
        feature_flags: Some(params::FEATURE_FLAGS), // Hardcoded value
        maximum_number_of_accounts: Some(params::MAXIMUM_NUMBER_OF_ACCOUNTS), // Hardcoded value
        accounts_overflow_trim_quantity: Some(params::ACCOUNTS_OVERFLOW_TRIM_QUANTITY), // Hardcoded value
        archive_options: params::ARCHIVE_OPTIONS.lock().unwrap().clone().unwrap(), // Hardcoded value from params.rs
    });

    let init_arg: Vec<u8> = encode_one(init_args).map_err(|e| e.to_string())?;

    let wasm_module =
        include_bytes!("../../../.dfx/local/canisters/token_deployer/token_deployer.wasm.gz")
            .to_vec();
    let index_wasm_module =
        include_bytes!("../../../.dfx/local/canisters/index_canister/index_canister.wasm.gz")
            .to_vec();

    let arg1: InstallCodeArgument = InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: canister_id_principal,
        wasm_module: WasmModule::from(wasm_module.clone()),
        arg: init_arg.clone(),
    };

    // Index Init Args
    let index_init_args = IndexInitArgs {
        ledger_id: canister_id_principal, // Ledger canister ID
        retrieve_blocks_from_ledger_interval_seconds: Some(10), // 10 seconds
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
        arg: index_init_arg, // Pass the encoded init argument
    };

    // Install code for the ledger canister
    match install_code(arg1.clone(), wasm_module).await {
        Ok(_) => {
            mutate_state(|state| {
                state.canister_ids.insert(
                    canister_id_principal.to_string(),
                    CanisterIdWrapper {
                        canister_ids: canister_id_principal,
                        token_name: user_params.token_name.clone(), // Store token name
                        token_symbol: user_params.token_symbol.clone(), // Store token symbol
                        image_id: None,                             // Set image_id as None for now
                        ledger_id: Some(canister_id_principal),
                        owner: caller,
                        total_supply, // Store the calculated total supply
                    },
                );
            });
        }
        Err((code, msg)) => {
            ic_cdk::println!("Error installing ledger code: {} - {}", code as u8, msg);
            return Err(format!(
                "Error installing ledger code: {} - {}",
                code as u8, msg
            ));
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

            // Return result with the blackhole address info for frontend
            Ok(TokenCreationResult {
                ledger_canister_id: canister_id_principal,
                index_canister_id: index_canister_id_principal,
            })
        }
        Err((code, msg)) => {
            ic_cdk::println!("Error installing index code: {} - {}", code as u8, msg);
            return Err(format!(
                "Error installing index code: {} - {}",
                code as u8, msg
            ));
        }
    }
}

#[update]
pub fn import_token(ledger_canister_id: Principal) {
    let user_principal = caller();  // Get the Principal of the caller (user)
    
    // Create an ImportedCanisterIdWrapper with the user principal and ledger canister ID
    let wrapper = ImportedCanisterIdWrapper {
        caller: user_principal,
        ledger_canister_id,
    };

    // Store the user's principal and the corresponding ledger canister ID wrapper in stable memory
    mutate_state(|state| {
        state.imported_canister_ids.insert(user_principal.to_string(), wrapper);
    });

    ic_cdk::println!("Token ledger canister ID imported successfully by {:?}", user_principal);
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
    let ledger_id = image_data.ledger_id;

    // Ensure the mandatory fields for CreateFileInput
    let input = CreateFileInput {
        name: "token_image.png".to_string(), // Example name for token images
        content_type: "image/png".to_string(), // Default content type for images
        size: None,                          // You can calculate or leave None
        content: image_data.content.clone(), // Pass the content received from the struct
        status: Some(1),                     // Example status, can customize as needed
        hash: None,                          // Optional, but can calculate SHA-256 if needed
        ert: None,                           // Optional field
        crc32: None,                         // Optional, can calculate checksum if needed
    };

    let response: CallResult<(ReturnResult,)> = ic_cdk::call(
        Principal::from_text(asset_canister_id.clone()).unwrap(),
        "create_file",
        (input,),
    )
    .await;

    let res0: Result<(Result<u32, String>,), (RejectionCode, String)> = response;

    let formatted_value = match res0 {
        Ok((Ok(image_id),)) => {
            // Store image_id and ledger_id in the state
            mutate_state(|state| {
                if let Some(mut canister_entry) = state.canister_ids.get(&ledger_id.to_string()) {
                    canister_entry.image_id = Some(image_id);
                    canister_entry.ledger_id = Some(ledger_id);
                    state
                        .canister_ids
                        .insert(ledger_id.to_string(), canister_entry);
                }
            });

            Ok(format!("{}", image_id))
        }
        Ok((Err(err),)) => Err(err),
        Err((code, message)) => match code {
            RejectionCode::NoError => Err("NoError".to_string()),
            RejectionCode::SysFatal => Err("SysFatal".to_string()),
            RejectionCode::SysTransient => Err("SysTransient".to_string()),
            RejectionCode::DestinationInvalid => Err("DestinationInvalid".to_string()),
            RejectionCode::CanisterReject => Err("CanisterReject".to_string()),
            _ => Err(format!("Unknown rejection code: {:?}: {}", code, message)),
        },
    };

    formatted_value
}

#[ic_cdk::update]
pub async fn upload_profile_image(
    asset_canister_id: String,
    image_data: ProfileImageData,
) -> Result<String, String> {
    let principal = ic_cdk::api::caller(); // Get the caller's principal

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

    let response: CallResult<(ReturnResult,)> = ic_cdk::call(
        Principal::from_text(asset_canister_id.clone()).unwrap(),
        "create_file",
        (input,),
    )
    .await;

    match response {
        Ok((Ok(image_id),)) => {
            // Update the image ID in the state mapping after successful upload
            mutate_state(|state| {
                state
                    .image_ids
                    .insert(principal.to_string(), ImageIdWrapper { image_id });
            });

            Ok(format!(
                "Profile image uploaded and updated with ID: {}",
                image_id
            ))
        }
        Ok((Err(err),)) => Err(err),
        Err((code, message)) => match code {
            RejectionCode::NoError => Err("NoError".to_string()),
            RejectionCode::SysFatal => Err("SysFatal".to_string()),
            RejectionCode::SysTransient => Err("SysTransient".to_string()),
            RejectionCode::DestinationInvalid => Err("DestinationInvalid".to_string()),
            RejectionCode::CanisterReject => Err("CanisterReject".to_string()),
            _ => Err(format!("Unknown rejection code: {:?}: {}", code, message)),
        },
    }
}

#[ic_cdk::update]
pub async fn upload_cover_image(
    asset_canister_id: String,
    image_data: CoverImageData,
) -> Result<String, String> {
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

    // Make the call to the asset canister to create the file
    let response: CallResult<(ReturnResult,)> = ic_cdk::call(
        Principal::from_text(asset_canister_id.clone()).unwrap(),
        "create_file",
        (input,),
    )
    .await;

    // Handle the response and update the state accordingly
    match response {
        Ok((Ok(image_id),)) => {
            // Store the cover image ID with the ledger_id in the cover_image_ids map
            mutate_state(|state| {
                let ledger_id_str = image_data.ledger_id.to_string();

                // Insert or update the cover image ID in the cover_image_ids map
                state
                    .cover_image_ids
                    .insert(ledger_id_str, CoverImageIdWrapper { image_id });
            });

            Ok(format!(
                "Cover image uploaded and updated with ID: {}",
                image_id
            ))
        }
        Ok((Err(err),)) => Err(err),
        Err((code, message)) => match code {
            RejectionCode::NoError => Err("NoError".to_string()),
            RejectionCode::SysFatal => Err("SysFatal".to_string()),
            RejectionCode::SysTransient => Err("SysTransient".to_string()),
            RejectionCode::DestinationInvalid => Err("DestinationInvalid".to_string()),
            RejectionCode::CanisterReject => Err("CanisterReject".to_string()),
            _ => Err(format!("Unknown rejection code: {:?}: {}", code, message)),
        },
    }
}


#[ic_cdk::update]
pub fn create_sale(
    ledger_canister_id: Principal,
    sale_input: SaleInputParams, // Use the updated struct with hardcap included
) -> Result<u64, String> {
    let caller = ic_cdk::api::caller(); // Get the caller's principal

    // Populate the full SaleDetails struct with auto-calculated fields
    let mut sale_details = SaleDetails {
        creator: caller, // Now we take the creator from user input
        start_time_utc: sale_input.start_time_utc,
        end_time_utc: sale_input.end_time_utc,
        hardcap: sale_input.hardcap, // Take hardcap from user input
        softcap: sale_input.softcap,
        min_contribution: sale_input.min_contribution,
        max_contribution: sale_input.max_contribution,
        tokens_for_fairlaunch: sale_input.tokens_for_fairlaunch,
        liquidity_percentage: sale_input.liquidity_percentage,
        website: sale_input.website,
        social_links: sale_input.social_links,
        description: sale_input.description,
        project_video: sale_input.project_video,
        processed: false, // Set processed to false by default
        tokens_for_liquidity_after_fee: 0, // Will be calculated
        tokens_for_approval: 0,            // Will be calculated
        fee_for_approval: 0,               // Will be calculated
        is_ended: false,                   // Add is_ended field and initialize as false
    };

    // Auto-calculate the necessary fields
    sale_details.calculate_and_store_liquidity_tokens_after_fee(); // Automatically calculates liquidity-related fields
    sale_details.calculate_approval_amounts(); // Automatically calculates the approval amounts (tokens for approval, etc.)

    // Clone sale_details before passing into mutate_state
    let sale_details_clone = sale_details.clone();

    // Save the sale details in the state
    mutate_state(|state| {
        if state
            .sale_details
            .insert(
                ledger_canister_id.to_string(),
                SaleDetailsWrapper {
                    sale_details: sale_details_clone,
                },
            )
            .is_none()
        {
            Ok(())
        } else {
            Err("Sale details already exist for this ledger canister ID.".to_string())
            // Explicit String conversion
        }
    })?;

    // Return the total tokens to approve (calculated automatically)
    Ok(sale_details.tokens_for_approval)
}



#[ic_cdk::update]
pub fn update_sale_params(
    ledger_canister_id: Principal,
    updated_details: SaleDetailsUpdate,
) -> Result<(), String> {
    let caller = ic_cdk::api::caller(); // Get the caller's principal

    mutate_state(|state| {
        if let Some(wrapper) = state.sale_details.get(&ledger_canister_id.to_string()) {
            if wrapper.sale_details.creator != caller {
                return Err("Unauthorized: Only the creator can update the sale details.".into());
            }

            let mut sale_details = wrapper.sale_details.clone(); // Clone the sale details to update them

            // Updating various fields if provided
            if let Some(start_time) = updated_details.start_time_utc {
                sale_details.start_time_utc = start_time;
            }
            if let Some(end_time) = updated_details.end_time_utc {
                sale_details.end_time_utc = end_time;
            }
            if let Some(website) = updated_details.website {
                sale_details.website = website;
            }
            if let Some(social_links) = updated_details.social_links {
                sale_details.social_links = social_links;
            }
            if let Some(description) = updated_details.description {
                sale_details.description = description;
            }
            if let Some(project_video) = updated_details.project_video {
                sale_details.project_video = project_video; // Update the project video URL
            }

            // Don't modify processed or other calculated fields
            sale_details.processed = wrapper.sale_details.processed;

            // Reinsert the updated wrapper back into the stable map
            state.sale_details.insert(
                ledger_canister_id.to_string(),
                SaleDetailsWrapper { sale_details },
            );
            Ok(())
        } else {
            Err("Sale details not found.".into())
        }
    })
}

#[ic_cdk::update]
pub fn insert_funds_raised(ledger_canister_id: Principal, amount: u64) -> Result<(), String> {
    mutate_state(|state| {
        let new_amount = U64Wrapper(amount);

        // Update or insert the funds
        if let Some(existing) = state.funds_raised.get(&ledger_canister_id) {
            state
                .funds_raised
                .insert(ledger_canister_id, U64Wrapper(existing.0 + new_amount.0));
        } else {
            state.funds_raised.insert(ledger_canister_id, new_amount);
        }

        Ok(())
    })
}

// #[ic_cdk::update]
// async fn convert_icp_to_cycles(amount: u64) -> Result<Nat, String> {
//     let icp_amount = Tokens::from_e8s(amount);

//     // Call the mint_cycles function
//     match mint_cycles(icp_amount).await {
//         Ok(cycles) => Ok(cycles),
//         Err(err) => Err(format!("Failed to mint cycles: {:?}", err)),
//     }
// }
