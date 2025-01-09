import React, { useState } from 'react';
import AnimationButton from '../common/AnimationButton';
import { Link, useNavigate } from 'react-router-dom';
import CreateTokenModal from '../components/Modals/CreateTokenModal';
import ConnectFirst from './ConnectFirst';
import { useSelector } from 'react-redux';
import { Principal } from '@dfinity/principal';
import { useAuths } from '../StateManagement/useContext/useClient';
import { ThreeDots } from 'react-loader-spinner';

const CreatePreLaunch = () => {
  const actor = useSelector((state) => state.actors.actor);
  const isAuthenticated = useSelector((state) => state.internet.isAuthenticated);
  const principal = useSelector((state) => state.internet.principal);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [ledgerCanisterId, setLedgerCanisterId] = useState('');
  const [indexCanisterId, setIndexCanisterId] = useState();
  const [showIndexInput, setShowIndexInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const navigate = useNavigate();
  const { createCustomActor } = useAuths();

  const userTokenInfo = useSelector((state) => state?.UserTokensInfo?.data);

  const validateCanisterId = (ledgerCanisterId,indexCanisterId ) => {
    const canisterRegex = /^[a-z2-7]{5}(-[a-z2-7]{5}){3}-cai$/;

    if (!canisterRegex.test(ledgerCanisterId)) {
      setError('Invalid Ledger Canister ID.');
      return false;
    }
    if (showIndexInput && !canisterRegex.test(indexCanisterId)) {
      setError('Invalid Index Canister ID.');
      return false;
    }

    if (Array.isArray(userTokenInfo)) {
      const existingToken = userTokenInfo.find((token) => token?.canister_id === ledgerCanisterId);
      if (existingToken) {
        setError('Token already exists.');
        return false;
      }
    }

    return true;
  };

  const handleImportToken = async () => {
    setError('');
    setLoading(true);
    if (!ledgerCanisterId) {
      setError('Please enter a Ledger Canister ID.');
      setLoading(false);
      return;
    }

    if ( showIndexInput && !indexCanisterId) {
      setError('Please enter a Index Canister ID.');
      setLoading(false);
      return;
    }

    const isValidCanister = validateCanisterId(ledgerCanisterId,indexCanisterId );
    if (!isValidCanister) {
      setLoading(false);
      return;
    }

    try {
      if (ledgerCanisterId ) {
        const customActor = await createCustomActor(ledgerCanisterId);
        if (customActor) {
          const ledgerPrincipal = Principal.fromText(ledgerCanisterId);
          const indexPrincipal = (showIndexInput && indexCanisterId) ? [Principal.fromText(indexCanisterId)] : [] ;
          console.log('ledgerPrincipal',ledgerPrincipal, '  ','indexPrincipal',indexPrincipal) 

          const response = await actor.import_token(ledgerPrincipal, indexPrincipal)
          console.log('Import response: ', response);
          if (!response?.Err) {
            navigate('/verify-token', {
              state: { ledger_canister_id: ledgerCanisterId },
            });
          } else {
            setError('Token has already been imported');
          }
        }
      }
    } catch (err) {
      console.error('Error importing token:', err);
      setError('Failed to import token. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  const openModal = () => {
    setIsOpen(true);
  };

  const handleAddressChange = (e) => {
    setLedgerCanisterId(e.target.value);
    setError('');
  };

  const handleIndexCanisterChange = (e) => {
    setIndexCanisterId(e.target.value);
    setError('');
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
                placeholder="Enter Ledger Canister ID"
                onChange={handleAddressChange}
                value={ledgerCanisterId}
              />
              <button
                onClick={handleImportToken}
                className={`border-1 whitespace-nowrap px-2 md:px-0 text-sm sm:text-base font-posterama bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]
                  text-black flex justify-center items-center w-[130px] md:w-[250px] h-[35px] md:h-[40px]
                  text-[16px] md:text-[18px] font-[600] rounded-3xl
                  ${loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:opacity-80'
                  }
                  ${showIndexInput ? 'hidden' : ''}
                  `}
              >
                {loading ? (
                  <ThreeDots
                    height="40"
                    width="40"
                    color="white"
                    ariaLabel="loading-indicator"
                  />
                ) : (
                  'IMPORT TOKEN'
                )}
              </button>
            </div>
            
            <div
              className={`flex transform transition-all duration-500 ease-in-out ${showIndexInput ? ' mt-2 translate-y-0 opacity-100' : '-translate-y-5 opacity-0 pointer-events-none'
                }`}
            >
              <input
                type="text"
                className="w-full p-2 bg-[#444444] text-white rounded-md border-none outline-none"
                placeholder="Enter Index Canister ID"
                onChange={handleIndexCanisterChange}
                value={indexCanisterId}
              />
              <div className="flex justify-end ml-2">
                <button
                  onClick={() => {
                    setShowIndexInput(false);
                    setIndexCanisterId('');
                  }}
                  className="text-sm px-4 py-1 rounded-lg"
                >
                  <svg fill="red"className='size-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                </button>
              </div>
            </div>

            <div
              className={`flex justify-center transition-all duration-1000 ease-in-out transform ${!showIndexInput ? 'opacity-0 -mt-16 pointer-events-none' : 'opacity-100 translate-y-0 my-4'
                }`}
            >
              <button
                onClick={handleImportToken}
                className={`border-1 whitespace-nowrap px-2 md:px-0 text-sm sm:text-base font-posterama bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]
    text-black flex justify-center items-center w-[130px] md:w-[250px] h-[35px] md:h-[40px]
    text-[16px] md:text-[18px] font-[600] rounded-3xl
    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
  `}
              >
                {loading ? (
                  <ThreeDots height="40" width="40" color="white" ariaLabel="loading-indicator" />
                ) : (
                  'IMPORT TOKEN'
                )}
              </button>
            </div>
            {!showIndexInput &&
            <div className='flex items-center'>

              <div className="flex items-start xxs1:items-center mt-0 mb-0">
              <input
                type="checkbox"
                id="indexCanister"
                checked={showIndexInput}
                onChange={() => setShowIndexInput((prev) => !prev)}
                className="hidden peer"
              />
              <div
                className={`w-4 h-4 ml-2 border-2 flex items-center  justify-center rounded-sm mr-2 cursor-pointer ${showIndexInput ? "" : "border-white bg-transparent"
                  }`}
              >
                <label
                  htmlFor="indexCanister"
                  className="cursor-pointer w-full h-full flex items-center justify-center"
                >
                  {showIndexInput && <span className="text-[#F3B3A7]">✓</span>}
                </label>
              </div>
             </div>
            <label 
            htmlFor="indexCanister"
            > <h1 className='text-sm'>Do you have an Index Canister ID?</h1></label>
            </div>}

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
              <AnimationButton text="CREATE TOKEN" isDisabled={ledgerCanisterId} />
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
