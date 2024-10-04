#!/bin/bash


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
      token_name = "blahh";
      feature_flags = opt record { icrc2 = true };
    }
  }
)'


dfx deploy index_canister --argument '(opt variant { Init = record { ledger_id = principal "aaaaa-aa"; retrieve_blocks_from_ledger_interval_seconds = opt 10 } })'


dfx deploy ic_asset_handler

dfx deploy icplaunchpad_frontend


cargo build --release --target wasm32-unknown-unknown --package icplaunchpad_backend
candid-extractor target/wasm32-unknown-unknown/release/icplaunchpad_backend.wasm > src/icplaunchpad_backend/icplaunchpad_backend.did

# Deploy canister_creater_backend
dfx deploy icplaunchpad_backend

echo "Deployment complete. Please use the Candid UI to call the 'create_token' function with your parameters."
echo "Or run ./tokendeploy.sh to run example token parameters"
