import React, { useState, useEffect } from 'react';
import { TfiClose } from 'react-icons/tfi';
import Modal from 'react-modal';
import { IoWarningOutline } from "react-icons/io5";

const ApproveOrRejectModal = ({ handleAction, ModalIsOpen, setModalIsOpen, amount, ledgerPrincipal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const approvalFee = 0.0001;

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setModalIsOpen(false), 300); // Match transition duration
  };

  const handleApprove = () => {
    if (amount > 0) {
      handleAction();
    }
    closeModal();
  };

  const handleReject = () => {
    closeModal();
  };

  useEffect(() => {
    if (ModalIsOpen) {
      setIsVisible(true);
    }
  }, [ModalIsOpen]);

  return (
    <div className="absolute">
      <Modal
        isOpen={ModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Approve or Reject Modal"
        className="flex items-center justify-center bg-transparent outline-none"
        overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300"
        ariaHideApp={false}
      >
        <div
          className={`bg-[#222222] p-6 rounded-2xl text-white w-[90%] max-w-[786px] max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
        {/* Header Section */}
        <div className="bg-[#FFFFFF4D] px-4 py-2 mb-4 rounded-xl relative">
          <button
            onClick={closeModal}
            className="absolute top-3 right-4 text-[25px] text-white"
            aria-label="Close Modal"
          >
            <TfiClose />
          </button>
          <h2 className="text-[20px] font-semibold sm:text-center ">Approve spending cap</h2>
        </div>
        <p className='text-center'> Request from  <span className='text-gray-400'> {ledgerPrincipal} </span></p>

        {/* Modal Content */}
        <div className=' my-10 mx-auto w-[80%]'>
            <h1 className='text-center text-lg font-medium'>{amount} ICP</h1>
            <div className='flex mt-10 justify-around'>
            <h1>Approval fee</h1>
            <h1>{approvalFee} ICP</h1>
          </div>

        </div>
         
        <div className="text-center w-[80%] mx-auto mt-16">
          <div className="mb-6 text-sm sm:text-base bg-[#fef6ed] flex  text-[#a36d41] p-4  sm:px-6 rounded-lg ">
          <IoWarningOutline size={25} className='text-[#7c2c13] w-10 sm:w-7 '/>  <p> <span className='text-[#7c2c13] font-bold ' > Proceed with caution. </span> This website can spend up to the spending cap until you revoke this permission. </p>
          </div>
          <div className="flex justify-center gap-10">
            <button
              onClick={handleReject}
              className="px-5 py-2 w-32 font-bold bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Reject
            </button>
            <button
              onClick={handleApprove}
              className="px-5 py-2 w-32 font-bold bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </Modal>
    </div>
  );
};

export default ApproveOrRejectModal;
