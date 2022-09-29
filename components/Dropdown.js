import React, {useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { handleSignOut } from '../lib/utils';
import { userQuery } from '../lib/data';
import { client, urlFor } from '../lib/client';

const Dropdown = ({ setShowTuneFeed, setShowDropdown, userId }) => {
  const [userDetails, setUserDetails] = useState(null);

  const router = useRouter();

  const getUserDetails = async (id) => {
    const query = userQuery(id);
    const userDetails = await client.fetch(query);
    // console.log(userDetails[0]);
    setUserDetails(userDetails[0]);
  }

  useEffect(() => {
    if (localStorage.getItem('user') !== 'undefined' && localStorage.getItem('user') !== null){
      const userId = JSON.parse(localStorage.getItem('user')).userId;
      getUserDetails(userId);
    } else {
      router.replace("/login");
    }
  }, []);

  const handleLogout = async () => {
    const success = await handleSignOut();
    if (success) {
      router.replace("/login");
    }
  }

  return (
    <div 
      className='absolute z-[200] top-20 right-3 min-h-[500px] min-w-[300px]'
    >
        {userDetails ? (
          <div className='w-full h-full bg-white flex flex-col justify-center border-2 border-black rounded-lg'>
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

            <Link href={`/profile/edit/${userId}`}>
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
  
            <div className='w-full flex justify-start px-3 py-3'>
              <button
                type='button'
                onClick={handleLogout}
                className="p-2 rounded-3xl hover:shadow-lg text-lg"
              >
                Logout
              </button>
            </div>
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
