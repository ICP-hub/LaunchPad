dfx canister call icp_ledger_canister icrc2_transfer_from '(
    record {
        to = record { owner = principal "3gxjf-4knly-w3k7h-iaqqv-iv6iu-xb2g4-5zdps-ctozd-5jzsn-mcgpb-lae"; subaccount = null };
        fee = null;
        spender_subaccount = null;
        from = record { owner = principal "33sjo-rytgq-qwn6x-tevi6-zc2a3-ogpi2-23xiz-3k7ih-rkjif-xwrpy-aqe"; subaccount = null };
        memo = null;
        created_at_time = null;
        amount = 10 : nat
    }
)'
