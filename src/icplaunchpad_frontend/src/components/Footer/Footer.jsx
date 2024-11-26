import React from 'react';
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { PiTelegramLogo } from "react-icons/pi";
import { AiOutlineFacebook } from "react-icons/ai";
import infinity from "../../../assets/images/infinity.png";
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div>
      <div className='bg-[#222222] mt-[5%] text-[13px] font-kumbhSans xxs1:text-[15px] py-4 px-[7%] lg:px-[9%]'>
        <p>The information provided on this platform is designed to support your journey and empower your projects. We are committed to offering a transparent and reliable environment, but we encourage users to conduct their own research and explore all opportunities. Your success is our priority, and we’re here to help every step of the way!.</p>
      </div>
     <div className='px-[9%]   bg-black pt-[4%] pb-6 flex flex-col md:flex-row  justify-between '>
      <div className='my-auto pr-11   bg-black pb-6 w-[85%] md:w-[20%] '>
      <img draggable="false" className='w-[130px] pb-4' src={infinity} alt='ICP' />
          <p className=' font-[400]  text-[13px] xxs1:text-[15px] dxl:text-[18px] text-white  '>Launchpad enables anyone to easily create their own tokens and launch token sales in just a few seconds.</p>
      </div> 
      <div className='flex flex-col  md:flex-row lg:flex-col lg:pr-[-5%]  lgx:pr-[6%] dxl:pr-[7%] gap-8  bg-black'>
        <div className=' flex flex-col md:flex-col lg:flex-row gap-[7px] md:gap-[20px] lg:gap-[60px]'>
          <div>
        <p className=' font-[400] text-[17px] xxs1:text-[20px] text-white'>USEFUL LINKS</p>
        </div>
        <div className='flex md:flex-col lg:flex-row  flex-wrap text-[#96839B] gap-[10px] ss2:gap-[20px]  xxs1:gap-[40px]  sm:gap-[90px] md:gap-[10px] lg:gap-[60px]'>
              <Link to="/" >Home</Link>
              <Link to="/projects" >Projects</Link>
              <Link to="/LaunchCoin" >Launch a Coin</Link>
              <Link to="/profile" >Profile</Link>
            </div>
        </div>
        <div className=' flex flex-col ss2:flex-row md:flex-col lg:flex-row gap-[11px] ss2:gap-[15px] md:gap-[20px] lg:gap-[85px]'>
        <p className=' font-[400] text-[14px] ss2:text-[17px] xxs1:text-[20px] text-white'>FOLLOW US</p>
        <div className='flex md:flex-col lg:flex-row gap-[15px] md:gap-[20px] lg:gap-[85px]'>
        <Link to="" target="__blank" className='text-[#96839B]' ><FaInstagram size={33} /></Link>
        <Link to="" target="__blank" className='text-[#96839B]'><FaXTwitter size={33} /></Link>
        <Link to="" target="__blank" className='text-[#96839B]' ><PiTelegramLogo size={33} /></Link>
        <Link to="" target="__blank" className='text-[#96839B]'>< AiOutlineFacebook size={33} /></Link>
        </div>
        </div>
        {/* <div className=' flex flex-col ss2:flex-row md:flex-col lg:flex-row gap-[10px] ss2:gap-[15px] md:gap-[20px] lg:gap-[95px]'>
        <p className=' font-[400]  text-[14px] ss2:text-[17px] xxs1:text-[20px] text-white'>INTERFACE</p>
        <div className='flex md:flex-col lg:flex-row gap-[10px] ss2:gap-[15px] md:gap-[20px] lg:gap-[85px]'>
        
  <div className='flex items-center gap-1 ss2:gap-2'>
    <IoSunnyOutline size={24} className='text-[#96839B]' />
    <p className='text-[#96839B] font-medium'>Light</p>
  </div>

 
  <div className='flex items-center gap-1 ss2:gap-2'>
    <IoMoonOutline size={24} className='text-[#96839B]' />
    <p className='text-[#96839B] font-medium'>Dark</p>
  </div>
  </div> 
        </div> */}
      </div>
     </div>
    </div>
  )
}

export default Footer;