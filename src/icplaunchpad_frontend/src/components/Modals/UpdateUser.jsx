import React, { useEffect, useState } from 'react';
import { TfiClose } from 'react-icons/tfi';
import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../StateManagement/useContext/useAuth';
import { useDispatch } from 'react-redux';
import { addUserData } from '../../Redux-Config/ReduxSlices/UserSlice';
import { Principal } from '@dfinity/principal';

const UpdateUser = ({ userModalIsOpen, setUserModalIsOpen }) => {
  const { actor, principal, isAuthenticated } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [validationError, setValidationError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const userPrincipal = Principal.fromText(principal);

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
        tag: userData[0]?.tag || ''
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

  const onSubmit = async (data) => {
    setValidationError('');
    const { name, username, profile, links, tag } = data;

    if (!termsAccepted) {
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

      // Split the links by commas and trim whitespace
      const linksArray = links.split(',').map(link => link.trim());

      const updatedUserData = {
        name,
        username,
        profile_picture: profilePicture?.length ? [profilePicture] : [],
        links: linksArray,
        tag,
      };

      const response = await actor.update_user_account(userPrincipal, updatedUserData);
      if (response?.Err) {
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
    }
  };

  const closeModal = () => {
    setUserModalIsOpen(false);
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
            <div>
              <label className="block mb-2 text-[16px]">Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block mb-2 text-[16px]">Username</label>
              <input
                type="text"
                {...register('username', { required: 'Username is required' })}
                className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.username && <p className="text-red-500">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block mb-2 text-[16px]">Profile Picture</label>
              <input
                type="file"
                {...register('profile')}
                className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-[16px]">Social Links</label>
              <input
                type="text"
                {...register('links', { required: 'At least one social link is required' })}
                className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.links && <p className="text-red-500">{errors.links.message}</p>}
            </div>

            <div>
              <label className="block mb-2 text-[16px]">Tag</label>
              <input
                type="text"
                {...register('tag', { required: 'Tag is required' })}
                className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              />
              {errors.tag && <p className="text-red-500">{errors.tag.message}</p>}
            </div>

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
              <AnimationButton text="Submit" />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateUser;
