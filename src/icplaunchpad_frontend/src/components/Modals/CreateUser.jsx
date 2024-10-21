import React, { useState } from 'react';
import { TfiClose } from "react-icons/tfi";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { Principal } from '@dfinity/principal';
import { ThreeDots } from "react-loader-spinner";

import { validationSchema } from '../../common/UserValidation';
import AnimationButton from '../../common/AnimationButton';
import { useAuth } from '../../StateManagement/useContext/useAuth';
import { addUserData } from '../../Redux-Config/ReduxSlices/UserSlice';

const CreateUser = ({ userModalIsOpen, setUserModalIsOpen }) => {
  const navigate = useNavigate();
  const { actor, principal } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [validationError, setValidationError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setValidationError('');

    const { name, username, links, profile_picture, tags } = data;

    if (!termsAccepted) {
      setValidationError("Please accept the terms and conditions.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare user data
      let profilePictureData = [];
      if (profile_picture) {
        profilePictureData = await convertFileToUint8Array(profile_picture);
      }

      const userData = {
        name: name,
        username: username,
        profile_picture: profilePictureData.length > 0 ? [profilePictureData] : [],
        links,
        tag:tags,
      };

      // Create the user account
      const response = await actor.create_account(userData);
      if (response?.Err) {
        setValidationError(response.Err);
        setIsSubmitting(false);
        return;
      }

      // Upload profile picture if exists
      if (userData.profile_picture.length > 0) {
        try {
          await actor.upload_profile_image("br5f7-7uaaa-aaaaa-qaaca-cai", {
            content: userData.profile_picture,
          });
        } catch (imgErr) {
          console.error("Error uploading profile picture:", imgErr);
        }
      }

      // Fetch and store user data
      const ownerPrincipal = Principal.fromText(principal);
      const fetchedUserData = await actor.get_user_account(ownerPrincipal);

      if (fetchedUserData) {
        const { profile_picture, ...restUserData } = fetchedUserData[0];
        dispatch(addUserData(restUserData));
      }

      // Close modal, reset form, and navigate to home
      setUserModalIsOpen(false);
      navigate("/");
      reset();
    } catch (err) {
      console.error("An error occurred:", err);
      setValidationError("An error occurred while creating the User.");
    } finally {
      setIsSubmitting(false);
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

  const closeModal = () => setUserModalIsOpen(false);

  const handleFileUploadClick = () => {
    document.getElementById('profile_picture').click();
  };

  return (
    <div className="absolute">
      <Modal
        isOpen={userModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create User Modal"
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        overlayClassName="fixed z-[100] inset-0 bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="bg-[#222222] p-6 rounded-2xl text-white mx-6 max-h-[90vh] overflow-y-auto no-scrollbar w-[786px] relative">
          {/* Modal Header */}
          <div className="bg-[#FFFFFF4D] px-4 py-1 mb-4 rounded-2xl relative">
            <button onClick={closeModal} className="absolute top-2 right-4 text-[20px] xxs1:text-[30px] text-white">
              <TfiClose />
            </button>
            <h2 className="xxs1:text-[20px] text-[17px] font-medium md:text-[25px] md:font-semibold">
              Create User
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block mb-2 text-[16px]">Name</label>
              <input
                type="text"
                {...register("name")}
                className="w-full p-1 pl-4 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block mb-2 text-[16px]">Username</label>
              <input
                type="text"
                {...register("username")}
                className="w-full p-1 pl-4 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.username && <p className="text-red-500">{errors.username.message}</p>}
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block mb-2 text-[16px]">Profile Picture</label>
              <Controller
                name="profile_picture"
                control={control}
                render={({ field }) => (
                  <input
                    type="file"
                    id="profile_picture"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      field.onChange(e.target.files[0]);
                      setFileName(e.target.files[0]?.name || "");
                    }}
                  />
                )}
              />
              <div onClick={handleFileUploadClick} className="cursor-pointer flex items-center p-2 bg-[#333333] text-white rounded-md border-b-2">
                <span className="text-xl font-bold mr-2">+</span>
                <span>{fileName || "Upload Image"}</span>
              </div>
              {errors.profile_picture && <p className="text-red-500">{errors.profile_picture.message}</p>}
            </div>

            {/* Social Links */}
            <div>
              <label className="block mb-2 text-[16px]">Social Links</label>
              <Controller
                name="links"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.split(',').map(link => link.trim()))}
                    className="w-full p-1 pl-4 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                  />
                )}
              />
              {errors.links && <p className="text-red-500">{errors.links.message}</p>}
            </div>

            {/* Tag */}
            <div>
              <label className="block mb-2 text-[16px]">Tag</label>
              <input
                type="text"
                {...register("tags")}
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
              <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm mr-2 cursor-pointer ${
                termsAccepted ? "border-[#F3B3A7]" : "border-white bg-transparent"
              }`}>
                <label htmlFor="termsCheckbox" className="cursor-pointer w-full h-full flex items-center justify-center">
                  {termsAccepted && <span className="text-[#F3B3A7]">✓</span>}
                </label>
              </div>
              <p className="text-[15px] text-[#cccccc]">
                By creating an account, I agree to the terms and conditions.
              </p>
            </div>

            {/* Validation Error */}
            {validationError && <p className="text-red-500 mb-4">{validationError}</p>}

            {/* Submit Button */}
            <div className="flex justify-center items-center">
              <AnimationButton
                text="Submit"
               
                loading={isSubmitting}
                isDisabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateUser;
