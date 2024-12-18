import React, { useEffect, useState } from 'react';
import { TfiClose } from 'react-icons/tfi';
import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Principal } from '@dfinity/principal';
import { updatevalidationSchema } from '../../common/Validations/UpdateUserValidation';
import ReactSelect from 'react-select';
import getReactSelectStyles from '../../common/Reactselect';
import { getSocialLogo } from '../../common/getSocialLogo';
import { FaTrash } from 'react-icons/fa';
import { convertFileToBase64 } from '../../utils/convertToBase64';
import { userRegisteredHandlerRequest } from '../../StateManagement/Redux/Reducers/userRegisteredData';
import { ProfileImageIDHandlerRequest } from '../../StateManagement/Redux/Reducers/ProfileImageID';
import { tagsOptions } from '../../utils/tagsOptions';
import compressImage from '../../utils/CompressedImage';

const UpdateUser = ({ userModalIsOpen, setUserModalIsOpen }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const principal = useSelector((currState) => currState.internet.principal);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData.data);


  const [validationError, setValidationError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagSelectedOptions, setTagSelectedOptions] = useState([]);
  const [fileName, setFileName] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profilePictureData, setProfilePictureData] = useState(null);
  const [links, setLinks] = useState([{ url: '' }]);
  const [isVisible, setIsVisible] = useState(false);

  // const [tagsOptions] = useState(tagsOptions);

  const userPrincipal = principal && Principal.fromText(principal);

  const { register, unregister, handleSubmit, formState: { errors }, reset, control, setValue, clearErrors, setError } = useForm({
    resolver: yupResolver(updatevalidationSchema),
  });

  useEffect(() => {
    if (userModalIsOpen) {
      setIsVisible(true);
    }
  }, [userModalIsOpen]);

  useEffect(() => {
    if (userData) {
     
      const selectedTags = userData.tag?.map(tag => ({ value: tag, label: tag })) || [];
      setTagSelectedOptions(selectedTags);

      const linksArray = userData?.links?.map(link => ({ url: link })) || [{ url: '' }];
      setLinks(linksArray);

      if (userData.profile_picture && userData.profile_picture.length > 0) {
        convertFileToBase64(userData.profile_picture[0])
          .then((base64Image) => setProfileImagePreview(base64Image))
          .catch((error) => console.error("Error converting image to Base64:", error));
      } else {
        setProfileImagePreview(null);
      }

      reset({
        name: userData?.name || '',
        username: userData?.username || '',
        profile_picture: null,
        links: linksArray.map(link => link.url),
        tags: selectedTags.map(tag => tag.value),
      });
    }
  }, [userData, reset]);

  const handleProfilePictureChange = async (file) => {
    if (file) {
      try {
        console.log('Original Image Size (bytes):', file.size);

        const compressedFile = await compressImage(file);

        console.log('Compressed Image Size (bytes):', compressedFile.size);
        setProfilePictureData(new Uint8Array(await compressedFile.arrayBuffer()));
        const base64String = await convertFileToBase64(compressedFile);
        setFileName(file.name);
        setProfileImagePreview(base64String);
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setValidationError('');
    const { name, username, tags } = data;
  
    if (!termsAccepted) {
      setIsSubmitting(false);
      setValidationError('Please accept the terms and conditions.');
      return;
    }
  
    const profile_picture = profilePictureData ? [profilePictureData] : [];
    const linksArray = links.map(link => link.url.trim());
  
    try {
      const updatedUserData = { name, username, profile_picture, links: linksArray, tag: tags };
  
      const promises = [
        // Update user account
        actor.update_user_account(userPrincipal, updatedUserData),
        
        // Upload profile picture (if applicable)
        ...(profile_picture.length > 0
          ? [
              actor.upload_profile_image(
                process.env.CANISTER_ID_IC_ASSET_HANDLER,
                { content: [profile_picture[0]] }
              )
            ]
          : [])
      ];
  
      // Wait for all promises to settle
      const results = await Promise.allSettled(promises);
  
      // Process results
      const updateUserResult = results[0];
      if (updateUserResult.status === 'rejected' || updateUserResult.value?.Err) {
        throw new Error(
          updateUserResult.status === 'rejected'
            ? updateUserResult.reason || 'Unknown error'
            : updateUserResult.value.Err
        );
      }
  
      if (profile_picture.length > 0) {
        const uploadProfileResult = results[1];
        if (uploadProfileResult.status === 'rejected') {
          console.warn('Profile picture upload failed:', uploadProfileResult.reason);
        } else {
          console.log('Profile picture uploaded');
          dispatch(ProfileImageIDHandlerRequest());
        }
      }
  
      // Proceed with post-success actions
      dispatch(userRegisteredHandlerRequest());
      setUserModalIsOpen(false);
      reset();
  
    } catch (err) {
      console.error('Error:', err);
      setValidationError(err.message || 'An error occurred while updating the user.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const closeModal = () =>
   { setIsVisible(false);
    setTimeout(() => setUserModalIsOpen(false), 300); // Match transition duration
   }

  const addLink = () => setLinks(prev => [...prev, { url: '' }]);

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

  const handleFieldTouch = (fieldName) => setError(fieldName, { type: 'touched' });

  return (
    <div className="absolute">
      <Modal
        isOpen={userModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update User Modal"
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300"
        ariaHideApp={false}
      >
        <div className={`bg-[#222222] p-6 rounded-2xl text-white max-h-[90vh] overflow-y-auto no-scrollbar w-[786px] relative transform transition-all duration-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}>
          <div className="bg-[#FFFFFF4D] px-4 py-1 mb-4 rounded-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-0 mt-2 right-4 text-[30px] text-white"
            >
              <TfiClose />
            </button>
            <h2 className="text-[25px] font-semibold">Update User</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block mb-2 text-[16px]">Name</label>
              <input
                type="text"
                {...register('name')}
                className={`w-full p-2 rounded-3xl border-b-2 outline-none ${errors.name ? 'border-red-500 bg-[#333333]' : 'border-white bg-[#444444]'
                  } text-white`}
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block mb-2 text-[16px]">Username</label>
              <input
                type="text"
                {...register('username')}
                className={`w-full p-2 rounded-3xl border-b-2 outline-none ${errors.username ? 'border-red-500 bg-[#333333]' : 'border-white bg-[#444444]'
                  } text-white`}
              />
              {errors.username && <p className="text-red-500">{errors.username.message}</p>}
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block mb-2 text-[16px]">Profile Picture</label>
              {profileImagePreview && (
                <img src={profileImagePreview} alt="Profile Preview" className="w-24 h-24 object-cover rounded-2xl mt-2" />
              )}
              <input
                type="file"
                id="profile_picture"
                style={{ display: "none" }}
                onChange={(e) => handleProfilePictureChange(e.target.files[0])}
              />
              <div onClick={() => document.getElementById('profile_picture').click()} className="cursor-pointer flex items-center p-2 bg-[#333333] text-white rounded-md border-b-2">
                <span className="text-xl font-bold mr-2">+</span>
                <span>{fileName || "Upload Image"}</span>
              </div>
              {errors.profile_picture && <p className="text-red-500">{errors.profile_picture.message}</p>}
            </div>

            {/* Social Links */}
            <div className="mb-4">
              <h2 className="block text-[19px] mb-1">Social Links</h2>

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
    className="text-[#F3B3A7] mt-2"
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
            <div>
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
                    value={tagSelectedOptions}
                    options={tagsOptions}
                    classNamePrefix='select'
                    className='w-full p-2 text-white rounded-md'
                    placeholder='Select your tags'
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions.map(option => option.value);
                      setValue('tags', selectedValues);
                      setTagSelectedOptions(selectedOptions);

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
            <div className="flex items-center mt-4">
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
                By updating an account, I agree to the terms and conditions.
              </p>
            </div>


            {validationError && <p className="text-red-500 mb-4">{validationError}</p>}

            <div className="flex justify-center items-center">
              <AnimationButton text="Submit" loading={isSubmitting} isDisabled={isSubmitting} />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateUser;