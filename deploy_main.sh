#!/bin/bash

# Ensure the necessary identity is being used
dfx identity use Mohit || { echo "Identity 'Mohit' does not exist. Exiting."; exit 1; }

# Deploy the token_deployer canister
dfx deploy token_deployer --ic --argument '(
  variant {
    Init = record {
      decimals = opt (1 : nat8);
      token_symbol = "blah";
      transfer_fee = 1 : nat;
      metadata = vec {};
      minting_account = record {
        owner = principal "aaaaa-aa";
        subaccount = null;
      };
      initial_balances = vec {
        record {
          record { owner = principal "aaaaa-aa"; subaccount = null };
          1 : nat;
        };
      };
      maximum_number_of_accounts = null;
      accounts_overflow_trim_quantity = null;
      fee_collector_account = null;
      archive_options = record {
        num_blocks_to_archive = 1 : nat64;
        max_transactions_per_response = null;
        trigger_threshold = 1 : nat64;
        max_message_size_bytes = null;
        cycles_for_archive_creation = null;
        node_max_memory_size_bytes = null;
        controller_id = principal "aaaaa-aa";
      };
      max_memo_length = null;
      token_name = "example";
      feature_flags = opt record { icrc2 = true };
    }
  }
)'

# Deploy the index_canister
dfx deploy index_canister --ic --argument '(opt variant { Init = record { ledger_id = principal "aaaaa-aa"; retrieve_blocks_from_ledger_interval_seconds = opt 10 } })'

# Switch to the minter identity and set the minter account ID
dfx identity use minter || { echo "Identity 'minter' does not exist. Exiting."; exit 1; }
if [ -z "$MINTER_ACCOUNT_ID" ]; then
  export MINTER_ACCOUNT_ID=$(dfx ledger account-id)
fi

# Switch to the default identity and set the default account ID
dfx identity use default || { echo "Identity 'default' does not exist. Exiting."; exit 1; }
if [ -z "$DEFAULT_ACCOUNT_ID" ]; then
  export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)
fi
# Return to the Mohit identity for further deployments
dfx identity use Mohit

# Deploy additional canisters
dfx deploy ic_asset_handler --ic
dfx deploy icplaunchpad_frontend --ic

# Build and extract Candid for the backend
cargo build --release --target wasm32-unknown-unknown --package icplaunchpad_backend
candid-extractor target/wasm32-unknown-unknown/release/icplaunchpad_backend.wasm > src/icplaunchpad_backend/icplaunchpad_backend.did

# Deploy the backend
dfx deploy icplaunchpad_backend --ic

# Final message
echo "Deployment complete. Please use the Candid UI to call the 'create_token' function with your parameters."
echo "Or run ./tokendeploy.sh to run example token parameters."
