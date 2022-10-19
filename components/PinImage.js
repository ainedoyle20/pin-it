import React, {useContext} from 'react';
import Link from 'next/link';
import Image from 'next/future/image';
import { FiArrowUpRight } from "react-icons/fi";
import { AiTwotoneDelete } from 'react-icons/ai';
import { Circles } from 'react-loader-spinner';

import { urlFor } from '../lib/client';
import { StateContext } from '../context/StateContext';
import { BASE_URL } from '../lib/utils';

const PinImage = ({ pinUrl, destination, postedBy, image, _id }) => {
  const { user } = useContext(StateContext);

  const deletePin = async (id) => {
    await axios.delete(`${BASE_URL}/api/pins/${id}`);

    router.replace('/');
  };

  if (!pinUrl) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <Circles
          height="80"
          width="80"
          color="#65B2FF"
          ariaLabel="circles-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className='relative group'>
      <Image
        className="rounded-3xl w-full"
        src={urlFor(image).url()}
        alt="posted-pin"
        width={500}
        height={500}
        layout="responsive"
      />

      <div
        className="absolute top-0 w-full h-full flex lg:hidden lg:group-hover:flex flex-col justify-end p-1 pr-2 pt-2 pb-2 z-50"
        style={{ height: '100%' }}
      >

        <div className="flex justify-between items-center w-full pr-2">
          {destination?.slice(8).length > 0 ? (
          <Link href={destination}>
            <a
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
              rel="noreferrer"
            >
              {' '}
              <FiArrowUpRight />
              {destination?.slice(8, 17)}...
            </a>
          </Link>
          ) : undefined}

          <div className="flex">
            {
              postedBy?._id === user?.uid ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePin(_id);
                }}
                className="bg-white p-2 rounded-full w-9 h-9 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
              >
                <AiTwotoneDelete />
              </button>
              ): null
            }
          </div>
        
        </div>
      </div>
    </div> 
  );
}

export default PinImage;
