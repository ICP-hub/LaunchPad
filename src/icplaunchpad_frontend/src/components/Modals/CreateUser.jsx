import React, { useState } from 'react';
import { TfiClose } from "react-icons/tfi";
import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const CreateUser = ({ userModalIsOpen, setUserModalIsOpen }) => {
  const navigate = useNavigate();
 
  // Use React Hook Form
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [validationError, setValidationError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const onSubmit = async (data) => {
    setValidationError('');
    const { name, username, profile, social, tag } = data;

    if (!termsAccepted) {
      setValidationError("Please accept the terms and conditions.");
      return;
    }

    // try {
    //   // Simulating API call
    //   const actor = createCustomActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND);

    //   const UserData = {
    //     name,
    //     username,
    //     profile, 
    //     social,
    //     tag,
    //   };

    // //   const response = await actor.create_User(UserData);
    // //   console.log('User created:', response);

    //   // Navigate to verify-token page after successful creation
    //   navigate('/');
    //   reset(); // Reset form after submission
    //  } 
    //catch (err) {
    //   console.error(err);
    //   setValidationError("An error occurred while creating the User.");
    // }
  };

  const closeModal = () => {
    setUserModalIsOpen(false); // Ensure the modal closes properly by updating the parent state
  };

  return (
    <div className='absolute'>
      <Modal
        isOpen={userModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create Token Modal"
        className="fixed   inset-0 flex items-center justify-center    bg-transparent"
        overlayClassName="fixed z-[100] inset-0  bg-opacity-50"
        ariaHideApp={false} // Only if you don't want modal to block the main content from screen readers
      >
        
          <div className="bg-[#222222]  p-6 rounded-2xl text-white mx-6  max-h-[100vh] overflow-y-auto w-[786px] relative">
            <div className="bg-[#FFFFFF4D] mx-[-24px] mt-[-25px] px-4 py-1 mb-4 rounded-2xl">
              {/* Modal Close Button */}
              <button
                onClick={closeModal}
                className="absolute mt-1 right-8 text-[25px] md:text-[30px] text-white"
              >
                <TfiClose />
              </button>
              <h2 className="text-[20px] font-medium md:text-[25px] md:font-semibold">Create User</h2>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-2 text-[16px]">Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'name is required' })}
                  className="w-full p-1 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block mb-2 text-[16px]">Username</label>
                <input
                  type="text"
                  {...register('username', { required: 'username is required' })}
                  className="w-full p-1 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
                {errors.username && <p className="text-red-500">{errors.username.message}</p>}
              </div>

              <div>
                <label className="block mb-2 text-[16px]">Profile</label>
                <input
                  type="text"
                  {...register('profile', { required: 'profile is required' })}
                  className="w-full p-1 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
                {errors.profile && <p className="text-red-500">{errors.profile.message}</p>}
              </div>

              <div>
                <label className="block mb-2 text-[16px]">Social</label>
                <input
                  type="text"
                  {...register('social', { required: 'social is required' })}
                  className="w-full p-1 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
                {errors.social && <p className="text-red-500">{errors.social.message}</p>}
              </div>

              <div>
                <label className="block mb-2 text-[16px]">Tag</label>
                <input
                  type="text"
                  {...register('tag', { required: 'tag is required' })}
                  className="w-full p-1 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
                {errors.tag && <p className="text-red-500">{errors.tag.message}</p>}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center mt-4 mb-6">
                <input
                  type="checkbox"
                  id="termsCheckbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="hidden peer" // Hide the default checkbox
                />

                {/* Custom checkbox UI linked to the hidden checkbox */}
                <div
                  className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm mr-2 cursor-pointer 
                  ${termsAccepted ? '' : 'border-white bg-transparent'}`}
                >
                  <label
                    htmlFor="termsCheckbox"
                    className="cursor-pointer w-full h-full flex items-center justify-center"
                  >
                    {termsAccepted && <span className="text-[#F3B3A7]">✓</span>}
                  </label>
                </div>

                <p className="text-[15px] text-[#cccccc]">
                  By creating account, I agree to the terms and conditions.
                </p>
              </div>

              {/* Validation Error Message */}
              {validationError && (
                <p className="text-red-500 mb-4">{validationError}</p>
              )}

              {/* Gradient Button */}
              <div  onClick={() => navigate("/")}  className="flex justify-center items-center">
                <AnimationButton text="Submit" />
              </div>
            </form>
          </div>
        
      </Modal>
    </div>
  );
};

export default CreateUser;
