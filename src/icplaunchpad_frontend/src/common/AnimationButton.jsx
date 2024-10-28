// import React from 'react'

// const AnimationButton = ({ text, onClick }) => {
//     return (
//         <>
//             <button type='submit' onClick={onClick} className='border-1  font-posterama  bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]
//              text-black  relative w-[130px] md:w-[250px] h-[35px] md:h-[40px]
//                 text-[16px] md:text-[18px] font-[600] rounded-3xl'>
//                 {text}
//             </button>
//         </>
//     )
// }

// export default AnimationButton

import React from "react";
import { ThreeDots } from "react-loader-spinner";

const AnimationButton = ({
  text,
  onClick,
  isDisabled = false,
  loading = false,
}) => {
  return (
    <>
      <button
        type="submit"
        // onClick={onClick}
        className={`border-1 font-posterama bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]
                            text-black flex justify-center items-center w-[130px] md:w-[250px] h-[35px] md:h-[40px]
                            text-[16px] md:text-[18px] font-[600] rounded-3xl
                            ${
                              isDisabled || loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:opacity-80"
                            }`}
        disabled={isDisabled || loading}
      >
        {loading ? (
          <ThreeDots
            height="40"
            width="40"
            color="white"
            ariaLabel="loading-indicator"
          />
        ) : (
          text
        )}
      </button>
    </>
  );
};

export default AnimationButton;
