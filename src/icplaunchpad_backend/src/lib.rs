use candid::Principal;
use ic_cdk::{
    api::{
        call::{call_with_payment128, CallResult},
        canister_version,
        management_canister::main::WasmModule,

    }, export_candid
};
mod state_handler;
mod params;
mod transaction;
mod types;
mod api_query;
mod api_update;
use state_handler::*;
use types::*;


// create canister
async fn create_canister(
    arg: CreateCanisterArgument, // cycles: u128,
) -> CallResult<(CanisterIdRecord,)> {
    let extended_arg = CreateCanisterArgumentExtended {
        settings: arg.settings,
        sender_canister_version: Some(canister_version()),
    };
    let cycles: u128 = 100_000_000_000;

    call_with_payment128(
        Principal::management_canister(),
        "create_canister",
        (extended_arg,),
        cycles,
    )
    .await
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


pub async fn icrc28_trusted_origins() -> Icrc28TrustedOriginsResponse {
    let trusted_origins = vec![
        "https://ajzka-lyaaa-aaaak-ak5rq-cai.icp0.io".to_string(),
        "http://localhost:3000".to_string(),
        "http://avqkn-guaaa-aaaaa-qaaea-cai.localhost:4943".to_string(),
        "http://127.0.0.1:4943/?canisterId=aoymu-gaaaa-aaaak-ak5ra-cai".to_string(),
        "http://127.0.0.1:4943".to_string(),
        "http://localhost:4200".to_string(),
    ];

    Icrc28TrustedOriginsResponse {
        trusted_origins,
    }
}


export_candid!();