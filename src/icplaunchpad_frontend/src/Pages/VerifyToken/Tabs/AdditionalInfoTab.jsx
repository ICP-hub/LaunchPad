
import React, { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import CompressedImage from '../../../common/ImageCompressed/CompressedImage';
import { getSocialLogo } from "../../../common/getSocialLogo";
import { Controller } from "react-hook-form";
const AdditionalInfoTab = ({
  register,
  unregister,
  control,
  errors,
  presaleDetails,
  setPresaleDetails,
}) => {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const [coverFileName, setCoverFileName] = useState(""); // New state for cover image file name
  const coverFileInputRef = useRef(null); // New ref for cover image input
  // const handleFileUploadClick = () => {
  //   fileInputRef.current.click();
  // };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFileName(file.name);
  //     setPresaleDetails((prevDetails) => ({
  //       ...prevDetails,
  //       logoURL: file,
  //     }));
  //   }
  // };
  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };


  const handleCoverFileUploadClick = () => {
    coverFileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);

      //  original file size
      const originalFileSize = file.size / 1024; 
      console.log("Original File Size:", originalFileSize, "KB");

      try {
        // Compress the image
        const compressedFile = await CompressedImage(file);

        // compressed file size
        const compressedFileSize = compressedFile.size / 1024; 
        console.log("Compressed File Size:", compressedFileSize, "KB");

      
        if (compressedFileSize < originalFileSize) {
          console.log("Image has been successfully compressed!");
        } else {
          console.log("Compression failed or the file size was not significantly reduced.");
        }

       
        setPresaleDetails((prevDetails) => ({
          ...prevDetails,
          logoURL: compressedFile, 
        }));
      } catch (error) {
        console.error('Image compression failed:', error);
      }
    }
  };

  const handleCoverFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFileName(file.name);
      const originalFileSize = file.size / 1024;
      console.log("Original Cover File Size:", originalFileSize, "KB");

      try {
        const compressedFile = await CompressedImage(file);
        const compressedFileSize = compressedFile.size / 1024;
        console.log("Compressed Cover File Size:", compressedFileSize, "KB");

        setPresaleDetails((prevDetails) => ({
          ...prevDetails,
          coverImageURL: compressedFile,
        }));
      } catch (error) {
        console.error('Cover image compression failed:', error);
      }
    }
  };

  
// Add a new link
const addLink = () => {
  setPresaleDetails((prev) => ({
    ...prev,
    social_links: [
      ...(prev.social_links || []), // Ensure social_links is always defined
      { type: "", url: "" }, // Default new link structure
    ],
  }));
};

// Remove a link at the specified index
const removeLink = (index) => {
  // Unregister the field from react-hook-form
  unregister(`social_links.${index}`);

  // Remove the link from presaleDetails
  setPresaleDetails((prev) => {
    const updatedLinks = prev.social_links.filter((_, i) => i !== index);
    return {
      ...prev,
      social_links: updatedLinks,
    };
  });

  // Re-index remaining fields in react-hook-form to maintain proper state
  setPresaleDetails((prev) => {
    const updatedLinks = prev.social_links.filter((_, i) => i !== index);
    updatedLinks.forEach((link, i) => {
      // Update the key for each remaining item
      register(`social_links.${i}`, { value: link.url || "" });
    });
    return {
      ...prev,
      social_links: updatedLinks,
    };
  });
};


