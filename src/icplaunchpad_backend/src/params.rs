
use candid::{Nat, Principal};
use lazy_static::lazy_static;
use std::sync::Mutex;

use crate::types::{Account, ArchiveOptions, FeatureFlags};

lazy_static! {
    pub static ref MINTING_ACCOUNT: Mutex<Result<Account, String>> = Mutex::new(
        Principal::from_text("h67dy-6eawy-xhvgv-k2a3j-g2vsc-2efqg-i7a36-5stsb-zg7dq-yu7gi-zqe")//minter
            .map(|owner| Account { owner, subaccount: None })
            .map_err(|e| format!("Invalid Principal for MINTING_ACCOUNT: {:?}", e))
    );

    pub static ref FEE_COLLECTOR_ACCOUNT: Mutex<Result<Account, String>> = Mutex::new(
        Principal::from_text("wo4qc-igxxg-32h46-airnk-woc63-ixpru-7gb5c-blgku-cokyl-w6hul-3ae")//feecollector
            .map(|owner| Account { owner, subaccount: None })
            .map_err(|e| format!("Invalid Principal for FEE_COLLECTOR_ACCOUNT: {:?}", e))
    );

    pub static ref ARCHIVE_OPTIONS: Mutex<Result<ArchiveOptions, String>> = Mutex::new(
        Principal::from_text("aoymu-gaaaa-aaaak-ak5ra-cai")//archive_controller
            .map(|controller_id| ArchiveOptions {
                num_blocks_to_archive: 1000,
                max_transactions_per_response: Some(100),
                trigger_threshold: 500,
                max_message_size_bytes: Some(2_000_000),
                cycles_for_archive_creation: Some(100_000_000_000),
                node_max_memory_size_bytes: Some(10_000_000_000),
                controller_id,
            })
            .map_err(|e| format!("Invalid Principal for ARCHIVE_OPTIONS: {:?}", e))
    );

    pub static ref TRANSFER_FEE: Nat = Nat::from(0u64); // Lazy initialization for Nat
}

// Other hardcoded constants
pub const MAX_MEMO_LENGTH: u16 = 64;
pub const MAXIMUM_NUMBER_OF_ACCOUNTS: u64 = 1_000_000;
pub const ACCOUNTS_OVERFLOW_TRIM_QUANTITY: u64 = 100;

// Feature flags as a constant
pub const FEATURE_FLAGS: FeatureFlags = FeatureFlags {
    icrc2: true,
};
