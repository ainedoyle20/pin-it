import React, { useState, useEffect, useContext } from 'react';
import { StateContext } from '../context/StateContext';
import { GiCancel } from 'react-icons/gi';

import { categories } from '../lib/data';
import { tuneFeed, removeFromTuneFeed } from '../lib/utils';

const TuneFeed = ({ setShowTuneFeed  }) => {
  const { setStatusProps, userDetails, user } = useContext(StateContext);

  const [userThemes, setUserThemes] = useState(null);

  useEffect(() => {
    if (!userDetails?.tuneFeed) {
      setUserThemes([]);
    } else {
      setUserThemes(userDetails?.tuneFeed);
    }
  }, [userDetails]);

  const handleTuneFeed = async (userId, category) => {
    if (!userId || !category) return;

    let success = await tuneFeed(userId, category);

    if (success) {
      setStatusProps({ success, message: 'A new topic has been added to your home feed'});
    } else {
      setStatusProps({ success: false });
    }

    setShowTuneFeed(false);
  }

  const handleRemoveFromTuneFeed = async (userId, themeKey) => {
    if (!userId || !themeKey) return;

    let success = await removeFromTuneFeed(userId, themeKey);

    if (success) {
      setStatusProps({ success, message: 'Your home feed has been updated'});
    } else {
      setStatusProps({ success: false });
    }

    setShowTuneFeed(false);
  }

  if (!userDetails) {
    return (
      <span className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-lg'>
        Loading...
      </span>
    );
  }

  if (!userThemes) {
    return (
      <span className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-lg'>
        Loading...
      </span>
    );
  }

  return (
    <div
      className='absolute top-[55%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-white rounded-lg shadow-2xl border-[1px] border-gray-100 z-[200] flex flex-col items-center p-3 w-[90vw] sm:w-[80vw] xl:w-[75vw] h-[80vh] overflow-scroll'
    >
      <div className='w-full flex justify-end mt-3 mr-3'>
        <button type='button' className='p-2 rounded-3xl hover:shadow-lg' onClick={() => setShowTuneFeed(false)}>
          <GiCancel size={30} />
        </button>
      </div>

      {userDetails.tuneFeed?.length ? (
        <>
        <span className='text-xl font-semibold mt-5 mb-10'>
          Your Themes
        </span>

        <div
          className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 items-center justify-items-center px-3'
        >
          {userDetails?.tuneFeed?.map((theme) => (
            <div 
              key={theme._key}
              className='w-[250px] relative flex flex-col gap-2 p-3 hover:bg-gray-200 rounded-lg'

            >
              <img 
              alt="topic"
              src={theme.image}
              className="h-[200px] w-full rounded-xl"
              />

              <span
                className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white text-xl font-semibold cursor-default'
              >{theme.name}</span>

              <button
                type="button"
                className='py-2 px-3 bg-gray-100 text-lg font-semibold rounded-3xl hover:bg-gray-300'
                onClick={() => handleRemoveFromTuneFeed(user?.uid, theme._key)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        </>
      ) : null}

      <span className='text-xl font-semibold my-10'>
        Select {userDetails.tuneFeed?.length ? 'more' : ''} themes to tune your feed
      </span>

      <div
        className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 items-center justify-items-center px-3'
      >
        {categories?.filter((category) => !userThemes.find((theme) => theme.name === category.name)).map((category, i) => (
          <div
            key={`${category.name}${i}`}
            className="relative w-[250px] flex flex-col gap-2 p-3 hover:bg-gray-200 rounded-lg"
          >
            <img 
              alt="topic"
              src={category.image}
              className="h-[200px] w-full rounded-xl"
            />

            <span
              className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white text-xl font-semibold cursor-default'
            >{category.name}</span>

            <button
              type="button"
              className='py-2 px-3 bg-gray-100 text-lg font-semibold rounded-3xl hover:bg-gray-300'
              onClick={() => handleTuneFeed(user?.uid, category)}
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TuneFeed;
