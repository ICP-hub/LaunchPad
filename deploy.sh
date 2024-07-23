#!/bin/bash

# Example JSON string returned from the canister call (replace this line with the actual dfx canister call if running in a script)
JSON_STRING='{
    "token_symbol":"LPD",
    "token_name":"Launchpad",
    "transfer_fee":0,
    "feature_flags":false,
    "pre_minted_tokens":0,
    "default_owner":"aaaaa-aa",
    "archive_controller":"aaaaa-aa",
    "trigger_threshold":0,
    "cycle_for_archive_creation":0,
    "num_of_block_to_archive":0,
    "minter":"aaaaa-aa"
}'

# Parse JSON string using jq
TOKEN_SYMBOL=$(echo $JSON_STRING | jq -r '.token_symbol')
TOKEN_NAME=$(echo $JSON_STRING | jq -r '.token_name')
TRANSFER_FEE=$(echo $JSON_STRING | jq -r '.transfer_fee')
FEATURE_FLAGS=$(echo $JSON_STRING | jq -r '.feature_flags')
PRE_MINTED_TOKENS=$(echo $JSON_STRING | jq -r '.pre_minted_tokens')
DEFAULT=$(echo $JSON_STRING | jq -r '.default_owner')
ARCHIVE_CONTROLLER=$(echo $JSON_STRING | jq -r '.archive_controller')
TRIGGER_THRESHOLD=$(echo $JSON_STRING | jq -r '.trigger_threshold')
CYCLE_FOR_ARCHIVE_CREATION=$(echo $JSON_STRING | jq -r '.cycle_for_archive_creation')
NUM_OF_BLOCK_TO_ARCHIVE=$(echo $JSON_STRING | jq -r '.num_of_block_to_archive')
MINTER=$(echo $JSON_STRING | jq -r '.minter')

# Construct the dfx deploy command
DFX_ARGUMENT="(variant {Init = record {
    token_symbol = \"$TOKEN_SYMBOL\";
    token_name = \"$TOKEN_NAME\";
    minting_account = record { owner = principal \"$MINTER\" };
    transfer_fee = $TRANSFER_FEE;
    metadata = vec {};
    feature_flags = opt record{icrc2 = $FEATURE_FLAGS};
    initial_balances = vec { record { record { owner = principal \"$DEFAULT\"; }; $PRE_MINTED_TOKENS; }; };
    archive_options = record {
        num_blocks_to_archive = $NUM_OF_BLOCK_TO_ARCHIVE;
        trigger_threshold = $TRIGGER_THRESHOLD;
        controller_id = principal \"$ARCHIVE_CONTROLLER\";
        cycles_for_archive_creation = opt $CYCLE_FOR_ARCHIVE_CREATION;
    };
}})"

echo $DFX_ARGUMENT

# Run the dfx deploy command
dfx deploy prac_backend --argument "$DFX_ARGUMENT"
