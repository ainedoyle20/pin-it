import React from 'react';
import MasonryLayout from './MasonryLayout';

const PinsContainer = ({ pins, userId }) => {

  if (!pins) return <h2>No pins created yet</h2>;

  return (
    <div className='w-full h-screen overflow-scroll border-2 border-black px-20 pt-20'>
      <div className='border-2 border-black h-full'>
        {pins && (
          <MasonryLayout pins={pins} userId={userId} />
        )}
      </div>
    </div>
  );
}

export default PinsContainer;
