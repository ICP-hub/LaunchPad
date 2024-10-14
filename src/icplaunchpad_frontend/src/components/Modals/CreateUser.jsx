import React, { useState, useRef } from 'react';
import { TfiClose } from "react-icons/tfi";
import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../StateManagement/useContext/useAuth';
import { useDispatch } from 'react-redux';
import { addUserData } from '../../Redux-Config/ReduxSlices/UserSlice';
import { Principal } from '@dfinity/principal';

const CreateUser = ({ userModalIsOpen, setUserModalIsOpen }) => {
  const navigate = useNavigate();
  const { actor, principal } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [validationError, setValidationError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fileName, setFileName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const onSubmit = async (data) => {
    setValidationError('');
    const { name, username, social, tag } = data;

    if (!termsAccepted) {
      setValidationError("Please accept the terms and conditions.");
      return;
    }

    try {
      // Convert profile picture to Uint8Array if exists
      let profilePictureData = [];
      if (profilePicture) {
        profilePictureData = await convertFileToUint8Array(profilePicture);
      }

      const userData = {
        name,
        username,
        profile_picture: profilePictureData.length > 0 ? [profilePictureData] : [],
        links: [social],
        tag,
      };

      // Create the user account
      const response = await actor.create_user_account(userData);
      if (response?.Err) {
        setValidationError(response.Err);
        return;
      }

      // Upload profile picture if it exists
      if (userData.profile_picture.length > 0) {
        try {
          const responseImg = await actor.upload_profile_image("br5f7-7uaaa-aaaaa-qaaca-cai", {
            content: userData.profile_picture,
          });
          console.log('Profile picture uploaded:', responseImg);
        } catch (imgErr) {
          console.error("Error uploading profile picture:", imgErr);
        }
      }

      // Fetch and store user data
      const ownerPrincipal = Principal.fromText(principal);
      const fetchedUserData = await actor.get_user_account(ownerPrincipal);
      console.log("Fetched user data:", fetchedUserData);

      if (fetchedUserData) {
        const { profile_picture, ...restUserData } = fetchedUserData[0];
        dispatch(addUserData(restUserData));
      }

      // Close modal, reset form, and navigate to home
      setUserModalIsOpen(false);
      navigate('/');
      reset();
    } catch (err) {
      console.error("An error occurred:", err);
      setValidationError("An error occurred while creating the User.");
    }
  };

  // Helper function to convert file to Uint8Array
  const convertFileToUint8Array = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        resolve(uint8Array);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const closeModal = () => {
    setUserModalIsOpen(false);
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setProfilePicture(file);
    }
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
        <div className="bg-[#222222] p-2 xxs1:p-6 rounded-2xl text-white mx-2 xxs1:mx-6 max-h-[100vh] overflow-y-auto no-scrollbar w-[786px] relative">
          <div className="bg-[#FFFFFF4D] mx-[-7px] xxs1:mx-[-24px] mt-[-10px] xxs1:mt-[-25px] px-4 py-1 mb-4 rounded-2xl relative">
            <button
              onClick={closeModal}
              className="absolute mt-1 right-8 text-[25px] md:text-[30px] text-white"
            >
              <TfiClose />
            </button>
            <h2 className="text-[20px] font-medium md:text-[25px] md:font-semibold">Create User</h2>
          </div>

          {/* Form */}
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
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div
                onClick={handleFileUploadClick}
                className="cursor-pointer w-full flex items-center justify-start p-1.5 bg-[#333333] text-white rounded-md border-b-2"
              >
                <span className="text-xl font-bold mr-2">+</span>
                <span>{fileName ? fileName : "Upload Image"}</span>
              </div>
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
                ${termsAccepted ? 'border-[#F3B3A7]' : 'border-white bg-transparent'}`}
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
            {validationError && <p className="text-red-500 mb-4">{validationError}</p>}

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
