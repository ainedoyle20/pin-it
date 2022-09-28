import React from 'react';
import { useRouter } from 'next/router';

import { urlFor } from '../lib/client';

const Board = ({ board }) => {
  const router = useRouter();
  // console.log(board);
  const { name, _id, savedPins } = board;
  return (
    <div 
      className='w-[300px] flex flex-col gap-2 p-2 cursor-pointer group'
      onClick={() => router.push(`/board/${_id}`)}
    >
      {(savedPins?.length > 0) ? (
        <img 
          alt="board pic"
          src={urlFor(savedPins[0]?.image).url()}
          className="h-[200px] w-full rounded-lg group-hover:opacity-90"
        />
      ) : (
        <div className='border-2 border-black h-[200px] w-full rounded-lg bg-gray-100'/>
      )}
  
      <div className='w-full flex flex-col items-start gap-1 px-3'>
        <span className='text-xl font-semibold'>{name}</span>
        <span className='text-sm font-light'>{savedPins?.length} {savedPins?.length === 1 ? 'pin': 'pins'}</span>
      </div>
    </div>
  );
}

export default Board;
