dfx canister call icplaunchpad_backend create_token '(
    record {
        token_symbol = "LPD";
        token_name = "Launchpad";
        decimals = opt 8;
        initial_balances = vec { record { record { owner = principal "s4yaz-piiqq-tbbu5-kdv4h-pirny-gfddr-qs7ti-m4353-inls6-tubud-qae"; }; 1000; }; };
    }
)' 

# --ic


# dfx canister call b77ix-eeaaa-aaaaa-qaada-cai icrc2_approve "(record { amount = 100; spender = record{owner = principal \"x2luv-hxqlt-bitql-dvtgi-xeejd-lntub-asolo-3d3zu-g2nlm-mxupm-aqe\";} })"

# dfx canister call bw4dl-smaaa-aaaaa-qaacq-cai icrc2_transfer_from '(record {to=record {owner=principal "telmr-23z2w-2mzbc-b4tkj-sgxyc-dva5b-6ycsh-4ksul-4gof6-gjtwq-jqe"}; fee=null; spender_subaccount=null}; from=record {owner=principal "x2luv-hxqlt-bitql-dvtgi-xeejd-lntub-asolo-3d3zu-g2nlm-mxupm-aqe"}; memo=null; created_at_time=null; amount=10})'
