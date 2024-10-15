import React, { useEffect, useState } from 'react';
import { TfiClose } from 'react-icons/tfi';
import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../StateManagement/useContext/useAuth';
import { Principal } from '@dfinity/principal';

const UpdateToken = ({ ledgerId, tokenModalIsOpen, setTokenModalIsOpen }) => {
    const { actor, isAuthenticated } = useAuth();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [validationError, setValidationError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [tokenData, setTokenData] = useState(null);

    const ledgerPrincipal = Principal.fromText(ledgerId);

    // Fetch token data when modal is open and user is authenticated
    useEffect(() => {
        if (isAuthenticated && tokenModalIsOpen) {
            getTokenData();
        }
    }, [isAuthenticated, tokenModalIsOpen]);

    // Populate the form fields with fetched token data
    useEffect(() => {
        if (tokenData) {
            reset({
                twitter: tokenData.twitter || '',
                instagram: tokenData.instagram || '',
                description: tokenData.description || '',
                youtube_video: tokenData.youtube_video || '',
                website: tokenData.website || '',
                facebook: tokenData.facebook || '',
                discord: tokenData.discord || '',
                telegram: tokenData.telegram || '',
                github: tokenData.github || '',
                reddit: tokenData.reddit || '',
            });
        }
    }, [tokenData, reset]);

    // Fetch token data from backend
    const getTokenData = async () => {
        try {
            const data = await actor.get_sale_params(ledgerPrincipal);
            setTokenData(data.Ok);
            console.log('Fetched token data:', data);
        } catch (err) {
            console.error('Error fetching token data:', err);
        }
    };

    // Handle form submission and update token data
    const onSubmit = async (data) => {
        setValidationError('');
        const {
            twitter,
            instagram,
            description,
            youtube_video,
            website,
            facebook,
            end_time_utc,
            discord,
            start_time_utc,
            telegram,
            github,
            reddit
        } = data;

        if (!termsAccepted) {
            setValidationError('Please accept the terms and conditions.');
            return;
        }

        try {
            const updatedTokenData = {
                twitter,
                instagram,
                description,
                youtube_video,
                website,
                facebook,
                end_time_utc: Math.floor(new Date(end_time_utc).getTime() / 1000),
                discord,
                start_time_utc: Math.floor(new Date(start_time_utc).getTime() / 1000),
                telegram,
                github,
                reddit,
            };

            const response = await actor.update_sale_params(ledgerPrincipal, updatedTokenData);
            if (response?.Err) {
                setValidationError(response.Err);
                return;
            }

            console.log('Token updated:', response);
            setTokenModalIsOpen(false);
            reset();
        } catch (err) {
            console.error('Error updating token:', err);
            setValidationError('An error occurred while updating the token.');
        }
    };

    // Close the modal
    const closeModal = () => {
        setTokenModalIsOpen(false);
    };

    return (
        <div className="absolute">
            <Modal
                isOpen={tokenModalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Update Token Modal"
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
                        <h2 className="text-[25px] font-semibold">Update Token details</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Social Media Links */}
                        <div className="flex flex-col xxs1:flex-row justify-between mb-4">
                            <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-6">
                                <label className="block text-[19px] mb-1">Facebook</label>
                                <input
                                    type="text"
                                    {...register('facebook')}
                                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                />
                                {errors.facebook && <p className="text-red-500">{errors.facebook.message}</p>}
                            </div>
                            <div className="w-full xxs1:w-1/2 xxs1:pl-2 mb-4">
                                <label className="block text-[19px] mb-1">Twitter</label>
                                <input
                                    type="text"
                                    {...register('twitter')}
                                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                />
                                {errors.twitter && <p className="text-red-500">{errors.twitter.message}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col xxs1:flex-row justify-between mb-4">
                            <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-4">
                                <label className="block text-[19px] mb-1">GitHub</label>
                                <input
                                    type="text"
                                    {...register('github')}
                                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                />
                                {errors.github && <p className="text-red-500">{errors.github.message}</p>}
                            </div>
                            <div className="w-full xxs1:w-1/2 xxs1:pl-2">
                                <label className="block text-[19px] mb-1">Telegram</label>
                                <input
                                    type="text"
                                    {...register('telegram')}
                                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                />
                                {errors.telegram && <p className="text-red-500">{errors.telegram.message}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col xxs1:flex-row justify-between mb-4">
                            <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-4">
                                <label className="block text-[19px] mb-1">Instagram</label>
                                <input
                                    type="text"
                                    {...register('instagram')}
                                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                />
                                {errors.instagram && <p className="text-red-500">{errors.instagram.message}</p>}
                            </div>
                            <div className="w-full xxs1:w-1/2 xxs1:pl-2">
                                <label className="block text-[19px] mb-1">Discord</label>
                                <input
                                    type="text"
                                    {...register('discord')}
                                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                />
                                {errors.discord && <p className="text-red-500">{errors.discord.message}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col xxs1:flex-row justify-between mb-[50px] xxs1:mb-8">
                            <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-4">
                                <label className="block text-[19px] mb-1">Reddit</label>
                                <input
                                    type="text"
                                    {...register('reddit')}
                                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                />
                                {errors.reddit && <p className="text-red-500">{errors.reddit.message}</p>}
                            </div>
                            <div className="w-full xxs1:w-1/2 xxs1:pl-2">
                                <label className="block text-[19px] mb-1">YouTube Video</label>
                                <input
                                    type="text"
                                    {...register('youtube_video')}
                                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                />
                                {errors.youtube_video && <p className="text-red-500">{errors.youtube_video.message}</p>}
                            </div>
                        </div>

                        {/* Time Inputs */}
                        <div className="flex flex-col xxs1:flex-row justify-between mb-[50px] xxs1:mb-8">
                            <div className="xxs1:w-1/2 pr-2 mb-6">
                                <label className="block text-[19px] mb-1">Start Time</label>
                                <input
                                    type="datetime-local"
                                    {...register('start_time_utc')}
                                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                />
                            </div>
                            <div className="xxs1:w-1/2 xxs1:pl-2 mb-6">
                                <label className="block text-[19px] mb-1">End Time</label>
                                <input
                                    type="datetime-local"
                                    {...register('end_time_utc')}
                                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                />
                            </div>
                        </div>

                        {/* Website and Description */}
                        <div className="mb-4">
                            <label className="block text-[19px] mb-1">Website</label>
                            <input
                                type="text"
                                {...register('website')}
                                className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                            />
                            {errors.website && <p className="text-red-500">{errors.website.message}</p>}
                        </div>
                        <div className="mb-6">
                            <label className="block text-[19px] mb-1">Description</label>
                            <textarea
                                {...register('description')}
                                className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2 h-32"
                            />
                            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                        </div>

                        {/* Validation Error */}
                        {validationError && <p className="text-red-500 mb-4">{validationError}</p>}

                        {/* Terms and Conditions */}
                        <div className="flex items-start xxs1:items-center mt-4 mb-6">
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="hidden peer"
              />
              <div
                className={`w-4 h-4 border-2 flex items-center mt-1 justify-center rounded-sm mr-2 cursor-pointer 
                ${termsAccepted ? '' : 'border-white bg-transparent'}`}
              >
                <label
                  htmlFor="termsCheckbox"
                  className="cursor-pointer w-full h-full flex items-center justify-center "
                >
                  {termsAccepted && <span className="text-[#F3B3A7]">✓</span>}
                </label>
              </div>
              <p className="text-[15px] text-[#cccccc]">
                By updating this token, I agree to the terms and conditions.
              </p>
            </div>

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

export default UpdateToken;
