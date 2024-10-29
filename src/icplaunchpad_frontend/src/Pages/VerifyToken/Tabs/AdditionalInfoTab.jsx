
// import React, { useState, useRef } from "react";
// import { FaTrash } from "react-icons/fa";
// import getSocialLogo from "../../../common/getSocialLogo";

// const AdditionalInfoTab = ({ presaleDetails, setPresaleDetails }) => {
//   const [errors, setErrors] = useState({});
//   const [fileName, setFileName] = useState("");
//   const fileInputRef = useRef(null);

//   const handleFileUploadClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFileName(file.name);
//       setPresaleDetails((prevDetails) => ({
//         ...prevDetails,
//         logoURL: file,
//       }));
//     }
//   };

//   const handleInputChange = (e, field) => {
//     const value = e.target.value;
//     setPresaleDetails((prev) => ({ ...prev, [field]: value }));
//   };

//   const addLink = () => {
//     setPresaleDetails((prev) => ({
//       ...prev,
//       social_links: [...prev.social_links, { type: "", url: "" }],
//     }));
//   };

//   const removeLink = (index) => {
//     setPresaleDetails((prev) => ({
//       ...prev,
//       social_links: prev.social_links.filter((_, i) => i !== index),
//     }));
//   };

//   const updateLink = (index, field, value) => {
//     const updatedsocial_links = [...presaleDetails.social_links];
//     updatedsocial_links[index][field] = value;
//     setPresaleDetails((prev) => ({
//       ...prev,
//       social_links: updatedsocial_links,
//     }));
//   };

//   return (
//     <div className="bg-[#222222] p-3 rounded-2xl mx-3 mb-6">
//       {/* File Upload */}
//       <div className="flex flex-col justify-between mb-4">
//         <label className="block text-[19px] mb-1">Logo</label>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           style={{ display: "none" }}
//         />
//         <div
//           onClick={handleFileUploadClick}
//           className="cursor-pointer w-full flex items-center justify-start p-1.5 bg-[#333333] text-white rounded-md border-b-2"
//         >
//           <span className="text-xl font-bold mr-2">+</span>
//           <span>{fileName ? fileName : "Upload Image"}</span>
//         </div>
//       </div>
//       <div className="w-full  mb-4">
//         <label className="block text-[19px] mb-1">Website</label>
//         <input
//           type="text"
//           value={presaleDetails.website}
//           onChange={(e) => handleInputChange(e, "website")}
//           className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
//         />
//       </div>
//       {/* Social Links */}
//       <div className="mb-4">
//         <h2 className="block text-[19px] mb-1">Social Links</h2>
//         {presaleDetails.social_links.map((link, index) => (
//           <div key={index} className="flex gap-2 items-center mb-2">
//             {getSocialLogo(link.url)}

//             <input
//               type="url"
//               className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2 "
//               placeholder="Enter URL"
//               value={link.url}
//               onChange={(e) => updateLink(index, "url", e.target.value)}
//             />
//             <button
//               onClick={() => removeLink(index)}
//               className="ml-2 text-red-500"
//             >
//               <FaTrash />
//             </button>
//           </div>
//         ))}
//         <button onClick={addLink} className="text-blue-400 mt-2">
//           + Add another link
//         </button>
//       </div>

//       {/* Other Fields */}
//       <div className="flex flex-col mb-4">
//         <label className="block text-[19px] mb-1">Description</label>
//         <textarea
//           value={presaleDetails.description}
//           onChange={(e) =>
//             setPresaleDetails((prev) => ({
//               ...prev,
//               description: e.target.value,
//             }))
//           }
//           className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2 h-32"
//         ></textarea>
//       </div>
//     </div>
//   );
// };

// export default AdditionalInfoTab;



import React, { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import CompressedImage from '../../../common/ImageCompressed/CompressedImage';
import { getSocialLogo } from "../../../common/getSocialLogo";
const AdditionalInfoTab = ({
  register,
  errors,
  presaleDetails,
  setPresaleDetails,
}) => {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

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
  const addLink = () => {
    setPresaleDetails((prev) => ({
      ...prev,
      social_links: [...prev.social_links, { type: "", url: "" }],
    }));
  };

  const removeLink = (index) => {
    setPresaleDetails((prev) => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index),
    }));
  };

  const updateLink = (index, field, value) => {
    const updatedsocial_links = [...presaleDetails.social_links];
    updatedsocial_links[index][field] = value;
    setPresaleDetails((prev) => ({
      ...prev,
      social_links: updatedsocial_links,
    }));
  };

  return (
    <div className="bg-[#222222] p-3 rounded-2xl mx-3  mb-[80px] dxs:mb-[140px] xxs1:mb-[90px] sm2:mb-[70px]  md:mb-[10px] min-h-[550px]   ss2:h-[600px] md:min-h-[550px] ">
      {/* File Upload */}
      <div className="flex flex-col justify-between mb-4">
        <label className="block text-[19px] mb-1">Logo</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
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
          <div key={index} className="flex gap-2 items-center mb-2">
            {getSocialLogo(link.url)}

            <input
              type="url"
              className={`w-full p-2 bg-[#333333] text-white rounded-md${errors.link ? "border-red-500" : "border-white"
                }  border-b-2`}
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
      </div>

      {/* Description */}
      <div className="flex flex-col mb-4">
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
