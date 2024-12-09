import React, { useState } from 'react';
import AnimationButton from '../common/AnimationButton';
import { Link, useNavigate } from 'react-router-dom';
import CreateTokenModal from '../components/Modals/CreateTokenModal';
import ConnectFirst from './ConnectFirst';
import { useSelector } from 'react-redux';
import { useAuth } from '../StateManagement/useContext/useClient';
import { Principal } from '@dfinity/principal';

const CreatePreLaunch = () => {
  const actor = useSelector((state) => state.actors.actor);
  const isAuthenticated = useSelector((state) => state.internet.isAuthenticated);
  const principal = useSelector((state) => state.internet.principal);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [importAddress, setImportAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { createCustomActor } = useAuth();

  const userTokenInfo = useSelector((state) => state?.UserTokensInfo?.data);

  const validateCanisterId = (canisterId) => {
    const canisterRegex = /^[a-z2-7]{5}(-[a-z2-7]{5}){3}-cai$/;
  
    if (!canisterRegex.test(canisterId)) {
      setError('Invalid Canister ID.');
      return false;
    }
  
    if (Array.isArray(userTokenInfo)) {
      const existingToken = userTokenInfo.find((token) => token?.canister_id === canisterId);
      if (existingToken) {
        setError('Token already exists.');
        return false;
      }
    }
  
    return true;
  };
  
  const handleImportToken = async () => {
    setError(''); // Clear existing errors
    if (!importAddress) {
      setError('Please enter a Ledger Canister ID.');
      return;
    }

    const isValidCanister = validateCanisterId(importAddress);
    if (!isValidCanister) return;

    try {
      const customActor = await createCustomActor(importAddress);
      if (customActor) {
        const ledgerPrincipal = Principal.fromText(importAddress);
        const response = await actor.import_token(ledgerPrincipal);
        console.log('Import response: ', response);
        navigate('/verify-token', {
          state: { ledger_canister_id: importAddress },
        });
      }
    } catch (err) {
      console.error('Error importing token:', err);
      setError('Failed to import token. Please try again later.');
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleAddressChange = (e) => {
    setImportAddress(e.target.value);
    setError(''); // Clear error when typing
  };

  return (
    <div className="flex justify-center items-center bg-black text-white">
      <div className="w-full max-w-[1070px] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-start font-posterama mb-6">Create Fair Launch</h1>

        {!isAuthenticated ? (
          <ConnectFirst />
        ) : (
          <div className="bg-[#222222] p-4 rounded-lg">
            <div className="flex items-center mb-8 bg-[rgb(68,68,68)] p-2 mt-[-15px] mx-[-15px] rounded-2xl">
              <span className="text-white text-[20px]">Create or Import Token</span>
            </div>

            <div className="mb-8">
              <label className="block text-[16px] font-medium text-white mb-4">Token Address</label>
              <div className="flex items-center justify-between bg-[#444444] rounded-2xl space-x-2">
                <input
                  type="text"
                  className="w-full p-2 bg-[#444444] text-white rounded-md border-none outline-none"
                  placeholder="Enter Token Address"
                  onChange={handleAddressChange}
                  value={importAddress}
                />
                <button
                  onClick={handleImportToken}
                  className="border-1 bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black min-w-[100px] ss2:w-[130px] xxs1:w-[200px] md:w-[250px] h-[38px] lg:h-[38px] text-[12px] xxs1:text-[16px] md:text-[18px] font-[600] rounded-2xl"
                >
                  IMPORT TOKEN
                </button>
              </div>
            </div>

            <div className="bg-[#F5F5F51A] text-white p-3 rounded-md mb-8">
              <ul className="text-[15px] px-2 ss2:px-7 py-4 list-disc">
                <li>
                  Everyone Gets a Fair Chance: A fair launch means no one has an unfair advantage. Everyone can join in from the beginning, giving equal opportunities to all.
                </li>
                <li>
                  Build Trust from Day One: With no private sales or special deals, a fair launch keeps things transparent, helping to earn the trust of the community right from the start.
                </li>
              </ul>
            </div>

            <div className="flex justify-center items-center">
              <Link onClick={openModal}>
                <AnimationButton text="CREATE TOKEN" isDisabled={importAddress} />
              </Link>
            </div>

            {modalIsOpen && <CreateTokenModal modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />}

            <p className="text-center mt-5 mb-2 text-red-500">{error && error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePreLaunch;
