import React, { useState } from 'react';
import { TfiClose } from "react-icons/tfi";
import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/useAuthClient';

const CreateUser = ({ setUserData, userModalIsOpen, setUserModalIsOpen }) => {
  const navigate = useNavigate();
  const { createCustomActor } = useAuth();
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

    try {
      const actor = createCustomActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND);
      let profilePicture = null;

      // Handling the profile picture as a file upload
      if (profile && profile.length > 0 && profile[0]) {
        const file = profile[0];
        const arrayBuffer = await file.arrayBuffer();
        profilePicture = Array.from(new Uint8Array(arrayBuffer)); // Convert ArrayBuffer to an array of bytes
      }

      const userData = {
        name,
        username,
        profile_picture: profilePicture && profilePicture.length > 0 ? [profilePicture] : [],
        links: [social],
        tag,
      };

      const response = await actor.create_user_account(userData);
      console.log('User created:', response);
      if (response) setUserData(response);
      if (response.Err) setValidationError(response.Err);



  
      if (userData.profile_picture.length > 0) {
        const ImageData= {
          content: userData?.profile_picture,
          }
        try {
          const responseImg = await actor.upload_profile_image("br5f7-7uaaa-aaaaa-qaaca-cai",ImageData );
          console.log('Profile pic uploaded:', responseImg);
        } catch (imgErr) {
          console.error("Error uploading profile picture:", imgErr);
        }
      }


      setUserModalIsOpen(false);
      navigate('/'); // Navigate to home page after successful creation
      reset(); // Reset form after submission
    } catch (err) {
      console.error(err);
      setValidationError("An error occurred while creating the User.");
    }
  };

  const closeModal = () => {
    setUserModalIsOpen(false);
  };

  return (
    <div className='absolute'>
      <Modal
        isOpen={userModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create User Modal"
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        overlayClassName="fixed z-[100] inset-0 bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="bg-[#222222] p-6 rounded-2xl text-white mx-6 max-h-[100vh] overflow-y-auto w-[786px] relative">
          <div className="bg-[#FFFFFF4D] mx-[-24px] mt-[-25px] px-4 py-1 mb-4 rounded-2xl">
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
            {/* Name */}
            <div>
              <label className="block mb-2 text-[16px]">Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full p-1 pl-4 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block mb-2 text-[16px]">Username</label>
              <input
                type="text"
                {...register('username', { required: 'Username is required' })}
                className="w-full p-1 pl-4 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.username && <p className="text-red-500">{errors.username.message}</p>}
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block mb-2 text-[16px]">Profile Picture</label>
              <input
                type="file"
                {...register('profile')}
                className="w-full p-1 pl-4 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.profile && <p className="text-red-500">{errors.profile.message}</p>}
            </div>

            {/* Social */}
            <div>
              <label className="block mb-2 text-[16px]">Social</label>
              <input
                type="text"
                {...register('social', { required: 'Social link is required' })}
                className="w-full p-1 pl-4 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.social && <p className="text-red-500">{errors.social.message}</p>}
            </div>

            {/* Tag */}
            <div>
              <label className="block mb-2 text-[16px]">Tag</label>
              <input
                type="text"
                {...register('tag', { required: 'Tag is required' })}
                className="w-full p-1 pl-4 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.tag && <p className="text-red-500">{errors.tag.message}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center mt-4 mb-6">
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="hidden peer"
              />
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
                By creating an account, I agree to the terms and conditions.
              </p>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <p className="text-red-500 mb-4">{validationError}</p>
            )}

            {/* Submit Button */}
            <div className="flex justify-center items-center">
              <AnimationButton text="Submit" />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateUser;
