import React from 'react';
import p1 from '../../assets/images/projectsIcon/p1.png';
import p2 from '../../assets/images/projectsIcon/p2.png';
import p3 from '../../assets/images/projectsIcon/p3.png';
import p4 from '../../assets/images/projectsIcon/p4.png';
import p5 from '../../assets/images/projectsIcon/p5.png';
import p6 from '../../assets/images/projectsIcon/p6.png';
import p7 from '../../assets/images/projectsIcon/p7.png';
import p8 from '../../assets/images/projectsIcon/p8.png';
import p9 from '../../assets/images/projectsIcon/p9.png';
import p10 from '../../assets/images/projectsIcon/p10.png';
import p11 from '../../assets/images/projectsIcon/p11.png';
import p12 from '../../assets/images/projectsIcon/p12.png';

const FundList = () => {
  return (
    <div className="px-[8%] py-[3%] bg-black">
      <h2 className="text-2xl font-bold text-white mb-4">SUCCESSFUL PROJECTS RAISE FUNDING</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black border-b border-gray-700">
          <thead>
            <tr className="bg-[#1919194D] text-white  uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Projects</th>
              <th className="py-3 px-6 text-left">Total Raised</th>
              <th className="py-3 px-6 text-left">Current Price</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Ended In</th>
            </tr>
          </thead>
          <tbody className="text-white text-sm divide-y  divide-gray-700">
           
            <tr className='text-base'>
              <td className="py-3 px-6">1</td>
              <td className=" flex items-center py-3 px-6"><img src={p1} alt="infinite" className=" pr-2 " />Name</td>
              <td className="py-3 px-6">$400,000</td>
              <td className="py-3 px-6">$1.5892</td>
              <td className="py-3 px-6">Token Sale</td>
              <td className="py-3 px-6">June 29th 2089</td>
            </tr>
            
            <tr className='text-base'>
              <td className="py-3 px-6">2</td>
              <td className=" flex items-center py-3 px-6"><img src={p2} alt="infinite" className=" pr-2 " />Name</td>
              <td className="py-3 px-6">$400,000</td>
              <td className="py-3 px-6">$1.5892</td>
              <td className="py-3 px-6">Token Sale</td>
              <td className="py-3 px-6">June 29th 2089</td>
            </tr>

            <tr className='text-base'>
              <td className="py-3 px-6">3</td>
              <td className=" flex items-center py-3 px-6"><img src={p3} alt="infinite" className=" pr-2 " />Name</td>
              <td className="py-3 px-6">$400,000</td>
              <td className="py-3 px-6">$1.5892</td>
              <td className="py-3 px-6">Token Sale</td>
              <td className="py-3 px-6">June 29th 2089</td>
            </tr>

            <tr className='text-base'>
              <td className="py-3 px-6">4</td>
              <td className=" flex items-center py-3 px-6"><img src={p4} alt="infinite" className=" pr-2 " />Name</td>
              <td className="py-3 px-6">$400,000</td>
              <td className="py-3 px-6">$1.5892</td>
              <td className="py-3 px-6">Token Sale</td>
              <td className="py-3 px-6">June 29th 2089</td>
            </tr>
              
            <tr className='text-base'>
              <td className="py-3 px-6">5</td>
              <td className=" flex items-center py-3 px-6"><img src={p5} alt="infinite" className=" pr-2 " />Name</td>
              <td className="py-3 px-6">$400,000</td>
              <td className="py-3 px-6">$1.5892</td>
              <td className="py-3 px-6">Token Sale</td>
              <td className="py-3 px-6">June 29th 2089</td>
            </tr>

            <tr className='text-base'>
              <td className="py-3 px-6">6</td>
              <td className=" flex items-center py-3 px-6"><img src={p6} alt="infinite" className=" pr-2 " />Name</td>
              <td className="py-3 px-6">$400,000</td>
              <td className="py-3 px-6">$1.5892</td>
              <td className="py-3 px-6">Token Sale</td>
              <td className="py-3 px-6">June 29th 2089</td>
            </tr>

            <tr className='text-base'>
              <td className="py-3 px-6">7</td>
              <td className=" flex items-center py-3 px-6"><img src={p7} alt="infinite" className=" pr-2 " />Name</td>
              <td className="py-3 px-6">$400,000</td>
              <td className="py-3 px-6">$1.5892</td>
              <td className="py-3 px-6">Token Sale</td>
              <td className="py-3 px-6">June 29th 2089</td>
            </tr>

            <tr className='text-base'>
              <td className="py-3 px-6">8</td>
              <td className=" flex items-center py-3 px-6"><img src={p8} alt="infinite" className=" pr-2 " />Name</td>
              <td className="py-3 px-6">$400,000</td>
              <td className="py-3 px-6">$1.5892</td>
              <td className="py-3 px-6">Token Sale</td>
              <td className="py-3 px-6">June 29th 2089</td>
            </tr>

            <tr className='text-base'>
              <td className="py-3 px-6">9</td>
              <td className=" flex items-center py-3 px-6"><img src={p9} alt="infinite" className=" pr-2 " />Name</td>
              <td className="py-3 px-6">$400,000</td>
              <td className="py-3 px-6">$1.5892</td>
              <td className="py-3 px-6">Token Sale</td>
              <td className="py-3 px-6">June 29th 2089</td>
            </tr>

            <tr className='text-base'>
              <td className="py-3 px-6">10</td>
              <td className=" flex items-center py-3 px-6"><img src={p10} alt="infinite" className=" pr-2 " />Name</td>
              <td className="py-3 px-6">$400,000</td>
              <td className="py-3 px-6">$1.5892</td>
              <td className="py-3 px-6">Token Sale</td>
              <td className="py-3 px-6">June 29th 2089</td>
            </tr>

            <tr className='text-base'>
              <td className="py-3 px-6">11</td>
              <td className=" flex items-center py-3 px-6"><img src={p11} alt="infinite" className=" pr-2 " />Name</td>
              <td className="py-3 px-6">$400,000</td>
              <td className="py-3 px-6">$1.5892</td>
              <td className="py-3 px-6">Token Sale</td>
              <td className="py-3 px-6">June 29th 2089</td>
            </tr>

            <tr className='text-base '>
              <td className="py-3 px-6">12</td>
              <td className=" flex items-center py-3 px-6"><img src={p12} alt="infinite" className=" pr-2 " />Name</td>
              <td className="py-3 px-6">$400,000</td>
              <td className="py-3 px-6">$1.5892</td>
              <td className="py-3 px-6">Token Sale</td>
              <td className="py-3 px-6">June 29th 2089</td>
            </tr>
        
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FundList;
