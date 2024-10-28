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