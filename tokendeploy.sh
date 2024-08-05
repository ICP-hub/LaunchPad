dfx canister call icplaunchpad_backend create_token '(
    record {
        token_symbol = "LPD";
        token_name = "Launchpad";
        decimals = opt 8;
        minting_account = record { owner = principal "aaaaa-aa"; subaccount = null: opt vec nat8 };
        transfer_fee = 10 : nat;
        metadata = vec { };
        feature_flags = opt record { icrc2 = true };
        initial_balances = vec { record { record { owner = principal "aaaaa-aa"; }; 10; }; };
        archive_options = record {
            num_blocks_to_archive = 10 : nat64;
            max_transactions_per_response = null: opt nat64;
            trigger_threshold = 10 : nat64;
            max_message_size_bytes = null: opt nat64;
            cycles_for_archive_creation = null: opt nat64;
            node_max_memory_size_bytes = null: opt nat64;
            controller_id = principal "aaaaa-aa";
        };
        maximum_number_of_accounts = null: opt nat64;
        accounts_overflow_trim_quantity = null: opt nat64;
        fee_collector_account = null: opt record { owner : principal; subaccount : opt vec nat8 };
        max_memo_length = null: opt nat16;
    }
)'
