#!/bin/bash

# exec > deploy.log 2>&1

set -a
source .env
set +a




# # Check if the controller identity exists, if not, create it
# if ! dfx identity list | grep -q "controller"; then
#   dfx identity new controller
# fi
dfx identity use controller

# Deploy the token_deployer canister with specified arguments
dfx deploy token_deployer --argument '(
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


# Deploy the index canister with specified arguments
dfx deploy index_canister --argument '(opt variant { Init = record { ledger_id = principal "aaaaa-aa"; retrieve_blocks_from_ledger_interval_seconds = opt 10 } })'

# # Check if the minter identity exists, if not, create it
# if ! dfx identity list | grep -q "minter"; then
#   dfx identity new minter
# fi
dfx identity use minter

# Set MINTER_ACCOUNT_ID only if not already set
# if [ -z "$MINTER_ACCOUNT_ID" ]; then
  export MINTER_ACCOUNT_ID=$(dfx ledger account-id)
# fi

# Switch back to the default identity and set DEFAULT_ACCOUNT_ID only if not already set
dfx identity use default

export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)


# Switch back to the controller identity
dfx identity use controller

# Deploy the ICP ledger canister with specified arguments
dfx deploy --specified-id ryjl3-tyaaa-aaaaa-aaaba-cai icp_ledger_canister --argument "
    (variant {
      Init = record {
        minting_account = \"$MINTER_ACCOUNT_ID\";
        initial_values = vec {
          record {
            \"$DEFAULT_ACCOUNT_ID\";
            record {
              e8s = 10_000_000_000_000000000 : nat64;
            };
          };
        };
        send_whitelist = vec {};
        transfer_fee = opt record {
          e8s = 0 : nat64;
        };
        token_symbol = opt \"LICP\";
        token_name = opt \"Local ICP\";
        feature_flags = opt record { icrc2 = true };
      }
    })
  "

# Deploy additional canisters
dfx deploy ic_asset_handler
dfx deploy icplaunchpad_frontend

# Build and extract the candid interface for the backend
cargo build --release --target wasm32-unknown-unknown --package icplaunchpad_backend
candid-extractor target/wasm32-unknown-unknown/release/icplaunchpad_backend.wasm > src/icplaunchpad_backend/icplaunchpad_backend.did

# Deploy the backend
dfx deploy icplaunchpad_backend

# # Fabricate cycles for all local canisters
# CANISTER_IDS_FILE=".dfx/local/canister_ids.json"

# # Check if the file exists
# if [ ! -f "$CANISTER_IDS_FILE" ]; then
#   echo "Error: Canister IDs file not found at $CANISTER_IDS_FILE. Make sure dfx is initialized and canisters are deployed."
#   exit 1
# fi

# # Extract and fabricate cycles for all canister IDs
# canister_ids=$(jq -r '.[].local' "$CANISTER_IDS_FILE")
# for canister_id in $canister_ids; do
#   echo "Fabricating cycles for canister: $canister_id"
#   dfx ledger fabricate-cycles --canister "$canister_id"
# done

# echo "Cycle fabrication completed for all local canisters."

# echo "run ./test_fairlaunch.sh to run an example successful fairlaunch."
