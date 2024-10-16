use candid::Principal;

use crate::{read_state, CanisterIndexInfo, SaleDetails, SaleDetailsWithID, UserAccount};

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
pub fn search_by_token_name_or_symbol(token_identifier: String) -> Option<CanisterIndexInfo> {
    read_state(|state| {
        // Iterate through the canister_ids map
        for (canister_key, canister_wrapper) in state.canister_ids.iter() {
            // Check if the token_name or token_symbol matches the token_identifier
            if canister_wrapper.token_name == token_identifier || canister_wrapper.token_symbol == token_identifier {
                // Find the corresponding index canister
                let index_canister_id = state.index_canister_ids.get(&canister_key)
                    .map(|index_wrapper| index_wrapper.index_canister_ids.to_string())
                    .unwrap_or_default();

                // Return the relevant CanisterIndexInfo
                return Some(CanisterIndexInfo {
                    canister_id: canister_key.clone(),
                    index_canister_id,
                    token_name: canister_wrapper.token_name.clone(),
                    token_symbol: canister_wrapper.token_symbol.clone(),
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
        state.canister_ids.get(&ledger_id.to_string()).and_then(|canister_entry| {
            // Return the image_id if available
            canister_entry.image_id
        })
    })
}

#[ic_cdk::query]
pub fn get_profile_image_id() -> Option<u32> {
    let principal = ic_cdk::api::caller();  // Get the caller's principal

    read_state(|state| {
        state.image_ids.get(&principal.to_string()).map(|wrapper| wrapper.image_id)
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

#[ic_cdk::query]
pub fn get_upcoming_sales() -> Vec<SaleDetailsWithID> {
    let current_time = ic_cdk::api::time();
    ic_cdk::println!("Current server time for upcoming sales check: {}", current_time); // Debugging current time

    read_state(|state| {
        let all_sales = state.sale_details.iter()
            .map(|(key, wrapper)| {
                ic_cdk::println!("Checking sale: {} at time {}, start_time_utc: {}", key, current_time, wrapper.sale_details.start_time_utc); // Debug each sale
                (key.clone(), wrapper.clone())
            })
            .collect::<Vec<_>>(); // Collect all sales for debugging

        all_sales.into_iter()
            .filter_map(|(key, wrapper)| {
                if wrapper.sale_details.start_time_utc > current_time {
                    ic_cdk::println!("Adding upcoming sale: {} to results", key); // Debug when adding a sale
                    Some(SaleDetailsWithID {
                        ledger_canister_id: key,
                        sale_details: wrapper.sale_details,
                    })
                } else {
                    None
                }
            })
            .collect()
    })
}


#[ic_cdk::query]
pub fn get_active_sales() -> Vec<SaleDetailsWithID> {
    let current_time = ic_cdk::api::time();

    read_state(|state| {
        state.sale_details.iter()
            .filter_map(|(key, wrapper)| {
                if wrapper.sale_details.start_time_utc <= current_time && wrapper.sale_details.end_time_utc > current_time {
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
pub fn get_successful_sales() -> Vec<SaleDetailsWithID> {
    let current_time = ic_cdk::api::time();

    read_state(|state| {
        state.sale_details.iter()
            .filter_map(|(key, wrapper)| {
                if wrapper.sale_details.end_time_utc < current_time {
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



