import React from 'react';
import Link from 'next/link';
import { FiArrowUpRight } from "react-icons/fi";

const PinImage = ({ pinUrl, destination }) => {
  return (
    <div className='relative'>
        <img
            className="rounded-3xl w-full peer"
            src={pinUrl}
            alt="posted-pin"
        />
        {destination ? 
        <Link 
            href={destination ? destination : "/"}
        >
            <a
                className='absolute bottom-2 left-5 text-xl p-2 px-5 mb-2 max-w-[300px] rounded-3xl hidden peer-hover:flex hover:flex hover:bg-[#e9e9e9] justify-center items-center bg-white opacity-90' 
                target="_blank"
            >
                <FiArrowUpRight className='text-3xl font-black' /> {destination?.length > 20 ? destination?.slice(8, 20): destination}
            </a>
        </Link>

        : null
        }
    </div> 
  );
}

export default PinImage;
