import React, { useEffect, useState } from 'react';
import AnimationButton from '../common/AnimationButton';
import { Link, useNavigate } from 'react-router-dom';
import CreateTokenModal from '../components/Modals/CreateTokenModal';
import ConnectFirst from './ConnectFirst';
import { useSelector } from 'react-redux';
import { Principal } from '@dfinity/principal';
import { useAuth } from '../StateManagement/useContext/useClient';

const CreatePreLaunch = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const principal = useSelector((currState) => currState.internet.principal);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [importAddress, setImportAddress] = useState(null);
  const [error,setError]=useState(null);
  const navigate = useNavigate();
  const {  createCustomActor } = useAuth();
  // const userToken = useSelector((state) => state.UserTokensInfo.data);
 
  const [userToken, setSalesData] = useState([])
  console.log("Fetched tokens in ProjectLists:", userToken);

  useEffect(() => {
    const fetchUserTokensInfo = async () => {
      try {
        if (actor) {
          const response = await actor.get_user_tokens_info();
          if (response && response.length > 0) {
            setSalesData(response);
          } else {
            console.log("No tokens data available or empty response.");
          }
        } else {
          console.log("User account has not been created yet.");
        }
      } catch (error) {
        console.error("Error fetching user tokens info:", error.message);
      }
    };

    fetchUserTokensInfo();
  }, [actor]);

  function validateCanisterId(canisterId) {
    // Regular expression for a valid canister ID
    const canisterRegex = /^[a-z2-7]{5}(-[a-z2-7]{5}){3}-[a-z2-7]{3}$/;
    // Check if the canister ID matches the regex
    return canisterRegex.test(canisterId);
}

  const handleImportToken = async () => {
    if ( userToken || userToken.length > 0) {
      if(importAddress){
        const isValidCanister= validateCanisterId(importAddress)
        if(isValidCanister){
            const customActor= await createCustomActor(importAddress);
          
            if(customActor)
               navigate("/verify-token", {
              state: {ledger_canister_id:importAddress },}
             )
        }
        else{
          setError("Enter correct format of Ledger ID ")
        }
      }
      else{
      const missingSaleParams = await Promise.all(
        userToken.map(async (token) => {
          try {
            const ledgerPrincipal = Principal.fromText(token.canister_id);
            const response = await actor.get_sale_params(ledgerPrincipal);
            console.log(response)
            if (response.Err)
               return token;

          } catch (error) {
            console.error('Error fetching sale params:', error);
          }
          return null;
        })
      ).then((results) => results.filter((token) => token !== null));
     
      if( missingSaleParams.length == 0 ){
          setError("There is no unverified token available. Please create a new token")
      }
      navigate("/verify-token", {
        state: {ledger_canister_id: missingSaleParams[missingSaleParams.length-1].canister_id },}
      )
    }
      

      
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex justify-center items-center bg-black text-white">
      <div className="w-full max-w-[1070px] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-start font-posterama mb-6">CREATE Token</h1>

        {!isAuthenticated ? (
          <ConnectFirst />
        ) : (
          <div className="bg-[#222222] p-4 rounded-lg">
            {/* Chain Text with Gray Background */}
            <div className="flex items-center mb-8 bg-[rgb(68,68,68)] p-2 mt-[-15px] mx-[-15px] rounded-2xl">
              <span className="text-white text-[20px]">Create  or Import Token</span>
            </div>

            {/* Search Label with Placeholder */}
            <div className="mb-8">
              <label className="block text-[16px] font-medium text-white mb-4">Token Address</label>
              <div className="flex items-center justify-between bg-[#444444] rounded-2xl space-x-2">
                <input
                  type="text"
                  className="w-full p-2 bg-[#444444] text-white rounded-md border-none outline-none"
                   placeholder="Enter Token Address"
                  onChange={(e)=>setImportAddress(e.target.value)}
                />
                <button
                  onClick={handleImportToken}
                  className="border-1 bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black min-w-[100px] ss2:w-[130px] xxs1:w-[200px] md:w-[250px] h-[38px] lg:h-[38px] text-[12px] xxs1:text-[16px] md:text-[18px] font-[600] rounded-2xl"
                 
                >
                  IMPORT TOKEN
                </button>
                {modalIsOpen && <CreateTokenModal modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />}
              </div>
            </div>

            {/* Information List */}
            <div className="bg-[#F5F5F51A] text-white p-3 rounded-md mb-8">
              <ul className="text-[15px] px-2 ss2:px-7 py-4 list-disc">
                  <li>Everyone Gets a Fair Chance: A fair launch means no one has an unfair advantage. Everyone can join in from the beginning, giving equal opportunities to all.</li>
                  <li>Build Trust from Day One: With no private sales or special deals, a fair launch keeps things transparent, helping to earn the trust of the community right from the start..</li>
              </ul>
            </div>

            {/* Gradient Button */}
            <div className="flex justify-center items-center">
              <Link onClick={openModal} >
                <AnimationButton text="CREATE TOKEN"  isDisabled={importAddress} />
              </Link>
            </div>
            {/* error message */}
            <p className='text-center mt-5 mb-2 text-red-500'> {error && error} </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePreLaunch;