#!/bin/bash


dfx identity new controller
dfx identity use controller 


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

dfx identity use controller 

dfx deploy index_canister --argument '(opt variant { Init = record { ledger_id = principal "aaaaa-aa"; retrieve_blocks_from_ledger_interval_seconds = opt 10 } })'

dfx identity new minter
  dfx identity use minter
  export MINTER_ACCOUNT_ID=$(dfx ledger account-id)

  dfx identity use default
  export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)

dfx identity use controller 
  dfx deploy --specified-id ryjl3-tyaaa-aaaaa-aaaba-cai icp_ledger_canister --argument "
    (variant {
      Init = record {
        minting_account = \"$MINTER_ACCOUNT_ID\";
        initial_values = vec {
          record {
            \"$DEFAULT_ACCOUNT_ID\";
            record {
              e8s = 10_000_000_000 : nat64;
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

dfx identity use controller 
dfx deploy ic_asset_handler

dfx identity use controller 
dfx deploy icplaunchpad_frontend


cargo build --release --target wasm32-unknown-unknown --package icplaunchpad_backend
candid-extractor target/wasm32-unknown-unknown/release/icplaunchpad_backend.wasm > src/icplaunchpad_backend/icplaunchpad_backend.did

# Deploy canister_creater_backend
dfx deploy icplaunchpad_backend

echo "Deployment complete. Please use the Candid UI to call the 'create_token' function with your parameters."
echo "Or run ./tokendeploy.sh to run example token parameters"
