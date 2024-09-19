#!/bin/bash

cargo build --release --target wasm32-unknown-unknown --package icplaunchpad_backend
candid-extractor target/wasm32-unknown-unknown/release/icplaunchpad_backend.wasm > src/icplaunchpad_backend/icplaunchpad_backend.did

dfx deploy token_deployer

dfx deploy index_canister

dfx deploy ic_asset_handler

dfx deploy icplaunchpad_frontend

# Deploy canister_creater_backend
dfx deploy icplaunchpad_backend

echo "Deployment complete. Please use the Candid UI to call the 'create_token' function with your parameters."
echo "Or run ./tokendeploy.sh to run example token parameters"
