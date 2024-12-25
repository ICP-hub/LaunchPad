#!/bin/bash

# Switch to the seller identity
dfx identity use seller
SELLER_PRINCIPAL=$(dfx identity get-principal)
echo "SELLER_PRINCIPAL: $SELLER_PRINCIPAL"

# Check if SELLER_PRINCIPAL is valid
if [ -z "$SELLER_PRINCIPAL" ]; then
    echo "Error: SELLER_PRINCIPAL is empty. Ensure the identity is set correctly."
    exit 1
fi

# Generate a unique username by appending the current timestamp
UNIQUE_USERNAME="user_$(date +%s)"

echo "Using unique username: $UNIQUE_USERNAME"

# Create an account for the seller without profile picture
CREATE_ACCOUNT_RESULT=$(dfx canister call icplaunchpad_backend create_account '(
    record {
        name = "Anonymous";
        username = "'$UNIQUE_USERNAME'";
        links = vec { "https://example.com" };
        tag = vec { "default_tag" };
    }
)')

echo "CREATE_ACCOUNT_RESULT: $CREATE_ACCOUNT_RESULT"

# Check if account creation was successful
if [[ "$CREATE_ACCOUNT_RESULT" != *"Ok"* ]]; then
    echo "Error: Account creation failed. Please check the result: $CREATE_ACCOUNT_RESULT"
    exit 1
fi

# Create a token
CREATE_TOKEN_RESULT=$(dfx canister call icplaunchpad_backend create_token '(
    record {
        token_symbol = "TKN";
        token_name = "Token Name";
        decimals = opt 8;
        initial_balances = vec {
            record {
                record {
                    owner = principal "'$SELLER_PRINCIPAL'";
                };
                100_000 : nat;
            };
        };
    }
)')


echo "CREATE_TOKEN_RESULT: $CREATE_TOKEN_RESULT"

# Check if token creation was successful
if [[ "$CREATE_TOKEN_RESULT" == *"Err"* ]]; then
    echo "Error: Token creation failed. Please check the result: $CREATE_TOKEN_RESULT"
    exit 1
fi

# Extract the ledger_canister_id from the create_token result
LEDGER_CANISTER_ID=$(echo "$CREATE_TOKEN_RESULT" | grep -oP '(?<=ledger_canister_id = principal ")[^"]+')
echo "LEDGER_CANISTER_ID: $LEDGER_CANISTER_ID"

# Check if LEDGER_CANISTER_ID is valid
if [ -z "$LEDGER_CANISTER_ID" ]; then
    echo "Error: LEDGER_CANISTER_ID is empty. Ensure the token creation was successful."
    exit 1
fi

# Get the current time in seconds and calculate start and end times
CURRENT_TIME=$(date +%s)
START_TIME=$((CURRENT_TIME + 60))  # 1 minute from now
END_TIME=$((CURRENT_TIME + 86400))  # 1 day (24 hours) from now


# Extract the sale amount from the create_sale result
CREATE_SALE_RESULT=$(dfx canister call icplaunchpad_backend create_sale "(
    principal \"$LEDGER_CANISTER_ID\",
    record {
        tokens_for_fairlaunch = 10_000 : nat64;
        softcap = 1 : nat64;
        max_contribution = 1_000 : nat64;
        min_contribution = 1 : nat64;
        description = \"Sale description\";
        liquidity_percentage = 60 : nat8;
        website = \"https://example.com\";
        social_links = vec { \"https://twitter.com/example\" };
        project_video = \"https://youtube.com/example\";
        creator = principal \"$SELLER_PRINCIPAL\";
        start_time_utc = $START_TIME : nat64;
        end_time_utc = $END_TIME : nat64;
        hardcap = 1_000 : nat64;
    }
)")


echo "CREATE_SALE_RESULT: $CREATE_SALE_RESULT"


SALE_AMOUNT=$(echo "$CREATE_SALE_RESULT" | grep -oP '(?<=Ok = )[\d_]+')
echo "SALE_AMOUNT: $SALE_AMOUNT"



# Fetch the backend canister ID
BACKEND_CANISTER_ID=$(dfx canister id icplaunchpad_backend)
echo "BACKEND_CANISTER_ID: $BACKEND_CANISTER_ID"

# Check if BACKEND_CANISTER_ID is valid
if [ -z "$BACKEND_CANISTER_ID" ]; then
    echo "Error: BACKEND_CANISTER_ID is empty. Ensure the backend canister is deployed."
    exit 1
fi

# Approve tokens for the sale
dfx canister call "$LEDGER_CANISTER_ID" icrc2_approve "(
    record {
        amount = $SALE_AMOUNT : nat;
        spender = record {
            owner = principal \"$BACKEND_CANISTER_ID\";
        };
    }
)"

# Switch to the controller identity
dfx identity use default

# Approve tokens for the backend canister
dfx canister call icp_ledger_canister icrc2_approve "(
    record {
        amount = 1_000 : nat;
        spender = record {
            owner = principal \"$BACKEND_CANISTER_ID\";
        };
    }
)"

# Get the controller's principal
CONTROLLER_PRINCIPAL=$(dfx identity get-principal)
echo "CONTROLLER_PRINCIPAL: $CONTROLLER_PRINCIPAL"

# Check if CONTROLLER_PRINCIPAL is valid
if [ -z "$CONTROLLER_PRINCIPAL" ]; then
    echo "Error: CONTROLLER_PRINCIPAL is empty. Ensure the controller identity is set."
    exit 1
fi

# Buy tokens
dfx canister call icplaunchpad_backend buy_tokens "(
    record {
        tokens = 1_000 : nat64;
        buyer_principal = principal \"$CONTROLLER_PRINCIPAL\";
        icrc1_ledger_canister_id = principal \"$LEDGER_CANISTER_ID\";
    }
)"