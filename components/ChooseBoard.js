import React, {useState, useEffect, useContext} from 'react';
import { useRouter } from 'next/router';
import { GiCancel } from 'react-icons/gi';
import { BsPlusLg } from 'react-icons/bs';
import Image from 'next/future/image';

import { StateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import { savePin } from '../lib/utils';
import axios from 'axios';

import { BASE_URL } from '../lib/utils';


const ChooseBoard = ({ setShowChooseBoard, handleCreateBoard, pinId, setSelectedBoardId }) => {
  const { searchBoard, setSearchBoard, user } = useContext(StateContext);

  const [boards, setBoards] = useState([]);
  const router = useRouter()

  const fetchBoards = async () => {
    if (!user?.uid) return;

    try {
      const {data} = await axios.get(`${BASE_URL}/api/boards/${user.uid}`);
      setBoards(data);
    } catch (error) {
      console.log("Error fetching boards: ", error);
    }
  }

  useEffect(() => {
    fetchBoards();
  }, [user]);

  const handleClickedBoard = async (boardId, pinId) => {
    if (!pinId) {
      setSelectedBoardId(boardId);
    } else {
      const success = savePin(boardId, pinId);
      if (success) router.replace(`/profile/${user?.uid}`);
    }
    setShowChooseBoard(false);
  }

  return (
    <div 
      className={`
        absolute top-[55%] left-[50%] -translate-x-[50%] -translate-y-[50%] 
        bg-white z-[100] opacity-100 rounded-xl shadow-2xl
        w-[85vw] h-[600px] sm:w-[400px] xl:w-[500px] 3xl:w-[700px]
      `}
    >
      <div className='w-full flex flex-row items-center justify-between p-3 h-[12%]'>
        <div className='w-[10%]'></div>
        <span className='text-xl'>Save</span>
        <div onClick={() => setShowChooseBoard(false)} className='p-2 rounded-3xl hover:shadow-lg cursor-pointer'>
          <GiCancel size={25} />
        </div>
      </div>

      <div className='w-full px-5'>
        <input 
          type="text"
          value={searchBoard}
          onChange={(e) => setSearchBoard(e.target.value)}
          placeholder="Search"
          className='border-2 border-gray-300 p-3.5 rounded-3xl focus:outline-none w-full text-lg'
        />
      </div>

      <div className='w-full h-[65%] overflow-scroll flex flex-col items-center px-5'>

        <span
          className='font-light text-sm w-full my-5'
        >Your boards</span>

        {boards && (
          boards.filter((board) => board.name.toLowerCase().trim().includes(searchBoard.toLowerCase().trim())).map((board) => (
            <div key={`${board._id}`} 
              className="flex items-center gap-2 my-2 p-2 w-full hover:shadow-lg rounded-lg cursor-pointer" 
              onClick={() => handleClickedBoard(board._id, pinId)}
            >
              {board?.savedPins?.length ? (
                <Image 
                  alt="board cover"
                  src={urlFor(board.savedPins[0].image).url()}
                  className="w-12 h-12 rounded-lg"
                  width={500}
                  height={500}
                />
              ) : (
                <div className='bg-gray-100 w-14 h-14 rounded-lg'></div>
              )}
              
              <span>{board.name} {board.name === 'Profile' ? '(Default)' : ''}</span>
            </div>
          ))
        )}
      </div>

      <div 
        className='w-full h-[80px] flex items-center justify-center p-5 gap-2 border-t-[1px] border-gray-100 hover:bg-gray-200 cursor-pointer rounded-b-2xl'
        onClick={handleCreateBoard}
      >
        <div className='bg-gray-200 rounded-lg flex justify-center items-center p-2'>
          <BsPlusLg size={20} />
        </div>
        <span
          className='text-xl font-medium'
        >
          Create Board
        </span>
      </div>
    </div>
  );
}

export default ChooseBoard;
