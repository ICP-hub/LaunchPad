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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ledgerPrincipal = Principal.fromText(ledgerId);

    useEffect(() => {
        if (isAuthenticated && tokenModalIsOpen) {
            getTokenData();
        }
    }, [isAuthenticated, tokenModalIsOpen]);

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

    const getTokenData = async () => {
        try {
            const data = await actor.get_sale_params(ledgerPrincipal);
            setTokenData(data.Ok);
            console.log('Fetched token data:', data);
        } catch (err) {
            console.error('Error fetching token data:', err);
        }
    };

    const validateTimes = (startTime, endTime) => {
        if (endTime < startTime) {
            setValidationError('Start time should be less than end time.');
            setIsSubmitting(false);
            return false;
        }
        return true;
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
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
            setIsSubmitting(false);
            return;
        }

        const startTime = Math.floor(new Date(start_time_utc).getTime() / 1000);
        const endTime = Math.floor(new Date(end_time_utc).getTime() / 1000);

        if (!validateTimes(startTime, endTime)) return;

        const updatedTokenData = {
            twitter,
            instagram,
            description,
            youtube_video,
            website,
            facebook,
            end_time_utc: endTime,
            discord,
            start_time_utc: startTime,
            telegram,
            github,
            reddit,
        };

        try {
            const response = await actor.update_sale_params(ledgerPrincipal, updatedTokenData);
            if (response?.Err) {
                setValidationError(response.Err);
            } else {
                console.log('Token updated:', response);
                setTokenModalIsOpen(false);
                reset();
            }
        } catch (err) {
            setValidationError('An error occurred while updating the token.');
            console.error('Error updating token:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setTokenModalIsOpen(false);
    };

    const InputField = ({ label, name, type = 'text' }) => (
        <div className="w-full xxs1:w-1/2 xxs1:px-2 mb-4">
            <label className="block text-[19px] mb-1">{label}</label>
            <input
                type={type}
                {...register(name)}
                className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
            />
            {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
        </div>
    );

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
                        <div className="flex flex-col xxs1:flex-row justify-between mb-4">
                            <InputField label="Facebook" name="facebook" />
                            <InputField label="Twitter" name="twitter" />
                        </div>

                        <div className="flex flex-col xxs1:flex-row justify-between mb-4">
                            <InputField label="GitHub" name="github" />
                            <InputField label="Telegram" name="telegram" />
                        </div>

                        <div className="flex flex-col xxs1:flex-row justify-between mb-4">
                            <InputField label="Instagram" name="instagram" />
                            <InputField label="Discord" name="discord" />
                        </div>

                        <div className="flex flex-col xxs1:flex-row justify-between mb-4">
                            <InputField label="Reddit" name="reddit" />
                            <InputField label="YouTube Video" name="youtube_video" />
                        </div>

                        <div className="flex flex-col xxs1:flex-row justify-between mb-[50px] xxs1:mb-8">
                            <InputField label="Start Time" name="start_time_utc" type="datetime-local" />
                            <InputField label="End Time" name="end_time_utc" type="datetime-local" />
                        </div>
                       
                        <div className="mb-6">
                            <label className="block text-[19px] mb-1">Website</label>
                            <input
                                {...register('website')}
                                className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2 "
                            />
                            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-[19px] mb-1">Description</label>
                            <textarea
                                {...register('description')}
                                className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2 h-32"
                            />
                            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                        </div>

                        {validationError && <p className="text-red-500 mb-4">{validationError}</p>}

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

                        <div className="flex justify-center items-center">
                            <AnimationButton text="Submit" loading={isSubmitting} isDisabled={isSubmitting} />
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default UpdateToken;
