import React, {useEffect, useState} from 'react';
import { GiCancel } from 'react-icons/gi';

import ChooseBoard from './ChooseBoard';
import MasonryLayout from './MasonryLayout';

import { savePin, removeSavedPin } from '../lib/utils';

const OrganiseBoard = ({ userId, pins, setShowOrganiseBoard, profileBoardId }) => {
  const [selectedPins, setSelectedPins] = useState([]);
  const [showChooseBoard, setShowChooseBoard] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState("");

  useEffect(() => {
    if(!selectedBoardId.length) return;

    console.log("Saving selected pins");

    selectedPins.map((pinId) => {
      savePin(selectedBoardId, pinId);
    });

    selectedPins.map((pinId) => {
      removeSavedPin(profileBoardId, pinId);
    });

    setShowOrganiseBoard(false);

  }, [selectedBoardId])

  const togglePin = (pinId) => {
    if (selectedPins.includes(pinId)) {
      console.log("Pin already selected");
      const newSelectedPins = selectedPins.filter((pinID) => pinID !== pinId);
      setSelectedPins(newSelectedPins);
    } else {
      console.log("Pin is not selected");
      setSelectedPins([ ...selectedPins, pinId ]);
    }
  }

  return (
    <>
    <div 
      className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] shadow-2xl rounded-3xl w-[90vw] h-[70vh] bg-white p-3 overflow-scroll flex flex-col'
    >
      <div className='w-full flex flex-row justify-center my-8'>
        <h2 className='text-3xl font-semibold'>
          {selectedPins.length ? (
            `${selectedPins.length} selected`
          ) : (
            'Organise into a board'
          )}
        </h2> 
        <button
          type='button'
          onClick={() => setShowOrganiseBoard(false)}
          className="absolute top-10 right-5 p-2 rounded-3xl hover:shadow-xl flex justify-center items-center"
        >
          <GiCancel size={30} />
        </button>
      </div>
      

      <MasonryLayout userId={userId} pins={pins} selectedPins={selectedPins} togglePin={togglePin} />

      <div className='w-full h-full flex justify-end items-end p-3'>
        <button
          type="button"
          disabled={!selectedPins.length}
          className={`p-3 px-5 ${selectedPins?.length ? 'bg-red-600 text-white hover:text-lg' : 'bg-gray-100 text-gray-500' } rounded-3xl`}
          onClick={() => setShowChooseBoard(true)}
        >
          Next
        </button>
      </div>
    </div>

    {(showChooseBoard && selectedPins.length) ? (
      <ChooseBoard 
        setShowChooseBoard={setShowChooseBoard}
        userId={userId}
        widthVal="[90vw]"
        heightVal="[70vh]"
        setSelectedBoardId={setSelectedBoardId}
      />
    ): (
      null
    )}
    </>
  );
}

export default OrganiseBoard;
