import React, { useEffect, useState } from 'react';
import { TfiClose } from 'react-icons/tfi';
import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';
import { Principal } from '@dfinity/principal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { formatDateForDateTimeLocal } from '../../utils/formatDateFromBigInt';

const UpdatePoolDate = ({ ledgerId, PoolDateModalIsOpen, setRenderComponent, setPoolDateModalIsOpen }) => {
    const actor = useSelector((currState) => currState.actors.actor);
    const isAuthenticated = useSelector((currState) => currState.internet.isAuthenticated);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            start_time_utc: '',
            end_time_utc: ''
        },
    });

    const [validationError, setValidationError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [tokenData, setTokenData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const ledgerPrincipal =
        typeof ledgerId === 'string' ? Principal.fromText(ledgerId) : Principal.fromUint8Array(ledgerId);

    useEffect(() => {
        if (isAuthenticated && PoolDateModalIsOpen) {
            setIsVisible(true);
            getTokenData();
        }
    }, [isAuthenticated, PoolDateModalIsOpen]);

        useEffect(() => {
            if (tokenData) {    
                reset({
                    start_time_utc: formatDateForDateTimeLocal(tokenData.start_time_utc),
                    end_time_utc: formatDateForDateTimeLocal(tokenData.end_time_utc),

                });
            }
        }, [tokenData, reset]);

    const getTokenData = async () => {
        try {
            const data = await actor.get_sale_params(ledgerPrincipal);
            if (data.Ok) {
                setTokenData(data.Ok);
            }
        } catch (err) {
            console.error('Error fetching token data:', err);
        }
    };

    const validateTimes = (startTime, endTime) => {
        if (endTime <= startTime) {
            setValidationError('Start time should be less than end time.');
            setIsSubmitting(false);
            return false;
        }
        return true;
    };

    const onSubmit = async (formData) => {
        setIsSubmitting(true);
        setValidationError('');

        const { end_time_utc, start_time_utc, description, website, project_video } = formData;
        if (!tokenData)
            return 

        if (!termsAccepted) {
            setValidationError('Please accept the terms and conditions.');
            setIsSubmitting(false);
            return;
        }

        const startTime = Math.floor(new Date(start_time_utc).getTime() / 1000);
        const endTime = Math.floor(new Date(end_time_utc).getTime() / 1000);

        if (!validateTimes(startTime, endTime)) return;

        const updatedTokenData = {
            description: [tokenData?.description],
            website: [tokenData?.website],
            end_time_utc: [endTime],
            start_time_utc: [startTime],
            project_video:  [tokenData?.project_video],
            social_links: tokenData?.social_links.length > 0 ? [tokenData?.social_links] : [],
        };

        try {
            const response = await actor.update_sale_params(ledgerPrincipal, updatedTokenData);
            if (response?.Err) {
                setValidationError(response.Err);
            } else {
                setPoolDateModalIsOpen(false);
                setRenderComponent((prev) => !prev);
            }
        } catch (err) {
            setValidationError('An error occurred while updating the token.');
            console.error('Error updating token:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setIsVisible(false);
        setTimeout(() => setPoolDateModalIsOpen(false), 300); // Match duration with transition
    };

    return (
        <div className="absolute">
            <Modal
                isOpen={PoolDateModalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Update Token Modal"
                className="fixed inset-0 flex items-center justify-center bg-transparent"
                overlayClassName={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                ariaHideApp={false}
            >
                <div
                    className={`bg-[#222222] p-6 rounded-2xl text-white max-h-[90vh] overflow-y-auto no-scrollbar relative transform transition-all duration-300 ${
                        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                >
                    <div className="bg-[#FFFFFF4D] px-4 py-1 mb-4 rounded-2xl relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-0 mt-2 right-4 text-[25px] text-white"
                        >
                            <TfiClose />
                        </button>
                        <h2 className="text-[22px] font-semibold">Update Pool Schedule</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="my-5">
                            <div className="w-full xxs1:px-2 mb-4">
                                <label className="block text-[19px] mb-1">Start Time</label>
                                <input
                                    type="datetime-local"
                                    {...register('start_time_utc')}
                                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                />
                                {errors.start_time_utc && (
                                    <p className="text-red-500">{errors.start_time_utc.message}</p>
                                )}
                            </div>
                            <div className="w-full xxs1:px-2 mb-4">
                                <label className="block text-[19px] mb-1">End Time</label>
                                <input
                                    type="datetime-local"
                                    {...register('end_time_utc')}
                                    className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                />
                                {errors.end_time_utc && (
                                    <p className="text-red-500">{errors.end_time_utc.message}</p>
                                )}
                            </div>
                        </div>

                        {validationError && <p className="text-red-500 mb-4 xxs1:px-2">{validationError}</p>}

                        <div className="flex items-start xxs1:items-center mt-4 mb-6 xxs1:px-2">
                            <input
                                type="checkbox"
                                id="termsCheckbox"
                                checked={termsAccepted}
                                onChange={() => setTermsAccepted(!termsAccepted)}
                                className="hidden peer"
                            />
                            <div
                                className={`w-4 h-4 border-2 flex items-center mt-1 justify-center rounded-sm mr-2 cursor-pointer ${
                                    termsAccepted ? '' : 'border-white bg-transparent'
                                }`}
                            >
                                <label
                                    htmlFor="termsCheckbox"
                                    className="cursor-pointer w-full h-full flex items-center justify-center"
                                >
                                    {termsAccepted && <span className="text-[#F3B3A7]">✓</span>}
                                </label>
                            </div>
                            <p className="text-[15px] text-[#cccccc]">
                                By updating this token, I agree to the terms and conditions.
                            </p>
                        </div>

                        <div className="flex justify-center pt-2 items-center">
                          <AnimationButton text="Submit" loading={isSubmitting} isDisabled={isSubmitting} />
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default UpdatePoolDate;
