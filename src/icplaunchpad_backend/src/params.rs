use candid::{Nat, Principal};
use lazy_static::lazy_static;
use std::sync::Mutex;

use crate::types::{Account, ArchiveOptions, FeatureFlags};

lazy_static! {
    pub static ref ARCHIVE_OPTIONS: Mutex<Result<ArchiveOptions, String>> = Mutex::new(
        Ok(ArchiveOptions {
            num_blocks_to_archive: 1000,
            max_transactions_per_response: Some(100),
            trigger_threshold: 500,
            max_message_size_bytes: Some(2_000_000),
            cycles_for_archive_creation: Some(100_000_000_000),
            node_max_memory_size_bytes: Some(10_000_000_000),
            controller_id: "aoymu-gaaaa-aaaak-ak5ra-cai".parse().unwrap(), // Assuming controller ID does not change
        })
    );

    pub static ref MINTING_ACCOUNT: Result<Account, String> = Principal::from_text("aoymu-gaaaa-aaaak-ak5ra-cai")
        .map(|owner| Account { owner, subaccount: None })
        .map_err(|e| format!("Invalid Principal for MINTING_ACCOUNT: {:?}", e));

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
