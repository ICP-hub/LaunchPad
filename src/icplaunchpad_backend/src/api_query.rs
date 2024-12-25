use candid::{Nat, Principal};
use ic_cdk::{
    api::management_canister::main::{canister_status, CanisterIdRecord},
    query, update,
};

use crate::prevent_anonymous;
use crate::{read_state, CanisterIndexInfo, SaleDetails, SaleDetailsWithID, UserAccount};
use num_traits::cast::ToPrimitive;

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_user_account(principal: Principal) -> Result<UserAccount, String> {
    // Retrieve the user account for the given principal
    ic_cdk::println!(
        "Attempting to retrieve user account for principal: {}",
        principal
    );
    let user_account = read_state(|state| {
        ic_cdk::println!("Reading state for user accounts.");
        state.user_accounts.get(&principal).map(|wrapper| {
            ic_cdk::println!("Found user account: {:?}", wrapper.user_account);
            wrapper.user_account.clone()
        })
    });

    // Return the result or an error if the account is not found
    match user_account {
        Some(account) => {
            ic_cdk::println!("User account found: {:?}", account);
            Ok(account)
        }
        None => {
            ic_cdk::println!("User account not found for principal: {}", principal);
            Err(format!(
                "User account not found for principal: {}",
                principal
            ))
        }
    }
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_user_by_username(username: String) -> Result<UserAccount, String> {
    ic_cdk::println!("Searching for user account with username: {}", username);

    // Search for a user account by username
    let user_account = read_state(|state| {
        state.user_accounts.iter().find_map(|(_, wrapper)| {
            if wrapper.user_account.username == username {
                ic_cdk::println!("User account found: {:?}", wrapper.user_account);
                Some(wrapper.user_account.clone())
            } else {
                None
            }
        })
    });

    // Return the result or an error if the user is not found
    match user_account {
        Some(account) => Ok(account),
        None => {
            ic_cdk::println!("User account not found for username: {}", username);
            Err(format!("User with username '{}' not found.", username))
        }
    }
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn is_account_created() -> Result<bool, String> {
    let caller = ic_cdk::api::caller();
    ic_cdk::println!(
        "Checking if account for principal {} has been created.",
        caller
    );

    // Attempt to check if the account exists in the state
    let result = read_state(|state| {
        ic_cdk::println!(
            "Checking if account for principal {} exists in the state.",
            caller
        );
        state.user_accounts.contains_key(&caller)
    });

    if result {
        ic_cdk::println!("Account for principal {} has been created.", caller);
        Ok(true)
    } else {
        ic_cdk::println!("Account for principal {} has not been created yet.", caller);
        Err(format!(
            "Account for principal {} has not been created yet.",
            caller
        ))
    }
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_tokens_info() -> Result<Vec<CanisterIndexInfo>, String> {
    let current_time_ns = ic_cdk::api::time(); // Current time in nanoseconds
    let current_time = current_time_ns / 1_000_000_000; // Convert to seconds

    ic_cdk::println!("Fetching user-created tokens at time: {}", current_time);

    // Fetch user-created tokens info (from `canister_ids` and `index_canister_ids`)
    let user_tokens_info: Vec<CanisterIndexInfo> = read_state(|state| {
        state
            .canister_ids
            .iter()
            .zip(state.index_canister_ids.iter())
            .filter_map(
                |((canister_key, canister_wrapper), (index_key, _index_wrapper))| {
                    // Use a reference to canister_key for Principal conversion
                    if let Ok(principal_key) = Principal::from_text(&canister_key) {
                        // Check if sale details exist for this token
                        if let Some(sale_wrapper) = state.sale_details.get(&principal_key) {
                            let sale_details = &sale_wrapper.sale_details;
                            ic_cdk::println!("Checking token: {}", canister_key);

                            // Include tokens with ongoing/active sales
                            if sale_details.start_time_utc <= current_time
                                && sale_details.end_time_utc > current_time
                            {
                                ic_cdk::println!("Active sale found for token: {}", canister_key);
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
                },
            )
            .collect()
    });

    ic_cdk::println!("Fetching imported tokens at time: {}", current_time);

    // Fetch imported tokens info (from `imported_canister_ids`)
    let imported_tokens_info: Vec<CanisterIndexInfo> = read_state(|state| {
        state
            .imported_canister_ids
            .iter()
            .filter_map(|(_, wrapper)| {
                // Check if sale details exist for this imported token
                if let Some(sale_wrapper) = state.sale_details.get(&wrapper.ledger_canister_id) {
                    let sale_details = &sale_wrapper.sale_details;
                    ic_cdk::println!("Checking imported token: {}", wrapper.ledger_canister_id);

                    // Include tokens with ongoing/active sales
                    if sale_details.start_time_utc <= current_time
                        && sale_details.end_time_utc > current_time
                    {
                        ic_cdk::println!(
                            "Active sale found for imported token: {}",
                            wrapper.ledger_canister_id
                        );
                        return Some(CanisterIndexInfo {
                            canister_id: wrapper.ledger_canister_id.to_string(), // Imported token's ledger canister ID
                            index_canister_id: wrapper.index_canister_id.to_string(), // Imported token's index canister ID
                            token_name: "Imported".to_string(), // Placeholder name for imported tokens
                            token_symbol: "IMP".to_string(), // Placeholder symbol for imported tokens
                            total_supply: Nat::from(0u64), // No total supply information for imported tokens
                        });
                    }
                }
                None // Exclude tokens without sale details or inactive sales
            })
            .collect()
    });

    // Combine both user-created and imported tokens
    let all_tokens = [user_tokens_info, imported_tokens_info].concat();

    // Return an error if no tokens with active sales are found
    if all_tokens.is_empty() {
        ic_cdk::println!("No tokens with active sales found.");
        Err("No tokens with active sales found.".to_string())
    } else {
        ic_cdk::println!("Total active tokens found: {}", all_tokens.len());
        Ok(all_tokens)
    }
}

// #[query]
// pub fn get_time(){
//     let current_time = time() / 1_000_000_000; // Convert time to seconds
//     ic_cdk::println!("Current time: {}", current_time); // Log current time
// }

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_user_tokens_info() -> Result<Vec<CanisterIndexInfo>, String> {
    let caller = ic_cdk::caller();
    ic_cdk::println!("Getting user tokens info for caller: {}", caller);

    // Retrieve all sales: active, upcoming, and successful
    let all_sales: Vec<Principal> = read_state(|state| {
        state
            .sale_details
            .iter()
            .map(|(key, _)| key) // Collect the Principal of all sales
            .collect()
    });
    ic_cdk::println!("Retrieved {} sales", all_sales.len());

    // Helper function to check if a canister_id corresponds to a sale, now redundant but keeping for structure
    let is_sale = |canister_id: &Principal| all_sales.contains(canister_id);

    // Retrieve user-created tokens (from `canister_ids` and `index_canister_ids`)
    let user_tokens_info: Vec<CanisterIndexInfo> = read_state(|state| {
        state
            .canister_ids
            .iter()
            .zip(state.index_canister_ids.iter())
            .filter_map(|((canister_key, canister_wrapper), (index_key, _))| {
                let canister_id = Principal::from_text(canister_key.clone()).ok()?;

                if canister_wrapper.owner == caller && is_sale(&canister_id) {
                    ic_cdk::println!("Found user-created token: {}", canister_key);
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
            })
            .collect()
    });
    ic_cdk::println!("Retrieved {} user-created tokens", user_tokens_info.len());

    // Retrieve imported tokens (from `imported_canister_ids`)
    let imported_tokens_info: Vec<CanisterIndexInfo> = read_state(|state| {
        state
            .imported_canister_ids
            .iter()
            .filter_map(|(_, wrapper)| {
                let ledger_canister_id = wrapper.ledger_canister_id;
                if wrapper.caller == caller && is_sale(&ledger_canister_id) {
                    ic_cdk::println!("Found imported token: {}", wrapper.ledger_canister_id);
                    Some(CanisterIndexInfo {
                        canister_id: ledger_canister_id.to_text(),
                        index_canister_id: wrapper.index_canister_id.to_string(),
                        token_name: "Imported".to_string(),
                        token_symbol: "IMP".to_string(),
                        total_supply: Nat::from(0u64),
                    })
                } else {
                    None
                }
            })
            .collect()
    });
    ic_cdk::println!("Retrieved {} imported tokens", imported_tokens_info.len());

    // Combine both user-created and imported tokens
    let all_tokens = [user_tokens_info, imported_tokens_info].concat();
    ic_cdk::println!("Total tokens found: {}", all_tokens.len());

    // Return an error if no tokens are found for the caller
    if all_tokens.is_empty() {
        Err(format!("No tokens found for the caller: {}", caller))
    } else {
        Ok(all_tokens)
    }
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn search_by_token_name_or_symbol(
    token_identifier: String,
) -> Result<CanisterIndexInfo, String> {
    // Search for the token by name or symbol
    ic_cdk::println!("Searching for token with identifier: {}", token_identifier);
    let result = read_state(|state| {
        for (canister_key, canister_wrapper) in state.canister_ids.iter() {
            // Check if the token_name or token_symbol matches the token_identifier
            if canister_wrapper.token_name == token_identifier
                || canister_wrapper.token_symbol == token_identifier
            {
                ic_cdk::println!(
                    "Found matching token: {} with canister ID: {}",
                    token_identifier,
                    canister_key
                );
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
        ic_cdk::println!("No token found with the identifier: {}", token_identifier);
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

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_token_image_ids() -> Result<Vec<(String, u32)>, String> {
    let mut image_ledger_pairs = Vec::new();

    // Safely read the state
    read_state(|state| {
        ic_cdk::println!("Getting token image IDs:");
        for (ledger_id, image_wrapper) in state.token_image_ids.iter() {
            ic_cdk::println!("  Ledger ID: {}", ledger_id);
            ic_cdk::println!("    Token Image ID: {}", image_wrapper.image_id);
            // Since TokenImageIdsMap holds all necessary information directly,
            // no need to check for existence of image_id or ledger_id.
            image_ledger_pairs.push((ledger_id.clone(), image_wrapper.image_id));
        }
    });

    // Check if any valid pairs were found
    if image_ledger_pairs.is_empty() {
        Err("No valid token image IDs or ledger IDs found.".to_string())
    } else {
        Ok(image_ledger_pairs)
    }
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_token_image_id(ledger_canister_id: Principal) -> Result<String, String> {
    ic_cdk::println!(
        "Calling get_token_image_id with ledger_canister_id: {}",
        ledger_canister_id
    );

    // Safely retrieve the token image ID from the state
    let token_image_id = read_state(|state| {
        ic_cdk::println!("Getting token image ID from state:");
        state
            .token_image_ids
            .get(&ledger_canister_id.to_string())
            .map(|wrapper| {
                ic_cdk::println!("  Token image ID: {}", wrapper.image_id);
                wrapper.image_id.clone()
            })
    });

    match token_image_id {
        Some(image_id) => {
            ic_cdk::println!("Returning token image ID: {}", image_id);
            Ok(image_id.to_string())
        }
        None => {
            ic_cdk::println!(
                "No token image ID found for ledger ID: {}",
                ledger_canister_id
            );
            Err(format!(
                "Token image ID not found for ledger ID: {}",
                ledger_canister_id
            ))
        }
    }
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_profile_image_id() -> Result<u32, String> {
    let principal = ic_cdk::api::caller();

    // Safely retrieve the profile image ID from the state
    let profile_image_id = read_state(|state| {
        state
            .profile_image_ids
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

#[ic_cdk::query(guard = prevent_anonymous)]
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
        None => Err(format!(
            "Cover image ID not found for ledger ID: {}",
            ledger_id
        )),
    }
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub async fn get_sale_params(ledger_canister_id: Principal) -> Result<SaleDetails, String> {
    // Retrieve the sale parameters from stable memory using ledger_canister_id
    let sale_details = read_state(|state| {
        ic_cdk::println!(
            "Attempting to retrieve sale details for ledger_canister_id: {}",
            ledger_canister_id
        );
        state.sale_details.get(&ledger_canister_id).map(|wrapper| {
            ic_cdk::println!(
                "Retrieved sale details for ledger_canister_id: {}",
                ledger_canister_id
            );
            wrapper.sale_details.clone()
        })
    })
    .ok_or_else(|| {
        ic_cdk::println!(
            "Sale details not found for ledger_canister_id: {}",
            ledger_canister_id
        );
        format!(
            "Sale details not found for ledger_canister_id: {}",
            ledger_canister_id
        )
    })?;

    // Validate the sale details before returning
    validate_sale_details(&sale_details).ok_or_else(|| {
        ic_cdk::println!(
            "Invalid sale details for ledger_canister_id: {}",
            ledger_canister_id
        );
        format!(
            "Invalid sale details for ledger_canister_id: {}",
            ledger_canister_id
        )
    })
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_active_sales() -> Result<Vec<SaleDetailsWithID>, String> {
    let current_time_ns = ic_cdk::api::time(); // Current time in nanoseconds
    let current_time = current_time_ns / 1_000_000_000; // Convert to seconds

    let mut active_sales = Vec::new();

    ic_cdk::println!("Fetching active sales at time: {}", current_time);

    // Safely read state
    read_state(|state| {
        for (key, wrapper) in state.sale_details.iter() {
            // Fetch funds raised safely
            let funds_raised = state
                .funds_raised
                .get(&key) // Directly use `key` as it's already a Principal
                .map(|wrapper| wrapper.0)
                .unwrap_or(0);

            ic_cdk::println!(
                "Checking sale details for ledger_canister_id: {}",
                key.to_text()
            );

            // Check if the sale qualifies as active
            if wrapper.sale_details.start_time_utc <= current_time
                && wrapper.sale_details.end_time_utc > current_time
                && funds_raised < wrapper.sale_details.hardcap
            {
                // Validate and push the sale details
                if let Some(sale_details) = validate_sale_details(&wrapper.sale_details) {
                    ic_cdk::println!(
                        "Active sale found for ledger_canister_id: {}",
                        key.to_text()
                    );
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
        ic_cdk::println!("No active sales found.");
        Err("No active sales found.".to_string())
    } else {
        Ok(active_sales)
    }
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_upcoming_sales() -> Result<Vec<(SaleDetailsWithID, Nat)>, String> {
    let current_time_ns = ic_cdk::api::time();
    let current_time = current_time_ns / 1_000_000_000; // Convert to seconds

    read_state(|state| {
        ic_cdk::println!("Fetching upcoming sales at time: {}", current_time);

        let upcoming_sales: Vec<(SaleDetailsWithID, Nat)> = state
            .sale_details
            .iter()
            .filter_map(|(key, wrapper)| {
                // Convert `key` (Principal) to String for `canister_ids` access
                let key_as_string = key.to_text();

                ic_cdk::println!(
                    "Checking sale details for ledger_canister_id: {}",
                    key_as_string
                );

                if wrapper.sale_details.start_time_utc > current_time {
                    let total_supply = match state.canister_ids.get(&key_as_string) {
                        Some(info) => info.total_supply.clone(),
                        None => {
                            ic_cdk::println!(
                                "No canister found for ledger_canister_id: {}",
                                key_as_string
                            );
                            Nat::from(0u64) // Use 0 as default, explicitly typed as u64
                        }
                    };

                    // Ensure `is_ended` has a valid value (if needed)
                    if wrapper.sale_details.is_ended {
                        ic_cdk::println!(
                            "Skipping sale that is already ended for ledger_canister_id: {}",
                            key_as_string
                        );
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
                    ic_cdk::println!(
                        "Sale has already started for ledger_canister_id: {}",
                        key_as_string
                    );
                    None
                }
            })
            .collect();

        ic_cdk::println!("Found {} upcoming sales.", upcoming_sales.len());

        // Return the results or an error message if no upcoming sales were found
        if upcoming_sales.is_empty() {
            ic_cdk::println!("No upcoming sales found.");
            Err("No upcoming sales found.".to_string())
        } else {
            Ok(upcoming_sales)
        }
    })
    .map_err(|e| {
        ic_cdk::println!("Failed to fetch upcoming sales: {}", e);
        format!("Failed to fetch upcoming sales: {}", e)
    }) // Handle errors from `read_state`
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_successful_sales() -> Result<Vec<(SaleDetailsWithID, Nat)>, String> {
    let current_time_ns = ic_cdk::api::time(); // Current time in nanoseconds
    let current_time = current_time_ns / 1_000_000_000; // Convert to seconds

    ic_cdk::println!("Fetching successful sales at time: {}", current_time);

    let mut successful_sales = Vec::new();

    // Safely read state
    read_state(|state| {
        for (key, wrapper) in state.sale_details.iter() {
            // `key` is already a `Principal`; no need for `Principal::from_text`
            let principal_key = key;

            ic_cdk::println!(
                "Checking sale details for ledger_canister_id: {}",
                key.to_text()
            );

            // Fetch funds raised safely
            let funds_raised = state
                .funds_raised
                .get(&principal_key)
                .map(|wrapper| wrapper.0)
                .unwrap_or(0);

            ic_cdk::println!(
                "Found funds raised: {} for ledger_canister_id: {}",
                funds_raised,
                key.to_text()
            );

            // Check if the sale qualifies as successful
            if wrapper.sale_details.end_time_utc < current_time
                || funds_raised >= wrapper.sale_details.hardcap
            {
                ic_cdk::println!(
                    "Found successful sale for ledger_canister_id: {}",
                    key.to_text()
                );

                // Convert `Principal` to `String` to access `state.canister_ids`
                let key_as_string = key.to_text();

                // Fetch total supply safely
                let total_supply = state
                    .canister_ids
                    .get(&key_as_string)
                    .map(|info| info.total_supply.clone())
                    .unwrap_or_default();

                ic_cdk::println!(
                    "Found total supply: {} for ledger_canister_id: {}",
                    total_supply,
                    key.to_text()
                );

                // Validate and push the sale details
                if let Some(sale_details) = validate_sale_details(&wrapper.sale_details) {
                    successful_sales.push((
                        SaleDetailsWithID {
                            ledger_canister_id: key.to_string(),
                            sale_details,
                        },
                        total_supply,
                    ));

                    ic_cdk::println!("Added successful sale to result: {}", key.to_text());
                } else {
                    ic_cdk::println!(
                        "Invalid sale details found for ledger_canister_id: {}",
                        key.to_text()
                    );
                }
            }
        }
    });

    ic_cdk::println!("Found {} successful sales.", successful_sales.len());

    // Return error if no successful sales are found
    if successful_sales.is_empty() {
        Err("No successful sales found.".to_string())
    } else {
        Ok(successful_sales)
    }
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_all_sales() -> Result<Vec<(SaleDetailsWithID, String)>, String> {
    let current_time_ns = ic_cdk::api::time();
    let current_time = current_time_ns / 1_000_000_000; // Convert nanoseconds to seconds

    let mut all_sales = Vec::new();

    // Safely read state and handle potential errors
    read_state(|state| {
        ic_cdk::println!("Reading state to get all sales");
        for (key, wrapper) in state.sale_details.iter() {
            ic_cdk::println!("Checking sale for ledger_canister_id: {}", key);
            // Ensure `is_ended` has a valid value or provide a default
            let is_ended = wrapper.sale_details.is_ended;

            let sale_status = if wrapper.sale_details.start_time_utc <= current_time
                && wrapper.sale_details.end_time_utc > current_time
                && !is_ended
            {
                ic_cdk::println!("Sale is active");
                "active"
            } else if wrapper.sale_details.start_time_utc > current_time {
                ic_cdk::println!("Sale is upcoming");
                "upcoming"
            } else {
                ic_cdk::println!("Sale is successful");
                "successful"
            };

            // Handle potential data inconsistencies or missing fields
            if let Some(sale_details) = validate_sale_details(&wrapper.sale_details) {
                ic_cdk::println!("Adding sale to result: {}", key);
                all_sales.push((
                    SaleDetailsWithID {
                        ledger_canister_id: key.to_string().clone(),
                        sale_details,
                    },
                    sale_status.to_string(),
                ));
            } else {
                ic_cdk::println!("Invalid sale details found for ledger_canister_id: {}", key);
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

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_funds_raised(ledger_canister_id: Principal) -> Result<u64, String> {
    ic_cdk::println!(
        "Querying funds raised for ledger_canister_id: {}",
        ledger_canister_id
    );

    let funds = read_state(|state| {
        ic_cdk::println!("Reading state for funds raised.");
        state
            .funds_raised
            .get(&ledger_canister_id)
            .map(|wrapper| wrapper.0)
    });

    match funds {
        Some(funds) => {
            ic_cdk::println!("Funds found: {}", funds);
            Ok(funds)
        }
        None => {
            ic_cdk::println!(
                "No funds found for ledger_canister_id: {}",
                ledger_canister_id
            );
            Err(format!(
                "No funds found for the given ledger_canister_id: {}",
                ledger_canister_id
            ))
        }
    }
}

#[query(guard = prevent_anonymous)]
pub fn get_user_ledger_ids(user_principal: Principal) -> Result<Vec<Principal>, String> {
    ic_cdk::println!("Starting to fetch ledger IDs for user: {}", user_principal);

    // Initialize an empty vector to store ledger IDs
    let mut ledger_ids: Vec<Principal> = Vec::new();

    // Read the state and collect ledger IDs
    read_state(|state| {
        ic_cdk::println!("Reading state for canister IDs.");

        // Add ledger IDs created with `create_token`
        for (key, canister_wrapper) in state.canister_ids.iter() {
            ic_cdk::println!("Checking canister: {}", key);
            if canister_wrapper.owner == user_principal {
                if let Some(ledger_id) = canister_wrapper.ledger_id {
                    ic_cdk::println!("Found ledger ID: {}", ledger_id);
                    ledger_ids.push(ledger_id);
                } else {
                    ic_cdk::println!("Missing ledger ID for canister: {:?}", canister_wrapper);
                }
            }
        }

        ic_cdk::println!("Reading state for imported canister IDs.");

        // Add ledger IDs imported with `import_token`
        for (key, imported_canister_wrapper) in state.imported_canister_ids.iter() {
            ic_cdk::println!("Checking imported canister: {}", key);
            if imported_canister_wrapper.caller == user_principal {
                ic_cdk::println!(
                    "Found imported ledger ID: {}",
                    imported_canister_wrapper.ledger_canister_id
                );
                ledger_ids.push(imported_canister_wrapper.ledger_canister_id);
            } else {
                ic_cdk::println!(
                    "Caller mismatch for imported canister: {:?}",
                    imported_canister_wrapper
                );
            }
        }
    });

    if ledger_ids.is_empty() {
        ic_cdk::println!("No ledger IDs found for user: {}", user_principal);
        Err(format!(
            "No ledger IDs found for the given principal: {}",
            user_principal
        ))
    } else {
        ic_cdk::println!(
            "Successfully fetched ledger IDs for user: {}",
            user_principal
        );
        Ok(ledger_ids)
    }
}

#[update(guard = prevent_anonymous)]
pub async fn fetch_canister_balance_new(canister_id: Principal) -> Result<u128, String> {
    let arg = CanisterIdRecord { canister_id };

    ic_cdk::println!("Fetching canister balance for: {}", canister_id);

    // Retrieve the canister status from the management canister
    match canister_status(arg).await {
        Ok((status,)) => {
            ic_cdk::println!("Retrieved canister status: {:?}", status);

            // Access cycles from the CanisterStatusResponse
            match status.cycles.0.to_u128() {
                Some(cycles) => {
                    ic_cdk::println!("Successfully converted cycles to u128: {}", cycles);
                    Ok(cycles)
                }
                None => {
                    ic_cdk::println!("Failed to convert cycles to u128. Possible overflow.");
                    Err("Conversion to u128 failed. Possible overflow.".to_string())
                }
            }
        }
        Err((code, message)) => {
            // Format the error tuple into a readable string
            ic_cdk::println!(
                "Failed to retrieve canister status. Error code: {:?}. Message: {}",
                code,
                message
            );
            Err(format!(
                "Canister status query failed with code {:?}: {}",
                code, message
            ))
        }
    }
}
