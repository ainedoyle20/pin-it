import React from 'react'
import Masonry from 'react-masonry-css';
import Pin from './Pin';

// const breakpointColumnsObj = {
//   default: 4,
//   3000: 6,
//   2000: 5,
//   1200: 3,
//   1000: 2,
//   500: 1,
// };

const breakpointColumnsObj = {
  default: 3,
  3000: 4,
  // 2000: 3,
  1500: 3,
  // 1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins, userId, selectedPins, togglePin }) => (
  <Masonry className="flex" breakpointCols={breakpointColumnsObj}>
    {pins?.map((pin) => <Pin key={pin._id} pin={pin} userId={userId} selectedPins={selectedPins} togglePin={togglePin} />)}
  </Masonry>
);

export default MasonryLayout;
