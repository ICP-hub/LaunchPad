use candid::{Nat, Principal};
use ic_cdk::query;

use crate::{read_state, CanisterIndexInfo, SaleDetails, SaleDetailsWithID, State, UserAccount};

#[ic_cdk::query]
pub fn get_user_account(principal: Principal) -> Result<UserAccount, String> {
    // Retrieve the user account for the given principal
    let user_account = read_state(|state| {
        state
            .user_accounts
            .get(&principal)
            .map(|wrapper| wrapper.user_account.clone())
    });

    // Return the result or an error if the account is not found
    match user_account {
        Some(account) => Ok(account),
        None => Err(format!(
            "User account not found for principal: {}",
            principal
        )),
    }
}


#[ic_cdk::query]
pub fn get_user_by_username(username: String) -> Result<UserAccount, String> {
    // Search for a user account by username
    let user_account = read_state(|state| {
        state.user_accounts.iter().find_map(|(_, wrapper)| {
            if wrapper.user_account.username == username {
                Some(wrapper.user_account.clone())
            } else {
                None
            }
        })
    });

    // Return the result or an error if the user is not found
    match user_account {
        Some(account) => Ok(account),
        None => Err(format!("User with username '{}' not found.", username)),
    }
}


#[ic_cdk::query]
pub fn is_account_created() -> String {
    let caller = ic_cdk::api::caller();

    // Check if the account exists in the state
    let account_status = read_state(|state| state.user_accounts.contains_key(&caller));

    if account_status {
        format!("Account for principal {} is already created.", caller)
    } else {
        format!("Account for principal {} has not been created yet.", caller)
    }
}

#[ic_cdk::query]
pub fn get_tokens_info() -> Result<Vec<CanisterIndexInfo>, String> {
    let current_time_ns = ic_cdk::api::time(); // Current time in nanoseconds
    let current_time = current_time_ns / 1_000_000_000; // Convert to seconds

    let tokens_info: Vec<CanisterIndexInfo> = read_state(|state| {
        state
            .canister_ids
            .iter()
            .zip(state.index_canister_ids.iter())
            .filter_map(|((canister_key, canister_wrapper), (index_key, _index_wrapper))| {
                // Use a reference to canister_key for Principal conversion
                if let Ok(principal_key) = Principal::from_text(&canister_key) {
                    // Check if sale details exist for this token
                    if let Some(sale_wrapper) = state.sale_details.get(&principal_key) {
                        let sale_details = &sale_wrapper.sale_details;

                        // Include tokens with ongoing/active sales
                        if sale_details.start_time_utc <= current_time
                            && sale_details.end_time_utc > current_time
                        {
                            return Some(CanisterIndexInfo {
                                canister_id: canister_key.clone(), // Clone here to take ownership
                                index_canister_id: index_key.clone(),
                                token_name: canister_wrapper.token_name.clone(),
                                token_symbol: canister_wrapper.token_symbol.clone(),
                                total_supply: canister_wrapper.total_supply.clone(),
                            });
                        }
                    }
                }
                None // Exclude tokens without sale details or inactive sales
            })
            .collect()
    });

    // Return an error if no tokens with active sales are found
    if tokens_info.is_empty() {
        Err("No tokens with active sales found.".to_string())
    } else {
        Ok(tokens_info)
    }
}





// #[query]
// pub fn get_time(){
//     let current_time = time() / 1_000_000_000; // Convert time to seconds
//     ic_cdk::println!("Current time: {}", current_time); // Log current time
// }


#[ic_cdk::query]
pub fn get_user_tokens_info() -> Result<Vec<CanisterIndexInfo>, String> {
    let caller = ic_cdk::caller();

    // Retrieve user tokens info
    let user_tokens_info: Vec<CanisterIndexInfo> = read_state(|state| {
        state
            .canister_ids
            .iter()
            .zip(state.index_canister_ids.iter())
            .filter_map(
                |((canister_key, canister_wrapper), (index_key, _index_wrapper))| {
                    // Only include entries where the owner matches the caller
                    if canister_wrapper.owner == caller {
                        Some(CanisterIndexInfo {
                            canister_id: canister_key.clone(),
                            index_canister_id: index_key.clone(),
                            token_name: canister_wrapper.token_name.clone(),
                            token_symbol: canister_wrapper.token_symbol.clone(),
                            total_supply: canister_wrapper.total_supply.clone(),
                        })
                    } else {
                        None
                    }
                },
            )
            .collect()
    });

    // Return an error if no tokens are found for the caller
    if user_tokens_info.is_empty() {
        Err(format!(
            "No tokens found for the caller: {}",
            caller
        ))
    } else {
        Ok(user_tokens_info)
    }
}




