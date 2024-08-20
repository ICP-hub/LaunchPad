import React from 'react'
import './AnimationButton.css'
const AnimationButton = ({ text, onClick }) => {
    return (
        <>
            <button type='submit' onClick={onClick} className='border-1   bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] 
             text-black  relative w-[120px] lg:w-[250px] h-[25px] lg:h-[35px]
                text-[10px] md:text-[18px] font-[600] rounded-3xl '>
                {text}
            </button>
        </>
    )
}

export default AnimationButton