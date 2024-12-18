

import React, { useLayoutEffect, useState } from 'react';
import { TfiClose } from "react-icons/tfi";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Principal } from '@dfinity/principal';
import { ThreeDots } from "react-loader-spinner";
import ReactSelect from 'react-select';

import getReactSelectStyles from '../../common/Reactselect';
import { FaTrash } from "react-icons/fa";
import { getSocialLogo } from "../../common/getSocialLogo";
import { validationSchema } from '../../common/Validations/UserValidation';
import AnimationButton from '../../common/AnimationButton';
import { userRegisteredHandlerRequest } from '../../StateManagement/Redux/Reducers/userRegisteredData';
import { ProfileImageIDHandlerRequest } from '../../StateManagement/Redux/Reducers/ProfileImageID';
import { tagsOptions } from '../../utils/tagsOptions';
import CompressedImage from '../../utils/CompressedImage';
const CreateUser = ({ userModalIsOpen, setUserModalIsOpen }) => {
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);

  const principal = useSelector((currState) => currState.internet.principal);
  const { register,unregister, handleSubmit, formState: { errors }, control, reset, setValue, clearErrors, setError } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useDispatch();
  const [validationError, setValidationError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [links, setLinks] = useState([{ url: '' }]);
  // Manage social links with react-hook-form's useFieldArray
  const { append, remove } = useFieldArray({
    control,
    name: 'links',  // Corresponds to 'links' in validationSchema
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setValidationError('');
  
    const { name, username, links, profile_picture, tags } = data;
    console.log('links=', links);
  
    if (!termsAccepted) {
      setValidationError('Please accept the terms and conditions.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      // Prepare user data
      let originalFileSize = 0;
      let profilePictureData = [];
      
      if (profile_picture && profile_picture[0]) {
        originalFileSize = profile_picture[0].size;
        console.log('Original Image Size (bytes):', originalFileSize);
  
        const compressedFile = await CompressedImage(profile_picture);
        console.log('Compressed Image Size (bytes):', compressedFile.size);
        profilePictureData = await convertFileToUint8Array(compressedFile);
      }
  
      const userData = {
        name,
        username,
        profile_picture: profilePictureData.length > 0 ? [profilePictureData] : [],
        links,
        tag: tags.length > 0 ? tags : [],
      };
  
      // Create an array of promises
      const promises = [
        actor.create_account(userData), // Create the user account
      ];
  
      if (userData.profile_picture.length > 0) {
        promises.push(
          actor.upload_profile_image(process.env.CANISTER_ID_IC_ASSET_HANDLER, {
            content: userData.profile_picture,
          }) // Upload profile picture if it exists
        );
      }
  
      // Use Promise.allSettled to handle all promises
      const results = await Promise.allSettled(promises);
  
      // Handle the results
      const createAccountResult = results[0];
      if (createAccountResult.status === 'rejected' || createAccountResult.value?.Err) {
        const errorMsg =
          createAccountResult.status === 'rejected'
            ? createAccountResult.reason || 'Unknown error occurred while creating account.'
            : createAccountResult.value.Err;
        throw new Error(errorMsg);
      }
  
      console.log('User account created:', createAccountResult.value);
  
      if (results.length > 1) {
        const uploadImageResult = results[1];
        if (uploadImageResult.status === 'rejected') {
          console.warn('Error uploading profile picture:', uploadImageResult.reason);
        } else {
          console.log('Profile picture uploaded successfully');
          dispatch(ProfileImageIDHandlerRequest());
        }
      }
  
      if (!principal) {
        throw new Error('User is not authenticated or principal is missing.');
      }
  
      // Dispatch user registration action
      dispatch(userRegisteredHandlerRequest());
  
      // Close modal, reset form, and navigate to home
      setUserModalIsOpen(false);
      navigate('/');
      reset();
    } catch (err) {
      console.error('An error occurred:', err);
      setValidationError(err.message || 'An error occurred while creating the User.');
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


  // const extractDomain = (url) => {
  //   try {
  //     return new URL(url).hostname.replace('www.', '');
  //   } catch (error) {
  //     console.error("Invalid URL:", url);
  //     return null;
  //   }
  // };



  // Function to handle field touch
  const handleFieldTouch = (fieldName) => {
    setError(fieldName, { type: 'touched' });
  };
  const addLink = () => {
    setLinks(prev => [...prev, { url: '' }]);
  };

  const removeLink = (index) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
    clearErrors(`links.${index}`);
    clearErrors("links");
    unregister(`links.${index}`);
  };
  const updateLink = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index].url = value;
    setLinks(updatedLinks);
    setValue(`links.${index}`, value);
  };

    useLayoutEffect(() => {
    if (userModalIsOpen) {
      document.body.classList.add("overflow-hidden"); 
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [userModalIsOpen]);
  return (
    <div className="absolute">
  <Modal
    isOpen={userModalIsOpen}
    onRequestClose={closeModal}
    contentLabel="Create User Modal"
    className="fixed inset-0 flex items-center justify-center bg-transparent outline-none"
    overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-60"
    ariaHideApp={false}
  >
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="bg-[#222222] p-6 rounded-2xl text-white mx-6 max-h-[90vh] w-[786px] relative">
      {/* Modal Header */}
      <div className="bg-[#FFFFFF4D] px-4 py-1 mb-4 rounded-2xl relative">
        <button onClick={closeModal} className="absolute top-2 right-4 text-[20px] font-bold text-white">
          <TfiClose />
        </button>
        <h2 className="xxs1:text-[20px] text-[17px] font-medium md:text-[25px] md:font-semibold">
          Create User
        </h2>
      </div>

      {/* Scrollable Form Content */}
      <div style={{ maxHeight: "calc(90vh - 150px)", overflowY: "auto" }}>
        <div  className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-2 text-[16px]">Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full p-1 pl-2 bg-[#333333] text-white rounded-md border-b-2 outline-none"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block mb-2 text-[16px]">Username</label>
            <input
              type="text"
              {...register("username")}
              className={`w-full p-1 pl-2 bg-[#333333] text-white rounded-md outline-none ${
                errors.user_name ? "border-red-500" : "border-white"
              } border-b-2`}
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
              <div onClick={handleFileUploadClick} className="cursor-pointer flex items-center p-1 bg-[#333333] text-white rounded-md border-b-2">
                <span className="text-xl font-bold mx-2">+</span>
                <span>{fileName || "Upload Image"}</span>
              </div>
              {errors.profile_picture && <p className="text-red-500">{errors.profile_picture.message}</p>}
            </div>
            {/* Social Links */}
            <div className="mb-4">
              <h2 className="block text-[16px] mb-1">Social Links</h2>

              {links.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center mb-2 pb-1">
                    <Controller
                      name={`links.${index}`} // Reference each link correctly
                      control={control}
                      defaultValue={item.url || ''} // Ensure defaultValue fallback
                      render={({ field }) => (
                        <div className="flex items-center w-full">
                          <div className="flex items-center space-x-2 w-full">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                              {field.value && getSocialLogo(field.value)} {/* Display social icon */}
                            </div>
                            <input
                              type="text"
                              placeholder="Enter your social media URL"
                              className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                              {...field} // Spread field props
                              onChange={(e) => {
                                field.onChange(e); // React-hook-form onChange
                                updateLink(index, e.target.value); // Call your updateLink logic
                              }}
                            />
                          </div>
                        </div>
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(index)} // Remove the link
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  {errors.links?.[index] && (
                    <p className="text-red-500">{errors.links[index].message}</p>
                  )}
                </div>
              ))}
              <button
                onClick={addLink}
                className="text-[#F3B3A7]"
                disabled={links.length >= 5} // Limit to 5 links
              >
                + Add another link
              </button>
              {/* Limit Message */}
              {links.length >= 5 && (
                <p className="text-gray-500 text-sm mt-1">You can add up to 5 links only.</p>
              )}
            </div>

            {/* Tags */}
            <div className='mt-2'>
              <label className="block mb-2 text-[16px]">Tags</label>
              <Controller
                name="tags"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <ReactSelect
                    isMulti
                    menuPortalTarget={document.body}
                    menuPosition={'fixed'}
                    styles={getReactSelectStyles(errors?.tags)}
                    value={tagsOptions.filter(option => (field.value || []).includes(option.value))}
                    options={tagsOptions}
                    classNamePrefix='select'
                    className='w-full text-white rounded-md'
                    placeholder='Select your tags'
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions.map(option => option.value);
                      setValue('tags', selectedValues);
                      if (selectedValues.length > 0) {
                        clearErrors('tags');
                      } else {
                        setError('tags', {
                          type: 'required',
                          message: 'Selecting at least one tag is required',
                        });
                      }
                    }}
                    onBlur={() => handleFieldTouch('tags')}
                  />
                )}
              />

              {errors.tags && <p className="text-red-500">{errors.tags.message}</p>}
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
              <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm mr-2 cursor-pointer ${termsAccepted ? "border-[#F3B3A7]" : "border-white bg-transparent"
                }`}>
                <label htmlFor="termsCheckbox" className="cursor-pointer w-full h-full flex items-center justify-center">
                  {termsAccepted && <span className="text-[#F3B3A7]">✓</span>}
                </label>
              </div>
              <label htmlFor="termsCheckbox"  className="text-[15px] text-[#cccccc]">
                By creating an account, I agree to the terms and conditions.
              </label>
            </div>

          {/* Validation Error */}
          {validationError && <p className="text-red-500 mb-4">{validationError}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center items-center mt-4">
        <AnimationButton text="Submit" loading={isSubmitting} isDisabled={isSubmitting}  />
      </div>
    </div>
    </form>
  </Modal>
</div>

  );
};

export default CreateUser;