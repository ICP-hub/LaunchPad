use std::time::Duration;

use candid::{Nat, Principal};
use ic_cdk::api::{call::CallResult, time};
use ic_cdk_timers::set_timer_interval;
use crate::{api_query::get_sale_params, perform_refund, send_tokens_to_contributor, tax_transfer_on_funds_raised, tax_transfer_on_tokens, Account, TransferFromArgs, TransferFromResult, U64Wrapper, STATE};


async fn process_sales_end() {
    let current_time = time() / 1_000_000_000; // Convert to seconds
    ic_cdk::println!("Current time (UTC seconds): {}", current_time);

    let sales_to_process: Vec<(Principal, bool)> = STATE.with(|s| {
        s.borrow()
            .sale_details
            .iter()
            .filter_map(|(sale_id, sale_wrapper)| {
                let funds_raised = STATE.with(|state| {
                    state
                        .borrow()
                        .funds_raised
                        .get(&sale_id)
                        .map(|wrapper| wrapper.0)
                        .unwrap_or(0)
                });

                let sale_details = &sale_wrapper.sale_details;

                // Determine if the sale has ended
                if sale_details.end_time_utc <= current_time || funds_raised >= sale_details.hardcap {
                    let softcap_reached = funds_raised >= sale_details.softcap;

                    ic_cdk::println!(
                        "Sale ID: {:?}, Softcap reached: {}, Hardcap reached: {}, End time passed: {}",
                        sale_id,
                        softcap_reached,
                        funds_raised >= sale_details.hardcap,
                        sale_details.end_time_utc <= current_time
                    );

                    Some((sale_id, softcap_reached))
                } else {
                    ic_cdk::println!(
                        "Sale ID: {:?} is still active. Funds raised: {}, End time: {}",
                        sale_id, funds_raised, sale_details.end_time_utc
                    );
                    None
                }
            })
            .collect()
    });

    ic_cdk::println!("Total sales to process: {}", sales_to_process.len());

    for (sale_id, softcap_reached) in sales_to_process {
        ic_cdk::println!(
            "Processing sale: {:?} with softcap_reached: {}",
            sale_id,
            softcap_reached
        );
        match process_sale(sale_id, softcap_reached).await {
            Ok(_) => ic_cdk::println!("Sale processed successfully for Sale ID: {:?}", sale_id),
            Err(e) => ic_cdk::println!("Error processing Sale ID {:?}: {}", sale_id, e),
        }
        
    }
}


async fn process_sale(sale_id: Principal, softcap_reached: bool) -> Result<(), String> {
    ic_cdk::println!("Starting processing for Sale ID: {:?}", sale_id);

    let sale_details = STATE.with(|s| {
        s.borrow()
            .sale_details
            .get(&sale_id)
            .map(|wrapper| wrapper.sale_details.clone())
    });

    if let Some(details) = sale_details {
        ic_cdk::println!(
            "Processing Sale ID: {:?}, Softcap reached: {}, Hardcap: {}, End time: {}",
            sale_id, softcap_reached, details.hardcap, details.end_time_utc
        );

        if details.processed {
            ic_cdk::println!("Sale ID: {:?} has already been processed.", sale_id);
            return Ok(()); // Skip already processed sales
        }

        // Process the sale based on whether the softcap was reached
        let result = if softcap_reached {
            ic_cdk::println!("Distributing tokens for Sale ID: {:?}", sale_id);
            distribute_tokens(&sale_id).await
        } else {
            ic_cdk::println!("Refunding contributors for Sale ID: {:?}", sale_id);
            process_refunds(sale_id).await
        };

        match result {
            Ok(_) => {
                // Mark the sale as processed
                STATE.with(|s| {
                    let mut state = s.borrow_mut();
                    if let Some(wrapper) = state.sale_details.get(&sale_id) {
                        let mut updated_sale = wrapper.clone();
                        updated_sale.sale_details.processed = true;
                        state.sale_details.insert(sale_id, updated_sale);
                        ic_cdk::println!("Sale ID: {:?} marked as processed.", sale_id);
                    } else {
                        ic_cdk::println!(
                            "Failed to mark sale as processed; Sale ID not found: {:?}",
                            sale_id
                        );
                    }
                });

                // Only trigger `transfer_fee_and_liquidity_to_backend` if tokens were successfully distributed (softcap_reached)
                if softcap_reached {
                    transfer_fee_and_liquidity_to_backend(sale_id).await?;

                    // After the above transfer is successful, trigger the tax transfer (fee only)
                    let fee_amount = details.fee_for_approval;  // The fee to send
                    tax_transfer_on_tokens(sale_id, fee_amount).await?; // Send the fee to the fee collector

                    // Now trigger the tax transfer on funds raised
                    tax_transfer_on_funds_raised(sale_id).await?; // Transfer fee on funds raised to fee collector
                }

                Ok(()) // Return Ok after processing
            }
            Err(error) => {
                ic_cdk::println!(
                    "Error processing sale ID {:?}: {}. Retrying later.",
                    sale_id, error
                );
                // Optionally: Schedule a retry for failed operations
                Err(error) // Return the error if processing fails
            }
        }
    } else {
        ic_cdk::println!("Sale details not found for Sale ID: {:?}", sale_id);
        Err(format!("Sale details not found for Sale ID: {:?}", sale_id)) // Return error if sale details are not found
    }
}




