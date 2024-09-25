dfx canister call b77ix-eeaaa-aaaaa-qaada-cai //ledger id icrc2_approve '(record { spender = record { owner = principal "bw4dl-smaaa-aaaaa-qaacq-cai"; subaccount = null }; amount = 1000 : nat })'

dfx canister call icplaunchpad_backend transfer '(record { to_account = record { owner = principal "bw4dl-smaaa-aaaaa-qaacq-cai"; subaccount = null }; amo
unt = 1000 : nat })'