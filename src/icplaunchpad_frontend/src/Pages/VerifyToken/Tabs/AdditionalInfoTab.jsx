import React, { useState, useRef } from 'react';

const AdditionalInfoTab = ({ presaleDetails, setPresaleDetails }) => {
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState(""); // State to store the file name
  const fileInputRef = useRef(null);

  const handleFileUploadClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Update state with file name
      setPresaleDetails((prevDetails) => ({
        ...prevDetails,
        logoURL: file, // Store file in presale details
      }));
    }
  };

  const handleInputChange = (e, platform) => {
    const value = e.target.value;
    setPresaleDetails((prev) => ({ ...prev, [platform]: value }));
  };

  return (
    <div className="bg-[#222222] p-3 xxs1:p-8 rounded-2xl lg:h-[1050px] mx-3 xxs1:mx-8 mb-[120px] xxs1:mb-11 sm5:mb-6 md:mb-4 lg:mb-0 h-[1350px] xxs1:h-[1000px]">
      
      {/* Chain Text with Gray Background on mobile only */}
      <div className="flex xxs1:hidden mb-8 bg-[#444444] pl-6 p-2 mt-[-15px] mx-[-12px] rounded-2xl">
        <span className="text-white text-[22px]">Chain</span>
      </div>

      {/* Logo URL (with custom upload button) and Website */}
      <div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className="w-full ss2:xxs1:w-1/2 xxs1:pr-2 mb-6">
          <label className="block text-[19px] mb-1">Logo</label>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Custom Upload Button */}
          <div
            onClick={handleFileUploadClick}
            className="cursor-pointer w-full flex items-center justify-start p-1.5  bg-[#333333] text-white rounded-md border-b-2"
          >
            {/* Conditionally render the file name or the default "Upload Image" text */}
            <span className="text-xl font-bold mr-2">+</span>
            <span>{fileName ? fileName : "Upload Image"}</span>
          </div>
        </div>
        
        <div className="w-full xxs1:w-1/2 xxs1:pl-2 mb-4">
          <label className="block text-[19px] mb-1">Website</label>
          <input
            type="text"
            value={presaleDetails.website}
            onChange={(e) => handleInputChange(e, 'website')}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      {/* Social Media Links (Facebook, Twitter) */}
      <div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-6">
          <label className="block text-[19px] mb-1">Facebook</label>
          <input
            type="text"
            value={presaleDetails.facebook}
            onChange={(e) => handleInputChange(e, 'facebook')}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
          {errors.facebook && <p className="text-red-500">{errors.facebook}</p>}
        </div>
        <div className="w-full xxs1:w-1/2 xxs1:pl-2 mb-4">
          <label className="block text-[19px] mb-1">Twitter</label>
          <input
            type="text"
            value={presaleDetails.twitter}
            onChange={(e) => handleInputChange(e, 'twitter')}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
          {errors.twitter && <p className="text-red-500">{errors.twitter}</p>}
        </div>
      </div>

      {/* Social Media Links (GitHub, Telegram) */}
      <div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-4">
          <label className="block text-[19px] mb-1">GitHub</label>
          <input
            type="text"
            value={presaleDetails.github}
            onChange={(e) => handleInputChange(e, 'github')}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
          {errors.github && <p className="text-red-500">{errors.github}</p>}
        </div>
        <div className="w-full xxs1:w-1/2 xxs1:pl-2">
          <label className="block text-[19px] mb-1">Telegram</label>
          <input
            type="text"
            value={presaleDetails.telegram}
            onChange={(e) => handleInputChange(e, 'telegram')}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
          {errors.telegram && <p className="text-red-500">{errors.telegram}</p>}
        </div>
      </div>

      {/* Social Media Links (Instagram, Discord) */}
      <div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-4">
          <label className="block text-[19px] mb-1">Instagram</label>
          <input
            type="text"
            value={presaleDetails.instagram}
            onChange={(e) => handleInputChange(e, 'instagram')}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
          {errors.instagram && <p className="text-red-500">{errors.instagram}</p>}
        </div>
        <div className="w-full xxs1:w-1/2 xxs1:pl-2">
          <label className="block text-[19px] mb-1">Discord</label>
          <input
            type="text"
            value={presaleDetails.discord}
            onChange={(e) => handleInputChange(e, 'discord')}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
          {errors.discord && <p className="text-red-500">{errors.discord}</p>}
        </div>
      </div>

      {/* Reddit Link */}
      <div className="mb-4">
        <label className="block text-[19px] mb-1">Reddit</label>
        <input
          type="text"
          value={presaleDetails.reddit}
          onChange={(e) => handleInputChange(e, 'reddit')}
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
        />
        {errors.reddit && <p className="text-red-500">{errors.reddit}</p>}
      </div>

      {/* YouTube Video Link */}
      <div className="mb-4">
        <label className="block text-[19px] mb-1">YouTube Video</label>
        <input
          type="text"
          value={presaleDetails.youtubeVideo}
          onChange={(e) => handleInputChange(e, 'youtubeVideo')}
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
        />
        {errors.youtube && <p className="text-red-500">{errors.youtube}</p>}
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-[19px] mb-1">Description</label>
        <textarea
          value={presaleDetails.description}
          onChange={(e) =>
            setPresaleDetails((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2 h-32"
        ></textarea>
      </div>
    </div>
  );
};

export default AdditionalInfoTab;