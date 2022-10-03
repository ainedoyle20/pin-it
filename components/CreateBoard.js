import React, {useState, useContext} from 'react';
import { StateContext } from '../context/StateContext';

import { handleCreateBoardWithPin, handleCreateBoard } from '../lib/utils';

const CreateBoard = ({ setShowCreateBoard, pinId }) => {
  const { setStatusProps, user } = useContext(StateContext);

  const [boardName, setBoardName] = useState('');

  const handleCreate = async () => {
    if (pinId) {

      const success = await handleCreateBoardWithPin(boardName, user?.uid, pinId); 

      if (success) {
        setStatusProps({ success: true, message: 'Successfully added pin to created board'});
        setShowCreateBoard(false);
      } else {
        setStatusProps({ success: false });
      }
    } else {
      const succ = await handleCreateBoard(boardName, user?.uid);
      if (succ) {
        setStatusProps({ success: true, message: 'Successfully created new board'});
      } else {
        setStatusProps({ success: false });
      }
    }
  }

  return (
    <div 
      className='absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] bg-white z-[100] rounded-xl shadow-2xl overflow-hidden flex flex-col items-center p-10'
    > 
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
        <button className='py-3 px-5 bg-gray-100 rounded-3xl text-lg' type='button' onClick={handleCreate}>Create</button>
      </div>
    </div>
  )
}

export default CreateBoard;
