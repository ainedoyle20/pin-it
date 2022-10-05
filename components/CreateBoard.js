import React, {useState, useContext} from 'react';
import { useRouter } from 'next/router';
import { StateContext } from '../context/StateContext';

import { handleCreateBoardWithPin, removeSavedPin, savePin } from '../lib/utils';

const CreateBoard = ({ setShowCreateBoard, selectedPins, profileBoardId, pinId }) => {
  const { user } = useContext(StateContext);
  const [boardName, setBoardName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    setLoading(true);
    if (pinId) {

      const data = await handleCreateBoardWithPin(boardName, user?.uid, pinId); 

      if (data) {
        router.replace(`/profile/${user?.uid}`);
      }
      
    } else if (selectedPins?.length) {
      if (selectedPins.length > 1) {
        const firstPinId = selectedPins[0];
        const restOfPinIds = selectedPins.filter((pinId) => pinId !== firstPinId);

        const data = await handleCreateBoardWithPin(boardName, user?.uid, firstPinId);
        await removeSavedPin(profileBoardId, firstPinId);

        restOfPinIds.map((pinId) => {
          savePin(data?._id, pinId);
        });
    
        restOfPinIds.map((pinId) => {
          removeSavedPin(profileBoardId, pinId);
        });

        
        setTimeout(() => {
          router.replace(`/profile/${user?.uid}`);
        }, 3000);

      } else {
        await handleCreateBoardWithPin(boardName, user?.uid, selectedPins[0]);
        await removeSavedPin(profileBoardId, selectedPins[0]);
        
        setTimeout(() => {
          router.replace(`/profile/${user?.uid}`);
        }, 3000);
      }

    }
  }

  return (
    <div 
      className='absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] bg-white z-[100] rounded-xl shadow-2xl overflow-hidden flex flex-col items-center p-10'
    > 
    {loading ? (
      <p>Saving...</p>
    ) : (
      <>
      <input
        className='text-2xl p-5 pb-2 m-3 border-b-[1px] border-gray-200 outline-none'
        type="text"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        placeholder="Board Name"
        required
      />
      

      <div className='w-full flex justify-between my-8 px-2'>
        <button className='py-3 px-5 bg-gray-100 rounded-3xl text-lg' type='button' onClick={() => setShowCreateBoard(false)}>Cancel</button>
        <button className='py-3 px-5 bg-gray-100 rounded-3xl text-lg' type='button' 
          onClick={() => {
            handleCreate();
          }}
        >Create</button>
      </div>
      </>
    )}
      
    </div>
  )
}

export default CreateBoard;
