export const ConnectBtn = ({ onClick }) => (

    <button
        onClick={onClick}
        className="w-[120px] md:w-[150px] lg:w-[190px] h-[25px] lg:h-[32px] 
        dxl:h-[35px] text-[10px] md:text-[15px] dlg:text-[19px] font-[400] items-center justify-center  rounded-xl p-[1.5px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"
    >
        <div className="bg-gray-950 w-full h-full  rounded-xl flex items-center justify-center ">
            Connect Wallet
        </div>
    </button>
);

export const ConnectBtnMobile = ({ onClick }) => (
    <button
        onClick={onClick}
        className=" mt-[80px]   bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]
         text-black  relative w-[220px] h-[35px] p-[1.5px]
            text-[16px] md:text-[18px] font-[600] rounded-3xl flex items-center justify-center "
    >
        Connect Wallet
    </button>
);