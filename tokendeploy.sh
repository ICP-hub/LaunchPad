dfx canister call icplaunchpad_backend create_token '(
    record {
        token_symbol = "LPD";
        token_name = "Launchpad";
        decimals = opt 8;
        minting_account = record { owner = principal "h67dy-6eawy-xhvgv-k2a3j-g2vsc-2efqg-i7a36-5stsb-zg7dq-yu7gi-zqe"; subaccount = null: opt vec nat8 };
        transfer_fee = 10 : nat;
        metadata = vec { };
        feature_flags = opt record { icrc2 = true };
        initial_balances = vec { record { record { owner = principal "s4yaz-piiqq-tbbu5-kdv4h-pirny-gfddr-qs7ti-m4353-inls6-tubud-qae"; }; 1000; }; };
        archive_options = record {
            num_blocks_to_archive = 10 : nat64;
            max_transactions_per_response = null: opt nat64;
            trigger_threshold = 10 : nat64;
            max_message_size_bytes = null: opt nat64;
            cycles_for_archive_creation = null: opt nat64;
            node_max_memory_size_bytes = null: opt nat64;
            controller_id = principal "wo4qc-igxxg-32h46-airnk-woc63-ixpru-7gb5c-blgku-cokyl-w6hul-3ae";
        };
        maximum_number_of_accounts = null: opt nat64;
        accounts_overflow_trim_quantity = null: opt nat64;
        fee_collector_account = null: opt record { owner : principal; subaccount : opt vec nat8 };
        max_memo_length = null: opt nat16;
    }
)' 

# --ic


# dfx canister call b77ix-eeaaa-aaaaa-qaada-cai icrc2_approve "(record { amount = 100; spender = record{owner = principal \"x2luv-hxqlt-bitql-dvtgi-xeejd-lntub-asolo-3d3zu-g2nlm-mxupm-aqe\";} })"

# dfx canister call bw4dl-smaaa-aaaaa-qaacq-cai icrc2_transfer_from '(record {to=record {owner=principal "telmr-23z2w-2mzbc-b4tkj-sgxyc-dva5b-6ycsh-4ksul-4gof6-gjtwq-jqe"}; fee=null; spender_subaccount=null}; from=record {owner=principal "x2luv-hxqlt-bitql-dvtgi-xeejd-lntub-asolo-3d3zu-g2nlm-mxupm-aqe"}; memo=null; created_at_time=null; amount=10})'
