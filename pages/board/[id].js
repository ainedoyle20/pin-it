import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { AiFillEdit } from 'react-icons/ai'

import { specificBoardQuery } from '../../lib/data';
import { client, urlFor } from '../../lib/client';
import { removeSavedPin } from '../../lib/utils';

import MasonryLayout from '../../components/MasonryLayout';

const BoardDetail = ({ userId, boardId, boardDetails }) => {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [deletingBoard, setDeletingBoard] = useState(false);
  const [editBoard, setEditBoard] = useState(false);
  const [disableRemoveBtn, setDisableRemoveBtn] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!userId) router.replace("/login");
  }, [userId])

  useEffect(() => {
    if (!boardDetails || !Object.values(boardDetails).length) {
      console.log('in here', boardDetails);
      router.replace(`/profile/${userId}`);
    } 
  }, [boardDetails]);

  const deleteBoard = (id) => {
    client
      .delete(id)
      .then(() => {
        console.log("Successfully deleted board");
        setDeletingBoard(true);
        setTimeout(() => {
          router.replace(`/profile/${userId}`);
        }, 2000);
      });
  };

  const handleRemovePin = (id) => {
    setDisableRemoveBtn(true);
    removeSavedPin(boardId, id);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  if (deletingBoard || !boardDetails || !Object.values(boardDetails).length) {
    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <span 
          className='text-2xl'
        >Loading...</span>
      </div>
    )
  }

  return (
    <>
      <div className='w-full min-h-screen pt-20 flex flex-col items-center'>
        <div className='flex flex-row gap-5 mt-10'>
          <span
            className='text-[50px] font-semibold cursor-default'
          >
            {boardDetails?.name}
          </span>

          <button 
            type='button'
            onClick={() => setShowDeleteWarning(true)}>
            <RiDeleteBin7Fill size={30}  />
          </button>

          <button 
            type='button'
            onClick={() => {
              setEditBoard(!editBoard);
              setDisableRemoveBtn(false);
            }}
          >
            <AiFillEdit size={30}  />
          </button>
        </div>
        
        {editBoard ? (
          <span
            className='text-lg font-semibold rounded-lg hover:shadow-lg cursor-pointer mt-3 p-3'
            onClick={() => {
              setEditBoard(false);
              setDisableRemoveBtn(false);
            }}
          >Finished Editing Board</span>
        ) :null}

        <div className='flex flex-row items-center gap-8 mt-5'>
          <span className='text-2xl cursor-default'>
            Created by: 
          </span>

          <div className='flex items-center gap-3 rounded-3xl p-3 px-5 hover:shadow-lg cursor-pointer'>
            {boardDetails?.postedBy?.image && (
              <img
                alt="user pic"
                src={urlFor(boardDetails?.postedBy?.image).url()}
                className="w-10 h-10 rounded-lg"
              />  
            )}

            <span
              className='text-2xl'
            >
              {boardDetails?.postedBy?.userName}
            </span>
          </div>
        </div>

        <div
          className='w-full h-full mt-10'
        >
          {boardDetails?.savedPins?.length ? (
            <MasonryLayout pins={boardDetails?.savedPins} userId={userId} editBoard={editBoard} handleRemovePin={handleRemovePin} disableRemoveBtn={disableRemoveBtn} />
          ): (
            <span 
              className='text-2xl font-medium w-full flex justify-center mt-20'
            >
              No pins saved to {boardDetails?.name ? boardDetails.name : 'this board'}
            </span>
          )}
        </div>
      </div>

      {(showDeleteWarning && boardDetails) ? (
        <div className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-[200]'>
          <div className='w-[70vw] sm:w-[50vw] min-h-[38vh] flex flex-col items-center bg-white rounded-2xl shadow-2xl'>
            <span 
              className='text-3xl font-bold my-10'
            >Warning!</span>

            <span
              className='w-3/4 my-5 text-xl font-medium'
            >If you delete {boardDetails?.name} all pins saved to this board will be unsaved </span>

            <span
              className='w-3/4 my-5 text-xl font-medium'
            >Are you sure you want to delete {boardDetails?.name} board?</span>

            <div className='flex flex-row justify-between w-3/4 mt-10 mb-10'>
              <button
                type='button'
                onClick={() => setShowDeleteWarning(false)}
                className="px-5 py-3 text-lg bg-gray-100 rounded-3xl hover:bg-gray-300"
              >Cancel</button>
              <button
                type='button'
                onClick={() => deleteBoard(boardId)}
                className="px-5 py-3 text-lg bg-gray-100 rounded-3xl hover:bg-gray-300"
              >Confirm</button>
            </div>
          </div>
        </div>
      ): null}
    </>
  )
}

export const getServerSideProps = async (context) => {
  const boardId = context.query.id;
  let boardDetails = null;

  if (boardId) {
    const specificBoardQ = specificBoardQuery(boardId);
    boardDetails = await client.fetch(specificBoardQ);

    if (boardDetails?.length) {
      boardDetails = boardDetails[0];
    }
  }

  // if (!boardDetails || !boardDetails?.length) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: '/'
  //     }
  //   }
  // }
  

  return {
    props: {
      boardId,
      boardDetails,
    }
  }
}

export default BoardDetail;
