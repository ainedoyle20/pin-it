import React, {useContext } from 'react';
import { StateContext } from '../context/StateContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { handleSignOut } from '../lib/utils';
import { urlFor } from '../lib/client';

const Dropdown = ({ setShowTuneFeed, setShowDropdown }) => {
  const { user, userDetails } = useContext(StateContext);

  const router = useRouter();

  const handleLogout = async () => {
    await handleSignOut();
    router.replace("/login");
  }

  return (
    <div 
      className='absolute z-[200] top-20 right-3 min-h-[500px] min-w-[300px]'
    >
        {userDetails ? (
          <div className='w-full h-full bg-white flex flex-col justify-center border-[1px] border-gray-100 shadow-2xl rounded-lg'>
            <div className='w-full flex p-3 px-5 my-3 hover:shadow-lg rounded-lg cursor-pointer'>
              {userDetails?.image && (
                <img 
                  alt="user pic"
                  src={urlFor(userDetails?.image).url()}
                  className="w-8 h-8 rounded-3xl"
                />
              )}
              <span
                className='text-lg'
              >
                {userDetails?.userName}
              </span>
            </div>

            <Link href={`/profile/edit/${user?.uid}`}>
              <span className='text-xl p-2 px-5 rounded-lg hover:shadow-lg my-2 cursor-pointer'
              >
                Edit profile
              </span>
            </Link>
            <span 
              className='text-xl p-2 px-5 rounded-lg hover:shadow-lg my-2 cursor-pointer'
              onClick={() => {
                setShowTuneFeed(true);
                setShowDropdown(false);
              }}
            >
              Tune Feed
            </span>
  
            <span
              onClick={handleLogout}
              className='text-xl p-2 px-5 rounded-lg hover:shadow-lg my-2 cursor-pointer'
            >
              Logout
            </span>
          </div>
        ) : (
          <div className='w-full h-full bg-white flex flex-col items-center justify-center border-2 border-black rounded-lg'>
            <span className='text-lg'>Loading...</span>
          </div>
        )}
    </div>
  );
}

export default Dropdown
