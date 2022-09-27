import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../lib/client';
import ChooseBoard from './ChooseBoard';
import CreateBoard from './CreateBoard';

const Pin = ({ pin, userId }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  // const [userId, setUserId] = useState(null);
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [showChooseBoard, setShowChooseBoard] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const router = useRouter();

  const { postedBy, image, _id, destination } = pin;
  // console.log(typeof _id);

  useEffect(() => {
    if (!userId) {
      router.replace("/login");
    }
  }, [userId]);

  useEffect(() => {
    let alreadySaved = !!(pin?.save?.filter((item) => item?.postedBy?._id === userId).length);
    setAlreadySaved(alreadySaved);
  }, []);

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      });
  };

  // const savePin = (id) => {
  //   if (!alreadySaved) {
  //     setSavingPost(true);

  //     client
  //       .patch(id)
  //       .setIfMissing({ save: [] })
  //       .insert('after', 'save[-1]', [{
  //         _key: uuidv4(),
  //         userId,
  //         postedBy: {
  //           _type: 'postedBy',
  //           _ref: `${userId}`,
  //         },
  //       }])
  //       .commit()
  //       .then(() => {
  //         setAlreadySaved(true);
  //         setSavingPost(false);
  //         // Deploy success banner
  //       })
  //       .catch((err) => console.log('Error saving pin: ', err));
  //   }
  // };

  const savePin = (boardId) => {
    if (!boardId) {
      return;
    }
    client
     .patch(boardId)
     .setIfMissing({ savedPins: [] })
     .insert('after', 'savedPins[-1]', [{
      _key: uuidv4(),
      _type: 'savedPin',
      _ref: `${_id}`
     }])
     .commit()
     .catch(error => console.log("Error saving pin: ", error));
  }

  const handleCreateBoard = () => {
    setSelectedId(_id);
    setShowChooseBoard(false);
    setShowCreateBoard(true);
  }

  return (
    <>
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => router.push(`/pinDetail/${_id}`)}
        className="relative cursor-zoom-in w-auto h-auto hover:shadow-lg rounded-lg"
      >
        {image && (
          <img className="rounded-lg w-full" src={(urlFor(image).width(300).url())} alt="user-post" /> 
        )}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}
          >
            <div className="flex items-center justify-between">
              {/* <span 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChooseBoard(true);
                }}
                className="cursor-pointer text-white"
              >{selectedBoard}</span> */}

              {alreadySaved ? (
                <button type="button" disabled className="bg-red-500 opacity-70 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                  Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowChooseBoard(true);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {savingPost ? 'Saving' : 'Save'}
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
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
                  postedBy?._id === userId && (
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
                  )
                }
              </div>
            
            </div>
          </div>
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

      {showChooseBoard ? (
        <ChooseBoard 
          setShowChooseBoard={setShowChooseBoard} 
          savePin={savePin} 
          handleCreateBoard={handleCreateBoard} 
          userId={userId}
          pinId={_id}
        />
      ) : (
        null
      )}
    </div>
    
    {showCreateBoard ? (
      <CreateBoard 
        setShowCreateBoard={setShowCreateBoard} 
        userId={userId} 
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