// Update a specific field of a link at the specified index
const updateLink = (index, value) => {
  setPresaleDetails((prev) => {
    const updatedLinks = prev.social_links.map((link, i) =>
      i === index ? { ...link, url: value } : link // Update only the specific link
    );
    return {
      ...prev,
      social_links: updatedLinks,
    };
  });
};


  return (
    <div className="bg-[#222222] p-4 xxs1:p-8 m-4 rounded-2xl mb-[80px] dxs:mb-[140px] xxs1:mb-[90px] sm2:mb-[70px]  md:mb-[15px]   ">
           <div className="flex  mb-8 bg-[#444444] pl-6 p-2 mt-[-31px] mx-[-17px] xxs1:mx-[-31px]  rounded-2xl">
        <span className="text-white text-[22px]"> Additional Information </span>
      </div>
      {/* File Upload */}
      <div className="flex flex-col justify-between mb-4">
        <label className="block text-[19px] mb-1">Logo</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept="image/*" // Allow only image files
        />
        <div
          onClick={handleFileUploadClick}
          className={`cursor-pointer w-full flex items-center justify-start p-1.5 bg-[#333333] text-white rounded-md ${errors.logoURL ? "border-red-500" : "border-white"
            }  border-b-2`}
        >
          <span className="text-xl font-bold mr-2">+</span>
          <span>{fileName ? fileName : "Upload Image"}</span>
        </div>
        {errors.logoURL && <p className="text-red-500 mt-1">{errors.logoURL.message}</p>}
      </div>

      {/* Cover Image File Upload */}
      <div className="flex flex-col justify-between mb-4">
        <label className="block text-[19px] mb-1">Cover Image</label>
        <input
          type="file"
          ref={coverFileInputRef}
          onChange={handleCoverFileChange}
          style={{ display: "none" }}
          accept="image/*" // Allow only image files
        />
        <div
          onClick={handleCoverFileUploadClick}
          className={`cursor-pointer w-full flex items-center justify-start p-1.5 bg-[#333333] text-white rounded-md ${errors.coverImageURL ? "border-red-500" : "border-white"
            }  border-b-2`}
        >
          <span className="text-xl font-bold mr-2">+</span>
          <span>{coverFileName ? coverFileName : "Upload Image"}</span>
        </div>
        {errors.coverImageURL && <p className="text-red-500 mt-1">{errors.coverImageURL.message}</p>}
      </div>
      

      <div className="w-full mb-4">
        <label className="block text-[19px] mb-1">Website</label>
        <input
          type="text"
          {...register("website")}
          className={`w-full p-2 bg-[#333333] text-white rounded-md ${errors.website ? "border-red-500" : "border-white"
            }  border-b-2`}
        />
        {errors.website && (
          <p className="text-red-500">{errors.website.message}</p>
        )}
      </div>

      <div className="w-full mb-4">
        <label className="block text-[19px] mb-1">Video URL</label>
        <input
          type="text"
          {...register("project_video")}
          className={`w-full p-2 bg-[#333333] text-white rounded-md ${errors.project_video ? "border-red-500" : "border-white"
            }  border-b-2`}
        />
        {errors.project_video && (
          <p className="text-red-500">{errors.project_video.message}</p>
        )}
      </div>
      

{/* Social Links */}
<div className="mb-4">
  <h2 className="block text-[19px] mb-1">Social Links</h2>
  {presaleDetails.social_links.map((link, index) => (
    <div key={index} className="flex flex-col">
      <div className="flex items-center mb-2 pb-1">
        <Controller
          name={`social_links.${index}`} // Reference each social link URL
          control={control} // react-hook-form control object
          defaultValue={link.url || ''} // Fallback to empty string if no value
          render={({ field }) => (
            <div className="flex items-center w-full">
              <div className="flex items-center space-x-2 w-full">
                {/* Social Media Icon */}
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                  {field.value && getSocialLogo(field.value)} {/* Show the social logo */}
                </div>
                {/* URL Input */}
                <input
                  type="url"
                  placeholder="Enter your social media URL"
                  className={`w-full p-2 bg-[#333333] text-white rounded-md border-b-2 ${errors.social_links?.[index]?.url ? "border-red-500" : "border-white"}`}
                  {...field} // Spread field properties
                  onChange={(e) => {
                    field.onChange(e); // Update react-hook-form state
                    updateLink(index, e.target.value); // Update in `presaleDetails`
                  }}
                />
              </div>
            </div>
          )}
        />
        {/* Remove Link Button */}
        <button
          type="button"
          onClick={() => removeLink(index)}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
      </div>
      {/* Display Field-Specific Errors */}
      {console.log('err',errors)}
      {errors.social_links?.[index] && (
        <p className="text-red-500">{errors.social_links[index].message}</p>
      )}
    </div>
  ))}
  {/* Add Another Link Button */}
  <button
    onClick={addLink}
    className="text-[#F3B3A7] mt-2"
    disabled={presaleDetails.social_links.length >= 5} // Limit to 5 links
  >
    + Add another link
  </button>
  {/* Limit Message */}
  {presaleDetails.social_links.length >= 5 && (
    <p className="text-gray-500 text-sm mt-1">You can add up to 5 links only.</p>
  )}
</div>



      {/* Description */}
      <div className="flex flex-col mb-24">
        <label className="block text-[19px] mb-1">Description</label>
        <textarea
          {...register("description")}
          className={`w-full p-2 bg-[#333333] text-white rounded-md h-32 ${errors.description ? "border-red-500" : "border-white"
            }  border-b-2`}
        ></textarea>
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
};

export default AdditionalInfoTab;
