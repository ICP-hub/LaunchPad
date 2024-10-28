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
import { validationSchema } from '../../common/UserValidation';
import ReactSelect from 'react-select';
import getReactSelectStyles from '../../common/Reactselect';
import { getSocialLogo } from '../../common/getSocialLogo';
import { FaTrash } from 'react-icons/fa';

const UpdateUser = ({ userModalIsOpen, setUserModalIsOpen }) => {
  const { actor, principal, isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  const [validationError, setValidationError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagSelectedOptions, setTagSelectedOptions] = useState([]);
  const [fileName, setFileName] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profilePictureData, setProfilePictureData] = useState(null);
  const [tagsOptions] = useState([
    { value: 'tag1', label: 'Tag 1' },
    { value: 'tag2', label: 'Tag 2' },
    { value: 'tag3', label: 'Tag 3' },
    { value: 'tag4', label: 'Tag 4' },
    { value: 'tag5', label: 'Tag 5' },
  ]);


  // State for managing social links
  const [links, setLinks] = useState([{ url: '' }]);
  const userPrincipal = Principal.fromText(principal);

  // Integrate Yup validation schema
  const { register, handleSubmit, formState: { errors }, reset, control, setValue, clearErrors, setError } = useForm({
    resolver: yupResolver(validationSchema),
  });
  console.log("Form errors:", errors);
  useEffect(() => {
    if (isAuthenticated) {
      getUser();
    }
  }, [isAuthenticated, userModalIsOpen]);

  useEffect(() => {
    if (userData && userData.length > 0) {
      const user = userData[0];


      console.log("Resetting form with data:", user);
      // const selectedTags = user.tag?.map(tag => ({
      //   value: tag,
      //   label: tag,
      // })) || [];
      // setTagSelectedOptions(selectedTags);

      // const linksArray = user?.links?.map(link => ({ url: link })) || [{ url: '' }];
      // setLinks(linksArray);
      const selectedTags = user.tag?.map(tag => ({ value: tag, label: tag })) || [];
      setTagSelectedOptions(selectedTags);

      const linksArray = user?.links?.map(link => ({ url: link })) || [{ url: '' }];
      setLinks(linksArray);
      if (user.profile_picture && user.profile_picture.length > 0) {
        const base64String = btoa(String.fromCharCode(...new Uint8Array(user.profile_picture[0])));
        setProfileImagePreview(`data:image/jpeg;base64,${base64String}`);
      } else {
        setProfileImagePreview(null);
      }
      reset({
        name: user?.name || '',
        username: user?.username || '',
        profile_picture: null,
        // links: linksArray,
        // tags: selectedTags, 
        links: linksArray.map(link => link.url),
        tags: selectedTags.map(tag => tag.value),
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

  const handleProfilePictureChange = async (file) => {
    if (file) {
      const uint8Array = await convertFileToUint8Array(file);
      setProfilePictureData(uint8Array);
      setFileName(file.name);
      const base64String = btoa(String.fromCharCode(...uint8Array));
      setProfileImagePreview(`data:image/jpeg;base64,${base64String}`);
    }
  };
  const onSubmit = async (data) => {
    console.log("onSubmit called with data:", data);
    setIsSubmitting(true);
    setValidationError('');
    if (links.length <= 5) {
      clearErrors("links"); 
    }
    const { name, username, profile, tags } = data;

if (!termsAccepted) {
  setIsSubmitting(false);
  setValidationError('Please accept the terms and conditions.');
  return;
}

    try {

      const profile_picture = profilePictureData ? [profilePictureData] : [];
      const linksArray = links.map(link => link.url.trim());

      console.log("Submitting data:", { name, username, profile_picture, tags, linksArray });

      const updatedUserData = {
        name,
        username,
        profile_picture,
        links: linksArray,
        tag: tags,
      };

  const response = await actor.update_user_account(userPrincipal, updatedUserData);
  if (response?.Err) {
    setIsSubmitting(false);
    setValidationError(response.Err);
    return;
  }

  console.log('User updated:', response);


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

  const addLink = () => {
    setLinks(prev => [...prev, { url: '' }]);
  };

  const removeLink = (index) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
    clearErrors(`links.${index}`);
    clearErrors("links");
  };

  const updateLink = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index].url = value;
    setLinks(updatedLinks);
    setValue(`links.${index}`, value);
  };


  const handleFieldTouch = (fieldName) => {
    setError(fieldName, { type: 'touched' });
  };


  return (
    <div className="absolute">
      <Modal
        isOpen={userModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update User Modal"
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        overlayClassName="fixed z-[100] inset-0 bg-opacity-50"
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
              {/* {links.map((link, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  {getSocialLogo(link.url)}
                  <input
                    type="url"
                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                    placeholder="Enter URL"
                    value={link.url}
                    onChange={(e) => updateLink(index, e.target.value)}
                  />
                  <button
                    onClick={() => removeLink(index)}
                    className="ml-2 text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))} */}
              {links.map((item, index) => (
                <div key={index} className='flex flex-col'>
                  <div className='flex items-center mb-2 pb-1'>
                    <Controller
                      name={`links.${index}`}  // Assigns each input field a unique path in react-hook-form
                      control={control}
                      defaultValue={item.url || ''} // Use item.url as the default value
                      render={({ field }) => (
                        <div className='flex items-center w-full'>
                          <div className='flex items-center space-x-2 w-full'>
                            <div className='flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full'>
                              {field.value && getSocialLogo(field.value)}
                            </div>
                            <input
                              type='text'
                              placeholder='Enter your social media URL'
                              className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e); // Updates react-hook-form
                                updateLink(index, e.target.value); // Updates local state
                              }}
                            />
                          </div>
                        </div>
                      )}
                    />
                    <button
                      type='button'
                      onClick={() => removeLink(index)}
                      className='ml-2 text-red-500 hover:text-red-700'
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addLink} className="text-blue-400 mt-2">
                + Add another link
              </button>
              {errors.links?.root && (
                <p className="text-red-500 mt-2">{errors.links.root.message}</p>
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
