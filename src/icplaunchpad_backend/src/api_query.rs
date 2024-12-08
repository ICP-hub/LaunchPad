use candid::{Nat, Principal};
use ic_cdk::query;

use crate::{read_state, CanisterIndexInfo, SaleDetails, SaleDetailsWithID, State, UserAccount};

#[ic_cdk::query]
pub fn get_user_account(principal: Principal) -> Option<UserAccount> {
    read_state(|state| {
        state
            .user_accounts
            .get(&principal)
            .map(|wrapper| wrapper.user_account.clone())
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

#[ic_cdk::query]
pub fn get_tokens_info() -> Vec<CanisterIndexInfo> {
    let current_time_ns = ic_cdk::api::time(); // Current time in nanoseconds
    let current_time = current_time_ns / 1_000_000_000; // Convert to seconds

    read_state(|state| {
        state
            .canister_ids
            .iter()
            .zip(state.index_canister_ids.iter())
            .filter_map(|((canister_key, canister_wrapper), (index_key, _))| {
                // Check if sale details exist and are active for this token
                if let Some(sale_wrapper) = state.sale_details.get(&canister_key) {
                    let sale_details = &sale_wrapper.sale_details;

                    // Only include tokens with ongoing/active sales
                    if sale_details.start_time_utc <= current_time
                        && sale_details.end_time_utc > current_time
                    {
                        return Some(CanisterIndexInfo {
                            canister_id: canister_key.clone(),
                            index_canister_id: index_key.clone(),
                            token_name: canister_wrapper.token_name.clone(),
                            token_symbol: canister_wrapper.token_symbol.clone(),
                            total_supply: canister_wrapper.total_supply.clone(),
                        });
                    }
                }
                None // Exclude tokens without sale details or inactive sales
            })
            .collect()
    })
}

// #[query]
// pub fn get_time(){
//     let current_time = time() / 1_000_000_000; // Convert time to seconds
//     ic_cdk::println!("Current time: {}", current_time); // Log current time
// }

// #[ic_cdk::query]
// pub fn get_user_tokens_upcoming_info() -> Vec<CanisterIndexInfo> {
//     let current_time_ns = ic_cdk::api::time();
//     let current_time = current_time_ns / 1_000_000_000; // Convert to seconds
//     let caller = ic_cdk::caller();

//     read_state(|state| {
//         state.canister_ids.iter().zip(state.index_canister_ids.iter()).filter_map(|((canister_key, canister_wrapper), (index_key, _))| {
//             if let Some(sale_wrapper) = state.sale_details.get(&canister_key) {
//                 let sale_details = &sale_wrapper.sale_details;

//                 if sale_details.creator == caller && sale_details.start_time_utc > current_time {
//                     return Some(CanisterIndexInfo {
//                         canister_id: canister_key.clone(),
//                         index_canister_id: index_key.clone(),
//                         token_name: canister_wrapper.token_name.clone(),
//                         token_symbol: canister_wrapper.token_symbol.clone(),
//                         total_supply: canister_wrapper.total_supply.clone(),
//                     });
//                 }
//             }
//             None
//         }).collect()
//     })
// }

// #[ic_cdk::query]
// pub fn get_user_token_successful_info() -> Vec<CanisterIndexInfo> {
//     let current_time_ns = ic_cdk::api::time(); // Current time in nanoseconds
//     let current_time = current_time_ns / 1_000_000_000; // Convert to seconds
//     let caller = ic_cdk::caller(); // Get the caller’s principal

//     read_state(|state| {
//         state.canister_ids.iter().zip(state.index_canister_ids.iter()).filter_map(|((canister_key, canister_wrapper), (index_key, _))| {
//             if let Some(sale_wrapper) = state.sale_details.get(&canister_key) {
//                 let sale_details = &sale_wrapper.sale_details;

//                 // Filter for successful sales specific to the caller's principal
//                 if sale_details.creator == caller && sale_details.end_time_utc <= current_time {
//                     return Some(CanisterIndexInfo {
//                         canister_id: canister_key.clone(),
//                         index_canister_id: index_key.clone(),
//                         token_name: canister_wrapper.token_name.clone(),
//                         token_symbol: canister_wrapper.token_symbol.clone(),
//                         total_supply: canister_wrapper.total_supply.clone(),
//                     });
//                 }
//             }
//             None
//         }).collect()
//     })
// }

// #[ic_cdk::query]
// pub fn get_tokens_info() -> Vec<CanisterIndexInfo> {
//     read_state(|state| {
//         state.canister_ids.iter().filter_map(|(canister_key, canister_wrapper)| {
//             // Ensure canister_key is of type String when looking it up
//             let index_canister_key = canister_key.to_string();

//             // Check if the token has associated index canister details
//             if let Some(wrapper) = state.index_canister_ids.get(&index_canister_key) {
//                 Some(CanisterIndexInfo {
//                     canister_id: canister_key.clone(),
//                     index_canister_id: wrapper.index_canister_ids.to_string(), // Convert Principal to String
//                     token_name: canister_wrapper.token_name.clone(),
//                     token_symbol: canister_wrapper.token_symbol.clone(),
//                 })
//             } else {
//                 // Skip tokens without index canister details
//                 None
//             }
//         }).collect()
//     })
// }

#[ic_cdk::query]
pub fn get_user_tokens_info() -> Vec<CanisterIndexInfo> {
    let caller = ic_cdk::caller();

    read_state(|state| {
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
    })
}

#[ic_cdk::query]
pub fn search_by_token_name_or_symbol(token_identifier: String) -> Option<CanisterIndexInfo> {
    read_state(|state| {
        // Iterate through the canister_ids map
        for (canister_key, canister_wrapper) in state.canister_ids.iter() {
            // Check if the token_name or token_symbol matches the token_identifier
            if canister_wrapper.token_name == token_identifier
                || canister_wrapper.token_symbol == token_identifier
            {
                // Find the corresponding index canister
                let index_canister_id = state
                    .index_canister_ids
                    .get(&canister_key)
                    .map(|index_wrapper| index_wrapper.index_canister_ids.to_string())
                    .unwrap_or_default();

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
        None // Return None if no matching token name or symbol is found
    })
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
        state
            .canister_ids
            .get(&ledger_id.to_string())
            .and_then(|canister_entry| {
                // Return the image_id if available
                canister_entry.image_id
            })
    })
}

#[ic_cdk::query]
pub fn get_profile_image_id() -> Option<u32> {
    let principal = ic_cdk::api::caller();

    read_state(|state| {
        state
            .image_ids
            .get(&principal.to_string())
            .map(|wrapper| wrapper.image_id)
    })
}

#[ic_cdk::query]
pub fn get_cover_image_id(ledger_id: Principal) -> Option<u32> {
    read_state(|state| {
        // Search for the given ledger_id in the cover_image_ids map
        state
            .cover_image_ids
            .get(&ledger_id.to_string())
            .map(|wrapper| wrapper.image_id)
    })
}

#[ic_cdk::query]
pub fn get_sale_params(ledger_canister_id: Principal) -> Result<SaleDetails, String> {
    // Retrieve the sale parameters from stable memory using ledger_canister_id
    let sale_details = read_state(|state| {
        state
            .sale_details
            .get(&ledger_canister_id.to_string())
            .map(|wrapper| wrapper.sale_details.clone())
    })
    .ok_or("Sale details not found")?;

    // Return the sale details
    Ok(sale_details)
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
                    // Use a reference to canister_key when accessing the index_canister_ids map
                    let index_canister_id = state
                        .index_canister_ids
                        .get(&canister_key) // <- Here, use & to borrow canister_key
                        .map(|index_wrapper| index_wrapper.index_canister_ids.to_text())
                        .unwrap_or_default();

                    Some(CanisterIndexInfo {
                        canister_id: canister_id,
                        index_canister_id: index_canister_id,
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

    let mut sale_params = Vec::new();
    for token_info in tokens_info {
        // Convert String canister_id back to Principal if necessary
        let canister_id_principal = Principal::from_text(&token_info.canister_id)
            .map_err(|e| format!("Invalid canister ID: {}", e))?;

        let sale_details: SaleDetails = read_state(|state: &State| {
            state
                .sale_details
                .get(&canister_id_principal.to_string())
                .map(|wrapper| wrapper.sale_details.clone())
                .ok_or_else(|| "Sale details not found".to_string())
        })?;

        sale_params.push((token_info, sale_details));
    }

    Ok(sale_params)
}


#[ic_cdk::query]
pub fn get_active_sales() -> Vec<SaleDetailsWithID> {
    let current_time_ns = ic_cdk::api::time(); // Current time in nanoseconds
    let current_time = current_time_ns / 1_000_000_000; // Convert to seconds

    read_state(|state| {
        state
            .sale_details
            .iter()
            .filter_map(|(key, wrapper)| {
                // Clone `key` here to prevent it from being moved
                let funds_raised = state
                    .funds_raised
                    .get(&Principal::from_text(key.clone()).unwrap())
                    .map(|wrapper| wrapper.0)
                    .unwrap_or(0);

                if wrapper.sale_details.start_time_utc <= current_time
                    && wrapper.sale_details.end_time_utc > current_time
                    && funds_raised < wrapper.sale_details.hardcap
                {
                    Some(SaleDetailsWithID {
                        ledger_canister_id: key.clone(),
                        sale_details: wrapper.sale_details.clone(),
                    })
                } else {
                    None
                }
            })
            .collect()
    })
}

#[ic_cdk::query]
pub fn get_upcoming_sales() -> Vec<(SaleDetailsWithID, Nat)> {
    let current_time_ns = ic_cdk::api::time();
    let current_time = current_time_ns / 1_000_000_000; // Convert to seconds

    read_state(|state| {
        state
            .sale_details
            .iter()
            .filter_map(|(key, wrapper)| {
                if wrapper.sale_details.start_time_utc > current_time {
                    let total_supply = state
                        .canister_ids
                        .get(&key)
                        .map(|info| info.total_supply.clone())
                        .unwrap_or_default();
                    Some((
                        SaleDetailsWithID {
                            ledger_canister_id: key.clone(),
                            sale_details: wrapper.sale_details.clone(),
                        },
                        total_supply,
                    ))
                } else {
                    None
                }
            })
            .collect()
    })
}

#[ic_cdk::query]
pub fn get_successful_sales() -> Vec<(SaleDetailsWithID, Nat)> {
    let current_time_ns = ic_cdk::api::time(); // Current time in nanoseconds
    let current_time = current_time_ns / 1_000_000_000; // Convert to seconds

    read_state(|state| {
        state
            .sale_details
            .iter()
            .filter_map(|(key, wrapper)| {
                // Clone `key` here to avoid moving it
                let funds_raised = state
                    .funds_raised
                    .get(&Principal::from_text(key.clone()).unwrap()) // Clone the key for `from_text`
                    .map(|wrapper| wrapper.0)
                    .unwrap_or(0);

                if wrapper.sale_details.end_time_utc < current_time
                    || funds_raised >= wrapper.sale_details.hardcap
                {
                    let total_supply = state
                        .canister_ids
                        .get(&key) // Borrow `key` here directly
                        .map(|info| info.total_supply.clone())
                        .unwrap_or_default();

                    Some((
                        SaleDetailsWithID {
                            ledger_canister_id: key.clone(), // Clone the key for the result
                            sale_details: wrapper.sale_details.clone(),
                        },
                        total_supply,
                    ))
                } else {
                    None
                }
            })
            .collect()
    })
}

#[ic_cdk::query]
pub fn get_all_sales() -> Vec<(SaleDetailsWithID, String)> {
    let current_time_ns = ic_cdk::api::time();
    let current_time = current_time_ns / 1_000_000_000; // Convert nanoseconds to seconds

    let mut all_sales = Vec::new();

    read_state(|state| {
        for (key, wrapper) in state.sale_details.iter() {
            let sale_status = if wrapper.sale_details.start_time_utc <= current_time
                && wrapper.sale_details.end_time_utc > current_time
            {
                "active"
            } else if wrapper.sale_details.start_time_utc > current_time {
                "upcoming"
            } else {
                "successful"
            };

            all_sales.push((
                SaleDetailsWithID {
                    ledger_canister_id: key.clone(),
                    sale_details: wrapper.sale_details.clone(),
                },
                sale_status.to_string(),
            ));
        }
    });

    all_sales
}

#[ic_cdk::query]
pub fn get_funds_raised(ledger_canister_id: Principal) -> Result<u64, String> {
    read_state(|state| {
        if let Some(funds) = state.funds_raised.get(&ledger_canister_id) {
            Ok(funds.0) // Unwrap the U64Wrapper to return the u64 value
        } else {
            Err("No funds found for the given ledger_canister_id.".into())
        }
    })
}


#[query]
pub fn get_user_ledger_ids(user_principal: Principal) -> Vec<Principal> {
    let mut ledger_ids: Vec<Principal> = Vec::new();

    // Read the ledger IDs created with `create_token`
    read_state(|state| {
        for (_, canister_wrapper) in state.canister_ids.iter() {
            if canister_wrapper.owner == user_principal {
                if let Some(ledger_id) = canister_wrapper.ledger_id {
                    ledger_ids.push(ledger_id);
                }
            }
        }

        // Read the ledger IDs imported with `import_token`
        for (_, imported_canister_wrapper) in state.imported_canister_ids.iter() {
            if imported_canister_wrapper.caller == user_principal {
                ledger_ids.push(imported_canister_wrapper.ledger_canister_id);
            }
        }
    });

    ledger_ids
}
