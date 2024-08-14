import React from 'react'
import './AnimationButton.css'
const AnimationButton = ({ text, onClick }) => {
    return (
        <>
            <button type='submit' onClick={onClick} className='border z-20 text-white relative w-[120px] lg:w-[190px] h-[25px] lg:h-[35px]    text-[10px] md:text-[18px] font-[400] rounded-xl border-[#EE3EC9]'>
                {text}
                

                <div >
                    <div className="flip-card-front absolute w-full h-full"></div>
                    <div className="flip-card-back bg-[#EE3EC9] opacity-30 absolute w-full h-full"></div>
                </div>

            </button>
        </>
    )
}

export default AnimationButton