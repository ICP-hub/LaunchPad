import React, { useEffect, useState } from 'react';
import { TfiClose } from 'react-icons/tfi';
import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../StateManagement/useContext/useAuth';
import { useDispatch } from 'react-redux';
import { addUserData } from '../../Redux-Config/ReduxSlices/UserSlice';
import { Principal } from '@dfinity/principal';
import { validationSchema } from '../../common/UserValidation'; // Adjust this import path
import ReactSelect from 'react-select';
import getReactSelectStyles from '../../common/Reactselect';
import { getSocialLogo } from '../../common/getSocialLogo';
import { FaTrash } from "react-icons/fa";
const UpdateUser = ({ userModalIsOpen, setUserModalIsOpen }) => {
  const { actor, principal, isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  const [validationError, setValidationError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

 // State for managing social links
 const [links, setLinks] = useState([{ url: '' }]);

  const userPrincipal = Principal.fromText(principal);

  // Integrate Yup validation schema
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema), // Use the Yup validation schema
  });

  useEffect(() => {
    if (isAuthenticated) {
      getUser();
    }
  }, [isAuthenticated, userModalIsOpen]);

  useEffect(() => {
    if (userData) {
      reset({
        name: userData[0]?.name || '',
        username: userData[0]?.username || '',
        links: userData[0]?.links ? userData[0].links.join(', ') : '',
        tag: userData[0]?.tag || '',
      });
    }
  }, [userData, reset]);

  const getUser = async () => {
    try {
      const data = await actor.get_user_account(userPrincipal);
      setUserData(data);
      console.log('Fetched user data:', data);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };
  const addLink = () => {
        setPresaleDetails((prev) => ({
          ...prev,
          social_links: [...prev.social_links, { type: "", url: "" }],
        }));
      };
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setValidationError('');

    const { name, username, profile, links, tags } = data;

    if (!termsAccepted) {
      setIsSubmitting(false);
      setValidationError('Please accept the terms and conditions.');
      return;
    }

    try {
      let profilePicture = null;

      if (profile && profile.length > 0) {
        const file = profile[0];
        const arrayBuffer = await file.arrayBuffer();
        profilePicture = Array.from(new Uint8Array(arrayBuffer));
      }

      const linksArray = links.split(',').map(link => link.trim());

      const updatedUserData = {
        name,
        username,
        profile_picture: profilePicture?.length ? [profilePicture] : [],
        links: linksArray,
        tag:tags,
      };

      const response = await actor.update_user_account(userPrincipal, updatedUserData);
      if (response?.Err) {
        setIsSubmitting(false);
        setValidationError(response.Err);
        return;
      }

      console.log('User updated:', response);

      if (profilePicture?.length > 0) {
        try {
          const imageUploadResponse = await actor.upload_profile_image('br5f7-7uaaa-aaaaa-qaaca-cai', {
            content: [profilePicture],
          });
          console.log('Profile picture uploaded:', imageUploadResponse);
        } catch (imgErr) {
          console.error('Error uploading profile picture:', imgErr);
        }
      }

      const updatedData = await actor.get_user_account(userPrincipal);
      if (updatedData) {
        const { profile_picture, ...restUserData } = updatedData[0];
        dispatch(addUserData(restUserData));
      }

      setUserModalIsOpen(false);
      reset();
    } catch (err) {
      console.error('Error updating user:', err);
      setValidationError('An error occurred while updating the user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => setUserModalIsOpen(false);

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
        contentLabel="Update User Modal"
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"
        ariaHideApp={false}
      >
        <div className="bg-[#222222] p-6 rounded-2xl text-white max-h-[100vh] overflow-y-auto no-scrollbar w-[786px] relative">
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
                {...register('name')} // Use 'full_name' from the validation schema
                className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>} {/* Update error handling */}
            </div>

            {/* Username */}
            <div>
              <label className="block mb-2 text-[16px]">Username</label>
              <input
                type="text"
                {...register('username')}
                className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.username && <p className="text-red-500">{errors.username.message}</p>}
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block mb-2 text-[16px]">Profile Picture</label>
              <input
                type="file"
                {...register('image')} // Update to use 'image' from validation schema
                className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.image && <p className="text-red-500">{errors.image.message}</p>} {/* Add error handling for image */}
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

            {/* Validation Error */}
            {validationError && <p className="text-red-500 mb-4">{validationError}</p>}

            {/* Submit Button */}
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
