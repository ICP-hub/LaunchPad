use std::time::Duration;

use candid::Principal;
use ic_cdk::api::time;
use ic_cdk_timers::set_timer_interval;
use crate::{perform_refund, send_tokens_to_contributor, STATE};

// use std::{sync::Mutex, time::Duration};
// lazy_static::lazy_static! {
//     static ref HEARTBEAT_LOCK: Mutex<()> = Mutex::new(());
// }

// #[ic_cdk_macros::heartbeat]
// async fn canister_heartbeat() {
//     let _lock = HEARTBEAT_LOCK.lock().unwrap(); // Lock the heartbeat to prevent concurrency
//     ic_cdk::println!("Starting heartbeat...");
//     process_sales_end().await;
//     ic_cdk::println!("Heartbeat finished.");
// }


async fn process_sales_end() {
    let current_time = time() / 1_000_000_000; // Convert to seconds
    ic_cdk::println!("Current time (UTC seconds): {}", current_time);

    let sales_to_process: Vec<(String, bool)> = STATE.with(|s| {
        s.borrow()
            .sale_details
            .iter()
            .filter_map(|(sale_id, sale_wrapper)| {
                let sale_id_clone = sale_id.clone(); // Clone the sale_id here to avoid moving it

                // Retrieve the funds_raised from the map using the sale_id (principal)
                let funds_raised = STATE.with(|s| {
                    s.borrow()
                        .funds_raised
                        .get(&Principal::from_text(&sale_id_clone).unwrap())
                        .map(|wrapper| wrapper.0)
                        .unwrap_or(0)
                });

                if sale_wrapper.sale_details.end_time_utc <= current_time || funds_raised >= sale_wrapper.sale_details.hardcap {
                    let principal_result = Principal::from_text(sale_id_clone.clone());

                    let softcap_reached = match principal_result {
                        Ok(principal) => s
                            .borrow()
                            .funds_raised
                            .get(&principal)
                            .map(|raised| raised.0 >= sale_wrapper.sale_details.softcap)
                            .unwrap_or(false),
                        Err(_) => false,
                    };

                    ic_cdk::println!(
                        "Checking Sale ID: {}, Softcap reached: {}, Hardcap reached: {}, End time passed: {}",
                        sale_id,
                        softcap_reached,
                        funds_raised >= sale_wrapper.sale_details.hardcap,
                        sale_wrapper.sale_details.end_time_utc <= current_time
                    );

                    Some((sale_id.clone(), softcap_reached))
                } else {
                    ic_cdk::println!("Sale ID: {} is still active. Funds raised: {}, End time: {}", 
                                     sale_id, funds_raised, sale_wrapper.sale_details.end_time_utc);
                    None
                }
            })
            .collect()
    });

    ic_cdk::println!("Total sales to process: {}", sales_to_process.len());

    for (sale_id, softcap_reached) in sales_to_process {
        ic_cdk::println!(
            "Processing sale: {} with softcap_reached: {}",
            sale_id,
            softcap_reached
        );
        process_sale(sale_id, softcap_reached).await;
    }
}

async fn process_sale(sale_id: String, softcap_reached: bool) {
    ic_cdk::println!("Starting processing for Sale ID: {}", sale_id);

    let sale_details = STATE.with(|s| {
        s.borrow()
            .sale_details
            .get(&sale_id)
            .map(|wrapper| wrapper.sale_details.clone())
    });

    if let Some(details) = sale_details {
        // Retrieve funds_raised from the map
        let funds_raised = STATE.with(|s| {
            s.borrow()
                .funds_raised
                .get(&Principal::from_text(&sale_id).unwrap())
                .map(|wrapper| wrapper.0)
                .unwrap_or(0)
        });

        ic_cdk::println!(
            "Sale ID: {}, Funds raised: {}, Hardcap: {}, End time: {}",
            sale_id, funds_raised, details.hardcap, details.end_time_utc
        );

        // Check if hardcap or end time reached
        if funds_raised >= details.hardcap || details.end_time_utc <= time() / 1_000_000_000 {
            ic_cdk::println!(
                "Sale ID: {} has ended. Processing sale with softcap_reached: {}",
                sale_id, softcap_reached
            );

            if softcap_reached {
                ic_cdk::println!("Distributing tokens for Sale ID: {}", sale_id);
                if let Err(error) = distribute_tokens(&sale_id).await {
                    ic_cdk::println!("Error distributing tokens for sale {}: {}", sale_id, error);
                }
            } else {
                ic_cdk::println!("Refunding contributors for Sale ID: {}", sale_id);
                if let Err(error) = process_refunds(&sale_id).await {
                    ic_cdk::println!("Error processing refunds for sale {}: {}", sale_id, error);
                }
            }

            // Mark sale as processed
            STATE.with(|s| {
                let mut state = s.borrow_mut();
                if let Some(sale_wrapper) = state.sale_details.get(&sale_id) {
                    let mut updated_sale = sale_wrapper.clone();
                    updated_sale.sale_details.processed = true;
                    state.sale_details.insert(sale_id.clone(), updated_sale); // Clone the sale_id here
                    ic_cdk::println!("Sale ID: {} marked as processed.", sale_id);
                } else {
                    ic_cdk::println!(
                        "Failed to mark sale as processed; sale ID not found: {}",
                        sale_id
                    );
                }
            });
        } else {
            ic_cdk::println!("Sale ID: {} has not ended yet.", sale_id);
        }
    } else {
        ic_cdk::println!("Sale details not found for Sale ID: {}", sale_id);
    }
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

    ic_cdk::println!("Refunding contributors for Sale ID: {}", sale_id);

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
        
        // Retrieve funds_raised from the map
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

        ic_cdk::println!("Listing rate for Sale ID {}: {}", sale_id, listing_rate);

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
            ic_cdk::println!(
                "Distributing {} tokens to contributor {} for sale {}",
                tokens_to_send,
                contributor,
                sale_id
            );
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


#[ic_cdk::post_upgrade]
pub async fn process_sales() {
    set_timer_interval(Duration::from_secs(60), || {
        ic_cdk::spawn(async {
            // This callback will run every minute (60 seconds).
            process_sales_end().await;
        });
    });
}
