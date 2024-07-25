use candid::{CandidType, Principal};
use ic_cdk::export_candid;
use ic_cdk_macros::{update, query};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Serialize, Clone)]
struct TokenParams {
    token_symbol: String,
    token_name: String,
    minting_account: Principal,
    transfer_fee: u64,
    initial_balance_principal: Principal,
    initial_balance_amount: u64,
    num_blocks_to_archive: u64,
    trigger_threshold: u64,
    controller_id: Principal,
    cycles_for_archive_creation: u64,
    icrc2_feature_flag: bool,
}

thread_local! {
    static TOKEN_PARAMS_STORAGE: RefCell<HashMap<u64, TokenParams>> = RefCell::new(HashMap::new());
    static TOKEN_COUNTER: RefCell<u64> = RefCell::new(0);
}

#[update]
fn create_token(params: TokenParams) -> Result<u64, String> {
    let params_clone = params.clone();
    let token_id = TOKEN_COUNTER.with(|counter| {
        let mut counter = counter.borrow_mut();
        *counter += 1;
        *counter
    });

    TOKEN_PARAMS_STORAGE.with(|storage| {
        storage.borrow_mut().insert(token_id, params);
    });

    // Call the function to create and run the script
    match create_and_run_script(token_id, &params_clone) {
        Ok(_) => Ok(token_id),
        Err(e) => Err(e),
    }
}

#[query]
fn get_token_params(token_id: u64) -> Option<TokenParams> {
    TOKEN_PARAMS_STORAGE.with(|storage| storage.borrow().get(&token_id).cloned())
}

fn create_and_run_script(token_id: u64, params: &TokenParams) -> Result<(), String> {
    let script_content = format!(r#"
        #!/bin/bash
        export PRE_MINTED_TOKENS={initial_balance_amount}
        dfx identity use default
        export DEFAULT=$(dfx identity get-principal)
        
        export TRANSFER_FEE={transfer_fee}
        
        dfx identity new archive_controller
        dfx identity use archive_controller
        export ARCHIVE_CONTROLLER=$(dfx identity get-principal)
        
        export TRIGGER_THRESHOLD={trigger_threshold}
        export CYCLE_FOR_ARCHIVE_CREATION={cycles_for_archive_creation}
        export NUM_OF_BLOCK_TO_ARCHIVE={num_blocks_to_archive}
        
        export TOKEN_NAME="{token_name}"
        export TOKEN_SYMBOL="{token_symbol}"
        
        dfx identity new minter
        dfx identity use minter
        export MINTER=$(dfx identity get-principal)
        
        export FEATURE_FLAGS={icrc2_feature_flag}
        
        dfx deploy prac --argument "(variant {{Init =
        record {{
            token_symbol = \\"{token_symbol}\\";
            token_name = \\"{token_name}\\";
            minting_account = record {{ owner = principal \\"${{MINTER}}\\" }};
            transfer_fee = {transfer_fee};
            metadata = vec {{}};
            feature_flags = opt record{{icrc2 = {icrc2_feature_flag}}};
            initial_balances = vec {{ record {{ record {{ owner = principal \\"${{DEFAULT}}\\" }}; {initial_balance_amount}; }} }};
            archive_options = record {{
                num_blocks_to_archive = {num_blocks_to_archive};
                trigger_threshold = {trigger_threshold};
                controller_id = principal \\"${{ARCHIVE_CONTROLLER}}\\";
                cycles_for_archive_creation = opt {cycles_for_archive_creation};
            }};
        }}
        }})"
    "#,
    initial_balance_amount = params.initial_balance_amount,
    transfer_fee = params.transfer_fee,
    trigger_threshold = params.trigger_threshold,
    cycles_for_archive_creation = params.cycles_for_archive_creation,
    num_blocks_to_archive = params.num_blocks_to_archive,
    token_name = params.token_name,
    token_symbol = params.token_symbol,
    icrc2_feature_flag = if params.icrc2_feature_flag { "true" } else { "false" }
    );

    let script_path = format!("/tmp/deploy_token_{}.sh", token_id);

    std::fs::write(&script_path, script_content).map_err(|e| e.to_string())?;
    std::process::Command::new("chmod")
        .arg("+x")
        .arg(&script_path)
        .output()
        .map_err(|e| e.to_string())?;

    std::process::Command::new(&script_path)
        .output()
        .map_err(|e| e.to_string())?;

    Ok(())
}

export_candid!();
