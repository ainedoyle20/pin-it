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
      const newSelectedPins = selectedPins.filter((pinID) => pinID !== pinId);
      setSelectedPins(newSelectedPins);
    } else {
      setSelectedPins([ ...selectedPins, pinId ]);
    }
  }

  return (
    <>
    <div 
      className={`${showChooseBoard ? 'hidden' : 'absolute'} top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-50 shadow-2xl border-[1px] border-gray-500 rounded-3xl w-[90vw] sm:w-[600px] xl:w-[700px] h-[60vh] bg-white p-3 overflow-scroll flex flex-col`}
    >
      <div className='w-full flex flex-row justify-center my-8'>
        <h2 className='text-md md:text-xl lg:text-3xl font-semibold'>
          {selectedPins.length ? (
            `${selectedPins.length} selected`
          ) : (
            'Select a pin(s) to organise'
          )}
        </h2> 
        <button
          type='button'
          onClick={() => setShowOrganiseBoard(false)}
          className="absolute top-9 right-2 md:right-5 p-2 rounded-3xl hover:shadow-xl flex justify-center items-center text-xl md:text-3xl"
        >
          <GiCancel />
        </button>
      </div>
      

      <MasonryLayout userId={userId} pins={pins} selectedPins={selectedPins} togglePin={togglePin} />

      <div className='w-full h-full flex justify-end items-end p-3'>
        <button
          type="button"
          disabled={!selectedPins.length}
          className={`p-3 px-5 ${selectedPins?.length ? 'bg-red-600 text-white hover:text-lg' : 'bg-gray-100 text-gray-500' } rounded-3xl`}
          onClick={() => {
            setShowChooseBoard(true)
          }}
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
