import React from 'react';
import MasonryLayout from './MasonryLayout';

const PinsContainer = ({ pins, userId }) => {

  if (!pins) return <h2>No pins created yet</h2>;

  return (
    <div className='w-full h-screen overflow-scroll px-10 md:px-16 pt-20'>
      <div className='h-full'>
        {pins && (
          <MasonryLayout pins={pins} userId={userId} />
        )}
      </div>
    </div>
  );
}

export default PinsContainer;
