import React, { useEffect, useState } from 'react';
import { TfiClose } from 'react-icons/tfi';
import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';
import { useAuth } from '../../StateManagement/useContext/useAuth';
import { Principal } from '@dfinity/principal';
import { getSocialLogo } from '../../common/getSocialLogo';
import { useForm, Controller } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { formatDateForDateTimeLocal } from '../../utils/formatDateFromBigInt';
// import { formatDateFromBigInt } from '../../utils/formatDateFromBigInt';
const UpdateToken = ({ ledgerId, tokenModalIsOpen, setTokenModalIsOpen }) => {
    const { actor, isAuthenticated } = useAuth();
    const { register, handleSubmit, formState: { errors }, reset, control, setValue, clearErrors, setError } = useForm();
    const [validationError, setValidationError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [tokenData, setTokenData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ledgerPrincipal = Principal.fromText(ledgerId);
    const [links, setLinks] = useState([{ url: '' }]);
    console.log("Start time and end time :", tokenData);
    useEffect(() => {
        if (isAuthenticated && tokenModalIsOpen) {
            getTokenData();
        }
    }, [isAuthenticated, tokenModalIsOpen]);
   
    // useEffect(() => {
    //     if (tokenData) {
    //         const socialLinks = tokenData.social_links?.map((link) => ({ url: link })) || [{ url: '' }];
    //         setLinks(socialLinks);
    //         console.log("Updated social links:", socialLinks);
    //         const startTime = formatDateForDateTimeLocal(tokenData.start_time_utc);
    //         const endTime = formatDateForDateTimeLocal(tokenData.end_time_utc);
          
    //         setValue("description", tokenData.description || '');
    //         setValue("website", tokenData.website || '');
    //         setValue("start_time_utc", startTime);
    //         setValue("end_time_utc", endTime);

    //     }
    // }, [tokenData, reset]);
    useEffect(() => {
        if (tokenData) {
            const socialLinks = tokenData.social_links?.map((link) => ({ url: link })) || [{ url: '' }];
            setLinks(socialLinks);

            reset({  
                description: tokenData.description || '',
                website: tokenData.website || '',
                start_time_utc: formatDateForDateTimeLocal(tokenData.start_time_utc),
                end_time_utc: formatDateForDateTimeLocal(tokenData.end_time_utc),
                links: socialLinks.map(link => link.url)
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
        console.log("submit start,",data)
        setIsSubmitting(true);
        setValidationError('');
       
        const {
            description,
            website,
            end_time_utc,
            start_time_utc,
        } = data;

        if (!termsAccepted) {
            setValidationError('Please accept the terms and conditions.');
            setIsSubmitting(false);
            return;
        }

        const startTime = Math.floor(new Date(start_time_utc).getTime() / 1000);
        const endTime = Math.floor(new Date(end_time_utc).getTime() / 1000);
        console.log("start time submit ,",startTime)
        console.log("end time submit ,", endTime)
        if (!validateTimes(startTime, endTime)) return;


        const socialLinksURLs = links.map(link => link.url);

        const updatedTokenData = {
            description: description ? [description] : [],
            website: website ? [website] : null,
            end_time_utc: endTime ? [endTime] : [],
            start_time_utc: startTime ? [startTime] : [],

            social_links: socialLinksURLs.length > 0 ? [socialLinksURLs] : [],
        };
        console.log("update token data ,", updatedTokenData)
        try {
            const response = await actor.update_sale_params(ledgerPrincipal, updatedTokenData);
            console.log('Token updated:', response);
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
                        {/* Social Links */}
                        <div className="mb-4">
                            <h2 className="block text-[19px] mb-1">Social Links</h2>
                            {links.map((item, index) => (
                                <div key={index} className="flex flex-col">
                                    <div className="flex items-center mb-2 pb-1">
                                        <div className="flex items-center w-full space-x-2">
                                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                                {getSocialLogo(links[index].url)}
                                            </div>
                                           
                                            <Controller
                                                name={`links.${index}`}
                                                control={control}
                                                defaultValue={links[index]?.url || ''}  
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your social media URL"
                                                        className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            updateLink(index, e.target.value); 
                                                        }}
                                                    />
                                                )}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeLink(index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}



                            <button onClick={addLink} type="button" className="text-blue-400 mt-2">
                                + Add another link
                            </button>
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
