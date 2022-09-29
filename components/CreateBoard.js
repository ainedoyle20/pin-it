import React, {useState} from 'react';

import { handleCreateBoardWithPin, handleCreateBoard } from '../lib/utils';

const CreateBoard = ({ setShowCreateBoard, userId, pinId, setSavingPost, setPostSaved }) => {
  const [boardName, setBoardName] = useState('');

  // console.log('userId: ', userId, 'pinId: ', pinId);

  const handleCreate = () => {
    if (pinId) {
      setSavingPost(true);

      const success = handleCreateBoardWithPin(boardName, userId, pinId);

      if (success) {
        console.log("Success!");
        setSavingPost(false);
        setPostSaved(true);
        setShowCreateBoard(false);
      } else {
        console.log("Failed");
      }
    } else {
      console.log('No pin id');
      handleCreateBoard(boardName, userId);
    }
  }

  return (
    <div 
      className='absolute bg-white w-[70vw] h-[70vh] z-[100] opacity-100 rounded-xl shadow-2xl overflow-hidden top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]'
    > 
      <input
        type="text"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        placeholder="Board Name"
        required
      />
      

      <div className='flex gap-5'>
        <button type='button' onClick={() => setShowCreateBoard(false)}>Cancel</button>
        <button type='button' onClick={handleCreate}>Create</button>
      </div>
    </div>
  )
}

export default CreateBoard;
