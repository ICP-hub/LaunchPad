import React, { useState } from "react";
import { useAuth } from "../../auth/useAuthClient";
import { Principal } from "@dfinity/principal";
import { useSelector } from "react-redux";
const FormModal = () => {
  const {  createCustomActor } = useAuth();
  const actor = useSelector((currState) => currState.actors.actor);

  const [formData, setFormData] = useState({
    TokenName: "",
    symbol: "",
    decimals: "",
    totalSupply: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      token_symbol: "MY_SYMBOL",
      token_name: "GOLD TOKEN",
      decimals: 16,
      minting_account: {
        owner: Principal.fromText("aaaaa-aa"),
        subaccount: [2, 3, 4],
      },
      transfer_fee: 100,
      metadata: [
        {
          key: "website",
          value: { Text: "https://goldtoken.com" },
        },
        {
          key: "circulation",
          value: { Nat: 1000000n }, 
        },
      ],
      feature_flags: {
        icrc2: true,
      },
      initial_balances: [
        {
          0: { owner: Principal.fromText("aaaaa-aa"), subaccount: [1, 2, 3] }, 
          1: 500, 
        },
        {
          0: { owner: Principal.fromText("aaaaa-aa"), subaccount: null },
          1: 1000, 
        },
      ],
      archive_options: {
        num_blocks_to_archive: 1000,
        max_transactions_per_response: 200,
        trigger_threshold: 500,
        max_message_size_bytes: 1024,
        cycles_for_archive_creation: 100000,
        node_max_memory_size_bytes: 2048,
        controller_id: Principal.fromText("aaaaa-aa"),
      },
      maximum_number_of_accounts: 10000,
      accounts_overflow_trim_quantity: 500,
      fee_collector_account: {
        owner: Principal.fromText("aaaaa-aa"),
        subaccount: null,
      },
      max_memo_length: 256, 
    };
    const payload2 = {
      index_canister_ids : Principal.fromText("aaaaa-aa")
      }
    try {
      let a = createCustomActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND)
      const response = await a.add_data(payload2);
      console.log("Token created:", response);
    } catch (error) {
      console.error("Error creating token:", error);
    }
  };

  const handleGetCaniterID = async () => {
    try {
      if (!actor) {
        throw new Error("Backend actor is not initialized");
      }
      const response = await actor.get_all_canister_ids();
      console.log("all Canister IDs:", response);
    } catch (error) {
      console.error("Error fetching canister IDs:", error);
    }
  };

  return (
    <div className="min-h-[228px] mt-[40px] flex flex-col gap-5 w-[90%] m-auto">
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Name</div>
        <input
          type="text"
          name="TokenName"
          value={formData.TokenName}
          onChange={handleChange}
          className="border-none outline-none bg-transparent"
          placeholder="Enter your token name"
        />
      </div>

      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Symbol</div>
        <input
          type="text"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          className="border-none outline-none bg-transparent"
          placeholder="Enter your token symbol"
        />
      </div>

      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Decimals</div>
        <input
          type="text"
          name="decimals"
          value={formData.decimals}
          onChange={handleChange}
          className="border-none outline-none bg-transparent"
          placeholder="Enter your token decimals"
        />
      </div>

      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Total Supply</div>
        <input
          type="text"
          name="totalSupply"
          value={formData.totalSupply}
          onChange={handleChange}
          className="border-none outline-none bg-transparent"
          placeholder="Enter token total supply"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          onClick={() => handleSubmit()}
          className="bg-green-400 p-1  rounded-md text-lg font-bold"
        >
          Submit
        </button>

        <button
          className="bg-green-400 p-1  rounded-md text-lg font-bold"
          onClick={() => handleGetCaniterID()}
        >
          Get canisters
        </button>
      </div>
    </div>
  );
};

export default FormModal;