async fn process_refunds(sale_id: Principal) -> Result<(), String> {
    // Retrieve contributions for the sale
    let refunds: Vec<(Principal, u64)> = STATE.with(|s| {
        let state = s.borrow();
        state
            .contributions
            .iter()
            .filter_map(|((sale, contributor), amount)| {
                if sale == sale_id {
                    Some((contributor.clone(), amount.0))
                } else {
                    None
                }
            })
            .collect()
    });

    if refunds.is_empty() {
        ic_cdk::println!("No refunds found for Sale ID {:?}", sale_id);
        return Err(format!("No refunds found for Sale ID {:?}", sale_id));
    }

    ic_cdk::println!("Refunds found for Sale ID {:?}: {:?}", sale_id, refunds);

    let mut failed_refunds: Vec<(Principal, u64)> = Vec::new();

    // Process refunds
    for (contributor, amount) in refunds {
        ic_cdk::println!(
            "Processing refund of {} ICP to contributor {:?} for Sale ID {:?}",
            amount, contributor, sale_id
        );

        // Attempt refund
        match perform_refund(&sale_id, &contributor, amount).await {
            Ok(_) => {
                // Remove successful refund from state
                STATE.with(|s| {
                    let mut state = s.borrow_mut();
                    state.contributions.remove(&(sale_id.clone(), contributor.clone()));
                });
                ic_cdk::println!(
                    "Successfully refunded {} ICP to contributor {:?}",
                    amount, contributor
                );
            }
            Err(error) => {
                ic_cdk::println!(
                    "Failed to refund {} ICP to contributor {:?}: {}",
                    amount, contributor, error
                );
                failed_refunds.push((contributor, amount));
            }
        }
    }

    if !failed_refunds.is_empty() {
        ic_cdk::println!(
            "Refunding process for Sale ID {:?} completed with {} failed refunds.",
            sale_id,
            failed_refunds.len()
        );
        return Err("Some refunds failed. They will be retried.".to_string());
    }

    ic_cdk::println!("All refunds processed successfully for Sale ID: {:?}", sale_id);
    Ok(())
}


