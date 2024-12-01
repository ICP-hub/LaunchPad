use candid::Principal;
use ic_cdk::api::time;

use crate::{perform_refund, send_tokens_to_contributor, STATE};

#[ic_cdk_macros::heartbeat]
async fn canister_heartbeat() {
    process_sales_end().await;
}

async fn process_sales_end() {
    let current_time = time() / 1_000_000_000; // Convert time to seconds
                                               // ic_cdk::println!("Current time: {}", current_time); // Log current time

    let sales_to_process: Vec<(String, bool)> = STATE.with(|s| {
        s.borrow()
            .sale_details
            .iter()
            .filter_map(|(sale_id, sale_wrapper)| {
                if sale_wrapper.sale_details.end_time_utc <= current_time {
                    let principal_result = Principal::from_text(sale_id.clone());

                    let softcap_reached = match principal_result {
                        Ok(principal) => s
                            .borrow()
                            .funds_raised
                            .get(&principal)
                            .map(|raised| raised.0 >= sale_wrapper.sale_details.softcap)
                            .unwrap_or(false),
                        Err(_) => false,
                    };

                    ic_cdk::println!("Sale ID: {}, Softcap reached: {}", sale_id, softcap_reached); // Log sale info

                    Some((sale_id.clone(), softcap_reached))
                } else {
                    None
                }
            })
            .collect()
    });

    for (sale_id, softcap_reached) in sales_to_process {
        ic_cdk::println!(
            "Processing sale: {} with softcap_reached: {}",
            sale_id,
            softcap_reached
        ); // Log before processing
        process_sale(sale_id, softcap_reached).await;
    }
}

async fn process_sale(sale_id: String, softcap_reached: bool) {
    if softcap_reached {
        if let Err(error) = distribute_tokens(&sale_id).await {
            // Handle the error by logging, without propagating it
            ic_cdk::println!("Error distributing tokens for sale {}: {}", sale_id, error);
        }
    } else {
        if let Err(error) = process_refunds(&sale_id).await {
            // Handle the error by logging, without propagating it
            ic_cdk::println!("Error processing refunds for sale {}: {}", sale_id, error);
        }
    }

    // Mark the sale as processed in stable memory
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        if let Some(sale_wrapper) = state.sale_details.get(&sale_id) {
            let mut updated_sale = sale_wrapper.clone();
            updated_sale.sale_details.processed = true;
            state.sale_details.insert(sale_id, updated_sale);
        } else {
            ic_cdk::println!(
                "Failed to mark sale as processed; sale ID not found: {}",
                sale_id
            );
        }
    });
}

async fn process_refunds(sale_id: &str) -> Result<(), String> {
    let refunds: Vec<(Principal, u64)> = STATE.with(|s| {
        s.borrow()
            .contributions
            .iter()
            .filter_map(|((sale, contributor), amount)| {
                match Principal::from_text(sale_id) {
                    Ok(sale_principal) => {
                        if sale == sale_principal {
                            Some((contributor.clone(), amount.0)) // Collect contributors and amounts
                        } else {
                            None
                        }
                    }
                    Err(_) => None, // Handle invalid principal conversion gracefully
                }
            })
            .collect()
    });

    for (contributor, amount) in refunds {
        let transfer_result = perform_refund(&contributor, amount).await;
        if let Err(error) = transfer_result {
            ic_cdk::println!(
                "Failed to refund {} for sale {}: {}",
                contributor,
                sale_id,
                error
            );
        }
    }

    // Explicitly return Ok(()) at the end
    Ok(())
}

async fn distribute_tokens(sale_id: &str) -> Result<(), String> {
    let sale_id_string = sale_id.to_string();

    let sale_details = STATE.with(|s| {
        s.borrow()
            .sale_details
            .get(&sale_id_string)
            .map(|wrapper| wrapper.sale_details.clone())
    });

    if let Some(details) = sale_details {
        let total_tokens = details.tokens_for_fairlaunch; // Only consider fairlaunch tokens for listing rate
        let funds_raised = STATE.with(|s| {
            s.borrow()
                .funds_raised
                .get(&Principal::from_text(&sale_id_string).unwrap())
                .map(|wrapper| wrapper.0)
                .unwrap_or(0)
        });

        let listing_rate = if funds_raised > 0 {
            total_tokens as f64 / funds_raised as f64
        } else {
            0.0
        };

        // Distribute tokens to contributors
        let contributions: Vec<(Principal, u64)> = STATE.with(|s| {
            s.borrow()
                .contributions
                .iter()
                .filter_map(|((sale, contributor), amount)| {
                    if sale == Principal::from_text(&sale_id_string).unwrap() {
                        Some((contributor.clone(), amount.0))
                    } else {
                        None
                    }
                })
                .collect()
        });

        for (contributor, contribution) in contributions {
            let tokens_to_send = (contribution as f64 * listing_rate).floor() as u64;
            let transfer_result = send_tokens_to_contributor(&contributor, tokens_to_send).await;
            if let Err(error) = transfer_result {
                ic_cdk::println!(
                    "Failed to send {} tokens to {} for sale {}: {}",
                    tokens_to_send,
                    contributor,
                    sale_id,
                    error
                );
            }
        }
    }

    Ok(())
}
