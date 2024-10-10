import React, { useState } from 'react';
import AnimationButton from '../common/AnimationButton';
import { Link } from 'react-router-dom';
import CreateTokenModal from '../components/Modals/CreateTokenModal';

const CreatePreLaunch = () => {

  const [modalIsOpen, setIsOpen] = useState(false);


  
  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex justify-center items-center  bg-black text-white">
      <div className="w-full max-w-[1070px] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-start font-posterama mb-6">CREATE PRELAUNCH</h1>

        <div className="bg-[#222222] p-4 rounded-lg">
          {/* Chain Text with Gray Background */}
          <div className="flex items-center mb-8 bg-[rgb(68,68,68)] p-2 mt-[-15px] mx-[-15px] rounded-2xl">
            <span className="text-white text-[20px]">Chain</span>
          </div>



          {/* Search Label with Placeholder */}
          <div className="mb-8">
            <label className="block text-[16px] font-medium text-white mb-4">Token Address</label>
            <div className="flex items-center justify-between bg-[#444444] rounded-2xl space-x-2">
              <div className='w-full'>
                <input
                  type="text"
                  className="w-full p-2 bg-[#444444] text-white rounded-md border-none outline-none"
                  placeholder="Search"
                />
              </div>
              <div>
              <button onClick={openModal} className='border-1   bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] 
             text-black   w-[100px] ss2:w-[130px] xxs1:w-[200px] md:w-[250px] h-[38px] lg:h-[38px]
                 text-[12px] xxs1:text-[16px] md:text-[18px] font-[600] rounded-2xl'>
                CREATE TOKEN
              </button>
              <CreateTokenModal modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
            </div>
            </div>
          </div>

          {/* 3 Line Lorem Ipsum with Light Background */}
          <div className="bg-[#F5F5F51A]  text-white p-3 rounded-md mb-8">
            <ul className='text-[15px] px-2 ss2:px-7 py-4 list-disc '>
              <li>  Lorem ipsum dolor sit amet consectetur. Egestas faucibus suspendisse turpis cras sed bibendum massa arcu.</li>
              <li> Quisque enim amet ipsum ipsum faucibus leo adipiscing molestie. Tincidunt enim dis lobortis ac gravida. Non mollis lacus convallis non sit ac sit.</li>
            </ul>
          </div>

          {/* Gradient Button */}
          <div className='flex justify-center items-center'>
            <Link to="/verify-token">
              <AnimationButton text="VERIFY TOKEN" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePreLaunch;
