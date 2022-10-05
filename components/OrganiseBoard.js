import React, { useEffect, useState } from 'react';
import { GiCancel } from 'react-icons/gi';

import ChooseBoard from './ChooseBoard';
import MasonryLayout from './MasonryLayout';
import CreateBoard from './CreateBoard';

import { savePin, removeSavedPin } from '../lib/utils';

const OrganiseBoard = ({ userId, pins, setShowOrganiseBoard, profileBoardId }) => {
  const [selectedPins, setSelectedPins] = useState([]);
  const [showChooseBoard, setShowChooseBoard] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [showCreateBoard, setShowCreateBoard] = useState(false);

  useEffect(() => {
    if(!selectedBoardId.length) return;

    selectedPins.map((pinId) => {
      savePin(selectedBoardId, pinId);
    });

    selectedPins.map((pinId) => {
      removeSavedPin(profileBoardId, pinId);
    });

    setShowOrganiseBoard(false);

    setTimeout(() => {
      window.location.reload();
    }, 3000);

  }, [selectedBoardId])

  const togglePin = (pinId) => {
    if (selectedPins.includes(pinId)) {
      const newSelectedPins = selectedPins.filter((pinID) => pinID !== pinId);
      setSelectedPins(newSelectedPins);
    } else {
      setSelectedPins([ ...selectedPins, pinId ]);
    }
  }

  const handleCreateBoard = () => {
    
    setShowChooseBoard(false);
    setShowCreateBoard(true);
  }

  return (
    <>
    <div 
      className={`${showChooseBoard ? 'hidden' : 'absolute'} top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-50 shadow-2xl border-[1px] border-gray-500 rounded-3xl w-[90vw] sm:w-[700px] h-[75vh] bg-white p-3 flex flex-col`}
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
      
      <div className='overflow-scroll h-full'>
      <MasonryLayout userId={userId} pins={pins} selectedPins={selectedPins} togglePin={togglePin} />
      </div>

      <div className='w-full flex justify-end items-end p-3'>
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
        setSelectedBoardId={setSelectedBoardId}
        handleCreateBoard={handleCreateBoard}
      />
    ): (
      null
    )}

    {showCreateBoard ? (
      <CreateBoard 
        setShowCreateBoard={setShowCreateBoard} 
        selectedPins={selectedPins}
        profileBoardId={profileBoardId}
      />
    ): (
      null
    )
    }
    </>
  );
}

export default OrganiseBoard;
