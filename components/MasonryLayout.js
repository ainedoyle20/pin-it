import React, {useContext} from 'react';
import { useRouter } from 'next/router';
import Masonry from 'react-masonry-css';
import Pin from './Pin';
import { StateContext } from '../context/StateContext';

const breakpointColumnsObj = {
  default: 3,
  3000: 4,
  // 2000: 3,
  1500: 3,
  // 1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins, selectedPins, togglePin, editBoard, handleRemovePin, disableRemoveBtn, unorganised, handleRemoveUnorganisedPin }) => {
  const { filterCategory } = useContext(StateContext);

  const router = useRouter();

  return (
    <Masonry className="flex" breakpointCols={breakpointColumnsObj}>
      {pins?.filter((pin) => router.pathname === "/" ? pin.category?.toLowerCase().trim().includes(filterCategory.toLowerCase().trim()) : pin).map((pin) => (
        <Pin 
          key={pin._id} 
          pin={pin} 
          selectedPins={selectedPins} 
          togglePin={togglePin} 
          editBoard={editBoard}
          handleRemovePin={handleRemovePin}
          disableRemoveBtn={disableRemoveBtn}
          unorganised={unorganised}
          handleRemoveUnorganisedPin={handleRemoveUnorganisedPin}
        />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
