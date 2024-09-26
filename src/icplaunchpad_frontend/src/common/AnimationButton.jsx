import React from 'react'

const AnimationButton = ({ text, onClick }) => {
    return (
        <>
            <button type='submit' onClick={onClick} className='border-1  font-posterama  bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] 
             text-black  relative w-[130px] md:w-[250px] h-[35px] md:h-[40px] 
                text-[16px] md:text-[18px] font-[600] rounded-3xl'>
                {text}
            </button>
        </>
    )
}

export default AnimationButton