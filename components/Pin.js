import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { StateContext } from '../context/StateContext';
// import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../lib/client';
import ChooseBoard from './ChooseBoard';
import CreateBoard from './CreateBoard';

const Pin = ({ pin, selectedPins, togglePin, editBoard, handleRemovePin, disableRemoveBtn, unorganised, handleRemoveUnorganisedPin }) => {
  const { setStatusProps, user } = useContext(StateContext);

  const [showChooseBoard, setShowChooseBoard] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const router = useRouter();

  const { postedBy, image, _id, destination } = pin;

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        setStatusProps({ success: true, message: 'Pin deleted'});
        setTimeout(() => {
          window.location.reload(true);
        }, 5000);
      })
      .catch((err) => {
        setStatusProps({ success: false });
      });
  };

  const handleCreateBoard = () => {
    setSelectedId(_id);
    setShowChooseBoard(false);
    setShowCreateBoard(true);
  }

  const handlePinClick = (id) => {
    if (router.pathname === '/profile/[id]' && selectedPins) {
      togglePin(id);
    } else {
      router.push(`/pinDetail/${id}`);
    }
  }

  return (
    <>
    <div className={`m-2 ${selectedPins?.includes(_id) ? 'border-2 border-black rounded-lg' : ''}`}>
      <div
        onClick={() => handlePinClick(_id)}
        className={`relative ${selectedPins ? 'cursor-pointer' : editBoard ? 'cursor-default' : 'cursor-zoom-in'}  w-auto h-auto hover:shadow-lg rounded-lg`}
      >
        {image && (
          <img className="rounded-lg w-full" src={(urlFor(image).width(300).url())} alt="user-post" /> 
        )}

        <div
          className={`${(selectedPins || editBoard || router.route === '/profile/[id]') ? 'hidden' : 'absolute'} top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50 group`}
          style={{ height: '100%' }}
        >
          <div className="flex items-center justify-end w-full lg:hidden lg:group-hover:flex">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowChooseBoard(true);
              }}
              type="button"
              className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
            >
              Save
            </button>
          </div>

          <div className="hidden lg:group-hover:flex justify-between items-center gap-2 w-full">
            {destination?.slice(8).length > 0 ? (
              <a
                href={destination}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                rel="noreferrer"
              >
                {' '}
                <BsFillArrowUpRightCircleFill />
                {destination?.slice(8, 17)}...
              </a>
            ) : undefined}

            <div className="flex gap-2">
              <a
                href={`${image?.asset?.url}?dl=`}
                download
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              ><MdDownloadForOffline />
              </a>

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
                ) : <button type='button' className='hidden'></button>
              }
            </div>
          
          </div>
        </div>

        {unorganised && (
          <div className='absolute bottom-0 w-full flex justify-start'>
            <button type='button' onClick={(e) => {
              e.stopPropagation();
              handleRemoveUnorganisedPin(_id);
            }}
              className="p-2 m-2 rounded-3xl bg-gray-100 opacity-75 hover:opacity-100"
            >Remove</button>
          </div>
        )}

        {editBoard && (
          <button
            type='button'
            className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] px-5 py-3 rounded-3xl bg-gray-100 text-xl hover:bg-gray-200'
            onClick={(e) => {
              e.stopPropagation();
              handleRemovePin(_id)
            }}
            disabled={disableRemoveBtn}
          >
            {disableRemoveBtn ? 'Loading...' : 'Remove'}
          </button>
        )}
      </div>
      <Link href={`/profile/${postedBy._id}`}>
        <div className="flex gap-2 mt-2 items-center cursor-pointer w-3/4">
         <img
          className="w-10 h-10 rounded-full object-cover"
          src={urlFor(postedBy?.image).url()}
          alt="user-profile"
        /> 
        <p className="font-semibold capitalize text-lg">{postedBy?.userName}</p>
        </div>
      </Link>
    </div>

    {showChooseBoard ? (
      <ChooseBoard 
        setShowChooseBoard={setShowChooseBoard} 
        handleCreateBoard={handleCreateBoard} 
        pinId={_id}
      />
    ) : (
      null
    )}
    
    {showCreateBoard ? (
      <CreateBoard 
        setShowCreateBoard={setShowCreateBoard} 
        pinId={selectedId} 
      />
    ): (
      null
    )
    }
  </>
  );
};

export default Pin;