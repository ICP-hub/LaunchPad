import React, { useState } from 'react';
import { TfiClose } from "react-icons/tfi";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { Principal } from '@dfinity/principal';
import { ThreeDots } from "react-loader-spinner";
import ReactSelect from 'react-select';

import getReactSelectStyles from '../../common/Reactselect';

import { FaTrash } from "react-icons/fa";
import getSocialLogo from "../../common/getSocialLogo";

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

  // State for managing social links
  const [links, setLinks] = useState([{ url: '' }]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setValidationError('');

    const { name, username, profile_picture, tag } = data;

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
        name,
        username,
        profile_picture: profilePictureData.length > 0 ? [profilePictureData] : [],
        links,
        tag,
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

  // Function to add a new link
  const addLink = () => {
    setLinks([...links, { url: '' }]);
  };

  // Function to update a link
  const updateLink = (index, key, value) => {
    const updatedLinks = links.map((link, i) => (i === index ? { ...link, [key]: value } : link));
    setLinks(updatedLinks);
  };

  // Function to remove a link
  const removeLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };


// Add necessary states for the select options
const [tagsOptions] = useState([
  { value: 'tag1', label: 'Tag 1' },
  { value: 'tag2', label: 'Tag 2' },
  // Add more options as needed
]);
const [tagsSelectedOptions, setTagsSelectedOptions] = useState([]);

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
            <div className="mb-4">
              <h2 className="block text-[19px] mb-1">Social Links</h2>
              {links.map((link, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  {getSocialLogo(link.url)}

                  <input
                    type="url"
                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                    placeholder="Enter URL"
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                  />
                  <button
                    onClick={() => removeLink(index)}
                    className="ml-2 text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button onClick={addLink} className="text-blue-400 mt-2">
                + Add another link
              </button>
              {errors.links && <p className="text-red-500">{errors.links.message}</p>}
            </div>

            {/* Tags */}
           <div>
    <label className="block mb-2 text-[16px]">Tags</label>
    <ReactSelect
      isMulti
      menuPortalTarget={document.body}
      menuPosition={'fixed'}
      styles={getReactSelectStyles(
        errors?.tags && isFormTouched.tags
      )}
      value={tagsSelectedOptions}
      options={tagsOptions}
      classNamePrefix='select'
      className=' w-full p-2 bg-[#333333] text-white rounded-md border-b-2'
      placeholder='Select your tags'
      name='tags'
      onChange={(selectedOptions) => {
        if (selectedOptions && selectedOptions.length > 0) {
          setTagsSelectedOptions(selectedOptions);
          clearErrors('tags');
          setValue(
            'tags',
            selectedOptions.map((option) => option.value).join(', '),
            { shouldValidate: true }
          );
        } else {
          setTagsSelectedOptions([]);
          setValue('tags', '', {
            shouldValidate: true,
          });
          setError('tags', {
            type: 'required',
            message: 'Selecting at least one tag is required',
          });
        }
        handleFieldTouch('tags');
      }}
    />
    {errors.tags && <p className="text-red-500">{errors.tags.message}</p>}
  </div>


            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="mr-2"
              />
              <span>I accept the terms and conditions</span>
            </div>

            {/* Validation Error */}
            {validationError && <p className="text-red-500">{validationError}</p>}

            {/* Submit Button */}
            <div className="flex justify-center">
              <AnimationButton text="submit"  isLoading={isSubmitting} />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateUser;