#[ic_cdk::query]
pub fn search_by_token_name_or_symbol(
    token_identifier: String,
) -> Result<CanisterIndexInfo, String> {
    // Search for the token by name or symbol
    let result = read_state(|state| {
        for (canister_key, canister_wrapper) in state.canister_ids.iter() {
            // Check if the token_name or token_symbol matches the token_identifier
            if canister_wrapper.token_name == token_identifier
                || canister_wrapper.token_symbol == token_identifier
            {
                // Safely retrieve the index canister ID
                let index_canister_id = state
                    .index_canister_ids
                    .get(&canister_key)
                    .map(|index_wrapper| index_wrapper.index_canister_ids.to_string())
                    .unwrap_or_else(|| {
                        ic_cdk::println!(
                            "Index canister ID not found for canister: {}",
                            canister_key
                        );
                        String::new()
                    });

                // Return the relevant CanisterIndexInfo
                return Some(CanisterIndexInfo {
                    canister_id: canister_key.clone(),
                    index_canister_id,
                    token_name: canister_wrapper.token_name.clone(),
                    token_symbol: canister_wrapper.token_symbol.clone(),
                    total_supply: canister_wrapper.total_supply.clone(),
                });
            }
        }
        None
    });

    match result {
        Some(canister_info) => Ok(canister_info),
        None => Err(format!(
            "No token found with the identifier: '{}'",
            token_identifier
        )),
    }
}


#[ic_cdk::query]
pub fn get_token_image_ids() -> Result<Vec<(u32, Principal)>, String> {
    let mut image_ledger_pairs = Vec::new();

    // Safely read the state
    read_state(|state| {
        for (_ledger_id, canister_entry) in state.canister_ids.iter() {
            match (canister_entry.image_id, canister_entry.ledger_id) {
                (Some(image_id), Some(ledger_id)) => {
                    // Add valid image_id and ledger_id pairs to the result
                    image_ledger_pairs.push((image_id, ledger_id));
                }
                (None, _) => {
                    ic_cdk::println!(
                        "Missing image_id for canister entry: {:?}",
                        canister_entry
                    );
                }
                (_, None) => {
                    ic_cdk::println!(
                        "Missing ledger_id for canister entry: {:?}",
                        canister_entry
                    );
                }
            }
        }
    });

    // Check if any valid pairs were found
    if image_ledger_pairs.is_empty() {
        Err("No valid token image IDs or ledger IDs found.".to_string())
    } else {
        Ok(image_ledger_pairs)
    }
}


#[ic_cdk::query]
pub fn get_token_image_id(ledger_id: Principal) -> Result<u32, String> {
    // Safely retrieve the token image ID from the state
    let token_image_id = read_state(|state| {
        state
            .canister_ids
            .get(&ledger_id.to_string())
            .and_then(|canister_entry| canister_entry.image_id) // Return the image_id if available
    });

    match token_image_id {
        Some(image_id) => Ok(image_id),
        None => Err(format!(
            "Token image ID not found for ledger ID: {}",
            ledger_id
        )),
    }
}


#[ic_cdk::query]
pub fn get_profile_image_id() -> Result<u32, String> {
    let principal = ic_cdk::api::caller();

    // Safely retrieve the profile image ID from the state
    let profile_image_id = read_state(|state| {
        state
            .image_ids
            .get(&principal.to_string())
            .map(|wrapper| wrapper.image_id)
    });

    match profile_image_id {
        Some(image_id) => Ok(image_id),
        None => Err(format!(
            "Profile image ID not found for caller: {}",
            principal
        )),
    }
}


