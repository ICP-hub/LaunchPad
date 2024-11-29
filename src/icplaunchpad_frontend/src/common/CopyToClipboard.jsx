import { Principal } from '@dfinity/principal';
import React, { useRef, useState } from 'react'
import { FaRegCopy } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";

const CopyToClipboard = ({address, width}) => {
    const [copySuccess, setCopySuccess] = useState(false);
    const inputRef = useRef(null);

    const copyToClipboard = () => {
        if (inputRef.current) {
            navigator.clipboard
                .writeText(inputRef.current.value)
                .then(() => {
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 1000);
                })
                .catch((err) => console.error("Failed to copy!", err));
        }
    };
    return (
        <>
            <span className="relative w-full">
            <input
    ref={inputRef}
    type="text"
    className={" py-2 pl-4 pr-10 mb-2 bg-[#333333] outline-none relative rounded-md"}
    style={{ width: width || '100%' }}
    value={
        typeof address === 'string'
            ? address
            : address
            ? Principal.fromUint8Array(address).toText()
            : ''
    }
    readOnly
    onClick={copyToClipboard}
/>

               { !copySuccess ? <button
                    onClick={copyToClipboard}
                    className="absolute right-4 top-[40%] lg:top-[50%] transform -translate-y-1/2 text-white text-[15px]"
                    aria-label="Copy to clipboard"
                >
                    <FaRegCopy />
                </button>
                :
                <span className="absolute right-4 top-[40%] lg:top-[50%] transform -translate-y-1/2 text-white text-[15px]">
               <FaRegCheckCircle/>
                </span>
               }
            </span>
           
        </>
    )
}

export default CopyToClipboard