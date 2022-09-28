import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { specificBoardQuery } from '../../lib/data';
import { client, urlFor } from '../../lib/client';

import MasonryLayout from '../../components/MasonryLayout';

const BoardDetail = ({ userId, boardId }) => {
  const [boardDetails, setBoardDetails ] = useState(null);

  const router = useRouter();

  const fetchSpecificBoard = async () => {
    const query = specificBoardQuery(boardId);

    try {
      const boardDetails = await client.fetch(query);
      setBoardDetails(boardDetails[0]);
    } catch (error) {
      console.log("Error fetching board details: ", error);
    }
  }

  useEffect(() => {
    if (!userId) router.replace("/login");
  }, [userId])

  useEffect(() => {
    if (!boardId) router.replace("/");

    fetchSpecificBoard();
  }, []);
  
  if (!boardDetails) {
    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <span 
          className='text-2xl'
        >Loading...</span>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen pt-20 flex flex-col items-center'>
      <span
        className='text-[50px] font-semibold mt-14'
      >
        {boardDetails?.name}
      </span>

      <div className='flex flex-row items-center gap-8 mt-5'>
        <span className='text-2xl'>
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
        <MasonryLayout pins={boardDetails?.savedPins} userId={userId} />
      </div>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const boardId = context.query.id;

  return {
    props: {
      boardId,
    }
  }
}

export default BoardDetail;
