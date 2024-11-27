use candid::Principal;
use ic_cdk::{
    api::{
        call::{call_with_payment128, CallResult},
        canister_version,
        management_canister::main::WasmModule, time,

    }, caller, export_candid, heartbeat
};
mod state_handler;
mod params;
mod transaction;
mod types;
mod api_update;
use state_handler::*;
mod api_query;   
use types::*;
use crate::transaction::*;
use candid::Nat;


// create canister
async fn create_canister(
    _arg: CreateCanisterArgument, // Notice the underscore prefix
) -> CallResult<(CanisterIdRecord,)> {
    let caller_principal = caller();
    let predefined_principal = Principal::from_text("aoymu-gaaaa-aaaak-ak5ra-cai").expect("Failed to create principal from text");
    let local_principal:Principal=Principal::from_text("bw4dl-smaaa-aaaaa-qaacq-cai").expect("Failed to create principal from text");

    let settings = CanisterSettings {
        controllers: Some(vec![caller_principal, predefined_principal,local_principal]),
        compute_allocation: None,
        memory_allocation: None,
        freezing_threshold: None,
        reserved_cycles_limit: None,
    };

    let extended_arg = CreateCanisterArgumentExtended {
        settings: Some(settings),
        sender_canister_version: Some(canister_version()), // Replace canister_version() with the actual function or value
    };

    let cycles: u128 = 1_500_000_000_000; // Number of cycles to provision for canister creation

    call_with_payment128(
        Principal::management_canister(),
        "create_canister",
        (extended_arg,),
        cycles,
    ).await
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

#[ic_cdk::update]
pub async fn icrc28_trusted_origins() -> Icrc28TrustedOriginsResponse {
    let trusted_origins = vec![
        String::from("https://ajzka-lyaaa-aaaak-ak5rq-cai.icp0.io"),
        String::from("http://localhost:3000"),
        String::from("http://avqkn-guaaa-aaaaa-qaaea-cai.localhost:4943"),
        String::from("http://127.0.0.1:4943/?canisterId=aoymu-gaaaa-aaaak-ak5ra-cai"),
        String::from("http://127.0.0.1:4943"),
        String::from("http://localhost:4200"),
    ];

    return Icrc28TrustedOriginsResponse { trusted_origins };
}


#[heartbeat]
async fn process_sales_end() {
    let current_time = time() / 1_000_000_000; // Convert time to seconds
    let sales_to_process: Vec<(String, bool)> = STATE.with(|s| {
        s.borrow().sale_details.iter()
            .filter_map(|(sale_id, sale_wrapper)| {
                if sale_wrapper.sale_details.end_time_utc <= current_time {
                    // Clone `sale_id` here for use in the Principal conversion
                    let principal_result = Principal::from_text(sale_id.clone());
                    
                    let softcap_reached = match principal_result {
                        Ok(principal) => s.borrow().funds_raised
                            .get(&principal)
                            .map(|raised| raised.0 >= sale_wrapper.sale_details.softcap)
                            .unwrap_or(false),
                        Err(_) => false
                    };

                    Some((sale_id.clone(), softcap_reached)) // Collect sales and softcap status
                } else {
                    None
                }
            })
            .collect()
    });

    for (sale_id, softcap_reached) in sales_to_process {
        process_sale(sale_id, softcap_reached).await;
    }
}


#[heartbeat]
async fn process_sale(sale_id: String, softcap_reached: bool) {  // Adjust to take String directly
    if softcap_reached {
        distribute_tokens(&sale_id).await;
    } else {
        process_refunds(&sale_id).await;
    }

    // Mark the sale as processed indirectly
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        if let Some(sale_wrapper) = state.sale_details.get(&sale_id) {  // Use &sale_id to match type
            let mut modified_sale = sale_wrapper.clone();
            modified_sale.sale_details.processed = true;  // Modify cloned data
            state.sale_details.insert(sale_id, modified_sale);  // Reinsert modified data
        }
    });
}

async fn process_refunds(sale_id: &str) {
    let refunds: Vec<(Principal, u64)> = STATE.with(|s| {
        s.borrow().contributions.iter()
            .filter_map(|((sale, contributor), amount)| {
                match Principal::from_text(sale_id) {
                    Ok(sale_principal) => {
                        if sale == sale_principal {
                            Some((contributor.clone(), amount.0)) // Collect contributors and amounts
                        } else {
                            None
                        }
                    },
                    Err(_) => None, // Handle invalid principal conversion gracefully
                }
            })
            .collect()
    });

    for (contributor, amount) in refunds {
        let transfer_result = perform_refund(&contributor, amount).await;
        if let Err(error) = transfer_result {
            ic_cdk::println!("Failed to refund {} for sale {}: {}", contributor, sale_id, error);
        }
    }
}


async fn distribute_tokens(sale_id: &str) {
    // Convert sale_id to String to match the StableBTreeMap key type
    let sale_id_string = sale_id.to_string();

    let sale_details = STATE.with(|s| {
        s.borrow()
            .sale_details
            .get(&sale_id_string) // Use String here
            .map(|wrapper| wrapper.sale_details.clone())
    });

    if let Some(details) = sale_details {
        let total_tokens = details.tokens_for_fairlaunch + details.tokens_for_liquidity;
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
            s.borrow().contributions.iter()
                .filter_map(|((sale, contributor), amount)| {
                    if sale == Principal::from_text(&sale_id_string).unwrap() {
                        Some((contributor.clone(), amount.0)) // Collect contributors and their contributions
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
                    tokens_to_send, contributor, sale_id, error
                );
            }
        }
    }
}



export_candid!();