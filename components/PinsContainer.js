import React from 'react';
import MasonryLayout from './MasonryLayout';

const PinsContainer = ({ pins, userId }) => {

  if (!pins) {
    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <span className='text-2xl'>
          Tune your home feed to view pins that interest you!
        </span>
      </div>
    );
  }

  return (
    <div className='w-full h-screen overflow-scroll px-10 md:px-16 pt-24'>
      <div className='h-full'>
        {pins && pins.length ? (
          <MasonryLayout pins={pins} userId={userId} />
        ): null}
      </div>
    </div>
  );
}

export default PinsContainer;
