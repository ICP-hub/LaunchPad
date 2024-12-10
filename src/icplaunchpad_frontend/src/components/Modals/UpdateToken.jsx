import React, { useEffect, useState } from 'react';
import { TfiClose } from 'react-icons/tfi';
import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';
import { Principal } from '@dfinity/principal';
import { getSocialLogo } from '../../common/getSocialLogo';
import { useForm, Controller } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { formatDateForDateTimeLocal } from '../../utils/formatDateFromBigInt';
import { useSelector } from 'react-redux';
import { UpdateTokenValidationSchema } from '../../common/UpdateTokenValidation';
import { yupResolver } from '@hookform/resolvers/yup';

const UpdateToken = ({ ledgerId, tokenModalIsOpen, setRenderComponent, setTokenModalIsOpen }) => {
    const actor = useSelector((currState) => currState.actors.actor);
    const isAuthenticated = useSelector((currState) => currState.internet.isAuthenticated);
   console.log('ledgerId==',ledgerId)
    const {
        register,
        unregister,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue,
        clearErrors,
    } = useForm({
        resolver: yupResolver(UpdateTokenValidationSchema),
        defaultValues: {
            description: '',
            website: '',
            project_video: '',
            start_time_utc: '',
            end_time_utc: '',
            links: [],
        },
    });

    const [validationError, setValidationError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [tokenData, setTokenData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ledgerPrincipal = typeof(ledgerId) == 'string' ? Principal.fromText(ledgerId) : Principal.fromUint8Array(ledgerId) ;
    const [links, setLinks] = useState([{ url: '' }]);

    useEffect(() => {
        if (isAuthenticated && tokenModalIsOpen) {
            getTokenData();
        }
    }, [isAuthenticated, tokenModalIsOpen]);

    useEffect(() => {
        if (tokenData) {
            const socialLinks = tokenData.social_links?.map((link) => ({ url: link })) || [{ url: '' }];
            setLinks(socialLinks);

            reset({
                description: tokenData.description || '',
                website: tokenData.website || '',
                project_video: tokenData.project_video || '',
                start_time_utc: formatDateForDateTimeLocal(tokenData.start_time_utc),
                end_time_utc: formatDateForDateTimeLocal(tokenData.end_time_utc),
                links: socialLinks.map((link) => link.url),
            });
        }
    }, [tokenData, reset]);

    const getTokenData = async () => {
        try {
            const data = await actor.get_sale_params(ledgerPrincipal);
            setTokenData(data.Ok);
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

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setValidationError('');

        const { description, website, end_time_utc, start_time_utc, project_video, links } = data;

        if (!termsAccepted) {
            setValidationError('Please accept the terms and conditions.');
            setIsSubmitting(false);
            return;
        }

        const startTime = Math.floor(new Date(start_time_utc).getTime() / 1000);
        const endTime = Math.floor(new Date(end_time_utc).getTime() / 1000);

        if (!validateTimes(startTime, endTime)) return;

        const updatedTokenData = {
            description: description ? [description] : [],
            website: website ? [website] : null,
            end_time_utc: [endTime],
            start_time_utc: [startTime],
            project_video: project_video ? [project_video] : null,
            social_links: links.filter((link) => link).length > 0 ? [links] : [],
        };

        try {
            const response = await actor.update_sale_params(ledgerPrincipal, updatedTokenData);
            if (response?.Err) {
                setValidationError(response.Err);
            } else {
                setTokenModalIsOpen(false);
                reset();
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
        setTokenModalIsOpen(false);
    };

const addLink = () => {
    if (links.length < 5) { // Ensure you don't exceed the max limit
        setLinks((prev) => [...prev, { url: '' }]); // Add a new blank link
    }
};

const removeLink = (index) => {
    setLinks((prev) => prev.filter((_, i) => i !== index)); // Remove the selected link
    unregister(`links.${index}`); // Unregister the specific field
    setValue(
        'links',
        links.filter((_, i) => i !== index).map((item) => item.url) // Update the `links` array in form
    );
};

const updateLink = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index].url = value;
    setLinks(updatedLinks); // Update the state
    setValue(`links.${index}`, value); // Update the form state
};


    return (
        <div className="absolute">
            <Modal
                isOpen={tokenModalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Update Token Modal"
                className="fixed inset-0 flex items-center justify-center bg-transparent"
                overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50"
                ariaHideApp={false}
            >
                <div className="bg-[#222222]  p-6 rounded-2xl text-white max-h-[90vh] overflow-y-auto no-scrollbar w-[786px] relative">
                    <div className="bg-[#FFFFFF4D] px-4 py-1 mb-4 rounded-2xl relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-0 mt-2 right-4 text-[30px] text-white"
                        >
                            <TfiClose />
                        </button>
                        <h2 className="text-[25px] font-semibold">Update Sale details</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col xxs1:flex-row justify-between mb-[50px] xxs1:mb-8">
                            <div className="w-full xxs1:w-1/2 xxs1:px-2 mb-4">
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
                            <div className="w-full xxs1:w-1/2 xxs1:px-2 mb-4">
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

                        <div className="mb-6">
                            <label className="block text-[19px] mb-1">Website</label>
                            <input
                                {...register('website')}
                                className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                            />
                            {errors.website && <p className="text-red-500">{errors.website.message}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-[19px] mb-1">Video URL</label>
                            <input
                                {...register('project_video')}
                                className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                            />
                            {errors.project_video && (
                                <p className="text-red-500">{errors.project_video.message}</p>
                            )}
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

                        <div className="mb-6">
                            <label className="block text-[19px] mb-1">Description</label>
                            <textarea
                                {...register('description')}
                                className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2 h-32"
                            />
                            {errors.description && (
                                <p className="text-red-500">{errors.description.message}</p>
                            )}
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