#[ic_cdk::query]
pub fn get_cover_image_id(ledger_id: Principal) -> Result<u32, String> {
    // Safely retrieve the cover image ID from the state
    let cover_image_id = read_state(|state| {
        state
            .cover_image_ids
            .get(&ledger_id.to_string())
            .map(|wrapper| wrapper.image_id)
    });

    match cover_image_id {
        Some(image_id) => Ok(image_id),
        None => Err(format!("Cover image ID not found for ledger ID: {}", ledger_id)),
    }
}


#[ic_cdk::query]
pub fn get_sale_params(ledger_canister_id: Principal) -> Result<SaleDetails, String> {
    // Retrieve the sale parameters from stable memory using ledger_canister_id
    let sale_details = read_state(|state| {
        state
            .sale_details
            .get(&ledger_canister_id)
            .map(|wrapper| wrapper.sale_details.clone())
    })
    .ok_or_else(|| format!("Sale details not found for ledger_canister_id: {}", ledger_canister_id))?;

    // Validate the sale details before returning
    validate_sale_details(&sale_details)
        .ok_or_else(|| format!("Invalid sale details for ledger_canister_id: {}", ledger_canister_id))
}



#[ic_cdk::query]
pub fn get_user_sale_params() -> Result<Vec<(CanisterIndexInfo, SaleDetails)>, String> {
    let caller = ic_cdk::caller();

    // Retrieve all tokens created by the user
    let tokens_info: Vec<CanisterIndexInfo> = read_state(|state: &State| {
        state
            .canister_ids
            .iter()
            .filter_map(|(canister_key, canister_wrapper)| {
                if canister_wrapper.owner == caller {
                    // Convert Principal to String for canister_id
                    let canister_id = canister_wrapper.canister_ids.to_text();

                    // Retrieve and convert Principal to String for index_canister_id
                    let index_canister_id = state
                        .index_canister_ids
                        .get(&canister_key) // Borrow `canister_key` directly
                        .map(|index_wrapper| index_wrapper.index_canister_ids.to_text())
                        .unwrap_or_default();

                    Some(CanisterIndexInfo {
                        canister_id,
                        index_canister_id,
                        token_name: canister_wrapper.token_name.clone(),
                        token_symbol: canister_wrapper.token_symbol.clone(),
                        total_supply: canister_wrapper.total_supply.clone(),
                    })
                } else {
                    None
                }
            })
            .collect()
    });

    if tokens_info.is_empty() {
        return Err("No tokens created by the caller.".to_string());
    }

    let mut sale_params = Vec::new();
    for token_info in tokens_info {
        // Convert String canister_id back to Principal
        let canister_id_principal = match Principal::from_text(&token_info.canister_id) {
            Ok(principal) => principal,
            Err(err) => {
                ic_cdk::println!(
                    "Invalid Principal for canister ID '{}': {}",
                    token_info.canister_id,
                    err
                );
                continue; // Skip invalid entries
            }
        };

        // Retrieve sale details safely
        let sale_details = read_state(|state: &State| {
            state
                .sale_details
                .get(&canister_id_principal)
                .map(|wrapper| wrapper.sale_details.clone())
        });

        match sale_details {
            Some(details) => {
                // Validate sale details before adding
                if let Some(valid_details) = validate_sale_details(&details) {
                    sale_params.push((token_info, valid_details));
                } else {
                    ic_cdk::println!(
                        "Invalid sale details for canister ID '{}'. Skipping entry.",
                        token_info.canister_id
                    );
                }
            }
            None => {
                ic_cdk::println!(
                    "Sale details not found for canister ID '{}'.",
                    token_info.canister_id
                );
            }
        }
    }

    if sale_params.is_empty() {
        Err("No valid sale parameters found for the caller.".to_string())
    } else {
        Ok(sale_params)
    }
}


