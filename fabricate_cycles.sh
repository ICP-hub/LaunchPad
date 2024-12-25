#!/bin/bash

# Load environment variables from the .env file
source .env

# Prompt the user to select the canister ID
echo "Available Canisters from .env:"
echo "1. Token Deployer: $CANISTER_ID_TOKEN_DEPLOYER"
echo "2. Internet Identity: $CANISTER_ID_INTERNET_IDENTITY"
echo "3. Index Canister: $CANISTER_ID_INDEX_CANISTER"
echo "4. ICPLaunchpad Frontend: $CANISTER_ID_ICPLAUNCHPAD_FRONTEND"
echo "5. ICPLaunchpad Backend: $CANISTER_ID_ICPLAUNCHPAD_BACKEND"
echo "6. ICP Ledger Canister: $CANISTER_ID_ICP_LEDGER_CANISTER"
echo "7. IC Asset Handler: $CANISTER_ID_IC_ASSET_HANDLER"
echo "8. Default Canister ID: $CANISTER_ID"

# Ask user to input a choice
read -p "Enter the number corresponding to the canister to fabricate cycles: " choice

# Map choice to the respective CANISTER_ID
case $choice in
  1) TARGET_CANISTER=$CANISTER_ID_TOKEN_DEPLOYER ;;
  2) TARGET_CANISTER=$CANISTER_ID_INTERNET_IDENTITY ;;
  3) TARGET_CANISTER=$CANISTER_ID_INDEX_CANISTER ;;
  4) TARGET_CANISTER=$CANISTER_ID_ICPLAUNCHPAD_FRONTEND ;;
  5) TARGET_CANISTER=$CANISTER_ID_ICPLAUNCHPAD_BACKEND ;;
  6) TARGET_CANISTER=$CANISTER_ID_ICP_LEDGER_CANISTER ;;
  7) TARGET_CANISTER=$CANISTER_ID_IC_ASSET_HANDLER ;;
  8) TARGET_CANISTER=$CANISTER_ID ;;
  *) 
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

# Check if TARGET_CANISTER is set
if [ -z "$TARGET_CANISTER" ]; then
  echo "Error: The selected canister ID is not set in the .env file."
  exit 1
fi

# Ask user to input the amount of cycles
read -p "Enter the amount of cycles to fabricate: " cycle_amount

# Validate that the cycle amount is a number
if ! [[ "$cycle_amount" =~ ^[0-9]+$ ]]; then
  echo "Error: Cycle amount must be a valid number."
  exit 1
fi

# Execute the fabricate-cycles command
echo "Fabricating $cycle_amount cycles for canister ID: $TARGET_CANISTER"
dfx ledger fabricate-cycles --canister "$TARGET_CANISTER" --amount "$cycle_amount"

# Check the status of the command
if [ $? -eq 0 ]; then
  echo "Successfully fabricated $cycle_amount cycles for canister ID: $TARGET_CANISTER"
else
  echo "Error: Failed to fabricate cycles for canister ID: $TARGET_CANISTER"
  exit 1
fi