async fn distribute_tokens(sale_id: &Principal) -> Result<(), String> {
    // Retrieve sale details from the state
    let sale_details = STATE.with(|s| {
        s.borrow()
            .sale_details
            .get(sale_id)
            .map(|wrapper| wrapper.sale_details.clone())
    });

    if let Some(details) = sale_details {
        let total_tokens = details.tokens_for_fairlaunch; // Only consider fairlaunch tokens for listing rate

        // Retrieve funds_raised from the map
        let funds_raised = STATE.with(|s| {
            s.borrow()
                .funds_raised
                .get(sale_id) // Use sale_id directly
                .map(|wrapper| wrapper.0)
                .unwrap_or(0)
        });

        if funds_raised == 0 {
            ic_cdk::println!("No funds raised for Sale ID {}. No tokens to distribute.", sale_id);
            return Ok(());
        }

        // Calculate listing rate
        let listing_rate = total_tokens as u128 / funds_raised as u128;

        ic_cdk::println!("Listing rate for Sale ID {}: {} tokens per 1 ICP", sale_id, listing_rate);

        // Retrieve creator's principal
        let creator = details.creator;

        // Retrieve contributors for the sale
        let contributions: Vec<(Principal, u64)> = STATE.with(|s| {
            s.borrow()
                .contributions
                .iter()
                .filter_map(|((sale, contributor), amount)| {
                    if sale == *sale_id {
                        Some((contributor.clone(), amount.0))
                    } else {
                        None
                    }
                })
                .collect()
        });

        let mut failed_transfers: Vec<(Principal, u64)> = Vec::new();

        // Batch size for processing distributions
        let batch_size = 10;
        for chunk in contributions.chunks(batch_size) {
            for (contributor, contribution) in chunk {
                let tokens_to_send = ((*contribution as u128 * listing_rate) / 1) as u64;

                ic_cdk::println!(
                    "Distributing {} tokens to contributor {} for sale {}",
                    tokens_to_send, contributor, sale_id
                );

                let transfer_result =
                    send_tokens_to_contributor(sale_id, &creator, contributor, tokens_to_send)
                        .await;
                if let Err(error) = transfer_result {
                    ic_cdk::println!(
                        "Failed to send {} tokens to {} for sale {}: {}",
                        tokens_to_send, contributor, sale_id, error
                    );
                    failed_transfers.push((contributor.clone(), tokens_to_send));
                }
            }
        }

        // Handle failed transfers
        if !failed_transfers.is_empty() {
            ic_cdk::println!(
                "Token distribution for Sale ID {} completed with {} failed transfers.",
                sale_id, failed_transfers.len()
            );

            STATE.with(|s| {
                let mut state = s.borrow_mut();
                for (contributor, tokens) in failed_transfers {
                    state.contributions.insert(
                        (*sale_id, contributor),
                        U64Wrapper(tokens),
                    );
                }
            });

            Err("Some token distributions failed. They will be retried.".to_string())
        } else {
            ic_cdk::println!("All tokens distributed successfully for Sale ID: {}", sale_id);
            Ok(())
        }
    } else {
        ic_cdk::println!("Sale details not found for Sale ID: {}", sale_id);
        Err("Sale details not found.".to_string())
    }
}



//FUNCTION WHICH SENDS LIQUIDITY+FEE TO BACKEND POST SALE.
async fn transfer_fee_and_liquidity_to_backend(ledger_canister_id: Principal) -> Result<(), String> {
    // Get the sale parameters using the ledger canister ID
    let sale_details = get_sale_params(ledger_canister_id)?;

    // Ensure the sale has ended and tokens were distributed
    if !sale_details.processed || !sale_details.is_ended {
        return Err(format!("Sale ID {:?} has not ended or processed.", ledger_canister_id));
    }

    // Retrieve the creator of the sale
    let creator = sale_details.creator;
    
    // Retrieve the backend canister ID (where funds will be transferred)
    let backend_canister_id = ic_cdk::id();

    // Create transfer arguments for liquidity tokens after fee and the fee amount
    let transfer_args = TransferFromArgs {
        amount: Nat::from(sale_details.tokens_for_liquidity_after_fee + sale_details.fee_for_approval),
        to: Account {
            owner: backend_canister_id,
            subaccount: None,
        },
        fee: None, // No fee for this transfer
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
        from: Account {
            owner: creator, // The creator of the sale is sending the tokens
            subaccount: None,
        },
    };

    // Call `icrc2_transfer_from` to transfer the tokens to the backend canister
    let response: CallResult<(TransferFromResult,)> = ic_cdk::call(
        ledger_canister_id,  // The ledger canister associated with the sale
        "icrc2_transfer_from",
        (transfer_args,),
    )
    .await;

    match response {
        Ok((TransferFromResult::Ok(block_index),)) => {
            ic_cdk::println!("Transfer successful. Block index: {}", block_index);
            Ok(())
        }
        Ok((TransferFromResult::Err(error),)) => {
            Err(format!("Transfer failed: {:?}", error))
        }
        Err((code, message)) => {
            Err(format!("Failed to call ledger: {:?} - {}", code, message))
        }
    }
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