#[ic_cdk::query]
pub fn get_active_sales() -> Result<Vec<SaleDetailsWithID>, String> {
    let current_time_ns = ic_cdk::api::time(); // Current time in nanoseconds
    let current_time = current_time_ns / 1_000_000_000; // Convert to seconds

    let mut active_sales = Vec::new();

    // Safely read state
    read_state(|state| {
        for (key, wrapper) in state.sale_details.iter() {
            // Fetch funds raised safely
            let funds_raised = state
                .funds_raised
                .get(&key) // Directly use `key` as it's already a Principal
                .map(|wrapper| wrapper.0)
                .unwrap_or(0);

            // Check if the sale qualifies as active
            if wrapper.sale_details.start_time_utc <= current_time
                && wrapper.sale_details.end_time_utc > current_time
                && funds_raised < wrapper.sale_details.hardcap
            {
                // Validate and push the sale details
                if let Some(sale_details) = validate_sale_details(&wrapper.sale_details) {
                    active_sales.push(SaleDetailsWithID {
                        ledger_canister_id: key.to_text(), // Convert Principal to text
                        sale_details,
                    });
                } else {
                    ic_cdk::println!(
                        "Invalid sale details found for ledger_canister_id: {}",
                        key.to_text()
                    );
                }
            }
        }
    });

    // Return error if no active sales are found
    if active_sales.is_empty() {
        Err("No active sales found.".to_string())
    } else {
        Ok(active_sales)
    }
}

#[ic_cdk::query]
pub fn get_upcoming_sales() -> Result<Vec<(SaleDetailsWithID, Nat)>, String> {
    let current_time_ns = ic_cdk::api::time();
    let current_time = current_time_ns / 1_000_000_000; // Convert to seconds

    read_state(|state| {
        let upcoming_sales: Vec<(SaleDetailsWithID, Nat)> = state
            .sale_details
            .iter()
            .filter_map(|(key, wrapper)| {
                // Convert `key` (Principal) to String for `canister_ids` access
                let key_as_string = key.to_text();

                if wrapper.sale_details.start_time_utc > current_time {
                    let total_supply = match state.canister_ids.get(&key_as_string) {
                        Some(info) => info.total_supply.clone(),
                        None => Nat::from(0u64), // Use 0 as default, explicitly typed as u64
                    };

                    // Ensure `is_ended` has a valid value (if needed)
                    if wrapper.sale_details.is_ended {
                        return None; // Skip sales that are already ended
                    }

                    Some((
                        SaleDetailsWithID {
                            ledger_canister_id: key.to_string().clone(),
                            sale_details: wrapper.sale_details.clone(),
                        },
                        total_supply,
                    ))
                } else {
                    None
                }
            })
            .collect();

        // Return the results or an error message if no upcoming sales were found
        if upcoming_sales.is_empty() {
            Err("No upcoming sales found.".to_string())
        } else {
            Ok(upcoming_sales)
        }
    })
    .map_err(|e| format!("Failed to fetch upcoming sales: {}", e)) // Handle errors from `read_state`
}



#[ic_cdk::query]
pub fn get_successful_sales() -> Result<Vec<(SaleDetailsWithID, Nat)>, String> {
    let current_time_ns = ic_cdk::api::time(); // Current time in nanoseconds
    let current_time = current_time_ns / 1_000_000_000; // Convert to seconds

    let mut successful_sales = Vec::new();

    // Safely read state
    read_state(|state| {
        for (key, wrapper) in state.sale_details.iter() {
            // `key` is already a `Principal`; no need for `Principal::from_text`
            let principal_key = key;

            // Fetch funds raised safely
            let funds_raised = state
                .funds_raised
                .get(&principal_key)
                .map(|wrapper| wrapper.0)
                .unwrap_or(0);

            // Check if the sale qualifies as successful
            if wrapper.sale_details.end_time_utc < current_time
                || funds_raised >= wrapper.sale_details.hardcap
            {
                // Convert `Principal` to `String` to access `state.canister_ids`
                let key_as_string = key.to_text();

                // Fetch total supply safely
                let total_supply = state
                    .canister_ids
                    .get(&key_as_string)
                    .map(|info| info.total_supply.clone())
                    .unwrap_or_default();

                // Validate and push the sale details
                if let Some(sale_details) = validate_sale_details(&wrapper.sale_details) {
                    successful_sales.push((
                        SaleDetailsWithID {
                            ledger_canister_id: key.to_string(),
                            sale_details,
                        },
                        total_supply,
                    ));
                } else {
                    ic_cdk::println!(
                        "Invalid sale details found for ledger_canister_id: {}",
                        key.to_text()
                    );
                }
            }
        }
    });

    // Return error if no successful sales are found
    if successful_sales.is_empty() {
        Err("No successful sales found.".to_string())
    } else {
        Ok(successful_sales)
    }
}


#[ic_cdk::query]
pub fn get_all_sales() -> Result<Vec<(SaleDetailsWithID, String)>, String> {
    let current_time_ns = ic_cdk::api::time();
    let current_time = current_time_ns / 1_000_000_000; // Convert nanoseconds to seconds

    let mut all_sales = Vec::new();

    // Safely read state and handle potential errors
    read_state(|state| {
        for (key, wrapper) in state.sale_details.iter() {
            // Ensure `is_ended` has a valid value or provide a default
            let is_ended = wrapper.sale_details.is_ended;

            let sale_status = if wrapper.sale_details.start_time_utc <= current_time
                && wrapper.sale_details.end_time_utc > current_time
                && !is_ended
            {
                "active"
            } else if wrapper.sale_details.start_time_utc > current_time {
                "upcoming"
            } else {
                "successful"
            };

            // Handle potential data inconsistencies or missing fields
            if let Some(sale_details) = validate_sale_details(&wrapper.sale_details) {
                all_sales.push((
                    SaleDetailsWithID {
                        ledger_canister_id: key.to_string().clone(),
                        sale_details,
                    },
                    sale_status.to_string(),
                ));
            } else {
                ic_cdk::println!(
                    "Invalid sale details found for ledger_canister_id: {}",
                    key
                );
            }
        }
    });

    if all_sales.is_empty() {
        Err("No sales data found.".to_string())
    } else {
        Ok(all_sales)
    }
}

/// Validates `SaleDetails` to ensure all required fields are present and returns the valid object.
/// If the object is invalid, logs an error and returns `None`.
fn validate_sale_details(sale_details: &SaleDetails) -> Option<SaleDetails> {
    // Check for required fields or any additional validation logic
    if sale_details.hardcap == 0 || sale_details.softcap == 0 {
        ic_cdk::println!(
            "Invalid sale details: hardcap or softcap is missing or zero: {:?}",
            sale_details
        );
        return None;
    }

    Some(sale_details.clone()) // Clone and return the valid sale details
}


#[ic_cdk::query]
pub fn get_funds_raised(ledger_canister_id: Principal) -> Result<u64, String> {
    let funds = read_state(|state| {
        state.funds_raised.get(&ledger_canister_id).map(|wrapper| wrapper.0) // Extract the u64 value from U64Wrapper
    });

    if let Some(funds) = funds {
        Ok(funds)
    } else {
        Err(format!(
            "No funds found for the given ledger_canister_id: {}",
            ledger_canister_id
        ))
    }
}



#[query]
pub fn get_user_ledger_ids(user_principal: Principal) -> Result<Vec<Principal>, String> {
    // Initialize an empty vector to store ledger IDs
    let mut ledger_ids: Vec<Principal> = Vec::new();

    // Read the state and collect ledger IDs
    read_state(|state| {
        // Add ledger IDs created with `create_token`
        for (_, canister_wrapper) in state.canister_ids.iter() {
            if canister_wrapper.owner == user_principal {
                if let Some(ledger_id) = canister_wrapper.ledger_id {
                    ledger_ids.push(ledger_id);
                } else {
                    ic_cdk::println!("Missing ledger ID for canister: {:?}", canister_wrapper);
                }
            }
        }

        // Add ledger IDs imported with `import_token`
        for (_, imported_canister_wrapper) in state.imported_canister_ids.iter() {
            if imported_canister_wrapper.caller == user_principal {
                ledger_ids.push(imported_canister_wrapper.ledger_canister_id);
            } else {
                ic_cdk::println!(
                    "Caller mismatch for imported canister: {:?}",
                    imported_canister_wrapper
                );
            }
        }
    });

    // Return an error if no ledger IDs were found
    if ledger_ids.is_empty() {
        Err(format!(
            "No ledger IDs found for the given principal: {}",
            user_principal
        ))
    } else {
        Ok(ledger_ids)
    }
}


#[ic_cdk::query]
pub fn debug_index_canister_ids() -> Vec<(String, String)> {
    read_state(|state| {
        state
            .index_canister_ids
            .iter()
            .map(|(key, wrapper)| (key.clone(), wrapper.index_canister_ids.to_string()))
            .collect()
    })
}
