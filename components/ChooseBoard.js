import React, {useState, useEffect} from 'react';
import { GiCancel } from 'react-icons/gi';
import { BsPlusLg } from 'react-icons/bs';

import { client } from '../lib/client';
import { boardsQuery } from '../lib/data';

// const boards = [
//   { name: 'Profile', image: ''},
//   { name: 'Casual', image: ''},
//   { name: 'Business', image: ''},
//   { name: 'Quotes', image: ''},
//   { name: 'Puppies', image: ''},
//   { name: 'Cats', image: ''},
//   { name: 'Photography', image: ''},
// ]

const ChooseBoard = ({ setShowChooseBoard, savePin, handleCreateBoard, userId, pinId }) => {
  const [searchBoard, setSearchBoard] = useState("");
  const [boards, setBoards] = useState([]);

  const fetchBoards = async () => {
    if (!userId) return;

    try {
      const query = boardsQuery(userId);
      const boards = await client.fetch(query);
      setBoards(boards);
      // console.log(boards);
    } catch (error) {
      console.log("Error fetching boards: ", error);
    }
  }

  useEffect(() => {
    fetchBoards();
  }, [userId]);

  // useEffect(() => {
  //   client
  //     .patch("BOARDID")
  //     .unset(['savedPins[_ref=="PINID"]'])
  //     .commit()
  //     .then((res) => console.log(res))
  //     .catch((error) => console.log(error))
  // }, []);

  return (
    <div className='absolute bg-white w-[400px] h-[600px] z-[100] opacity-100 rounded-xl shadow-2xl overflow-hidden'>
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

      <div className='w-full h-[63%] overflow-scroll flex flex-col items-center px-5'>

        <span
          className='font-light text-sm w-full my-5'
        >Your boards</span>

        {boards && (
          boards.map((board) => (
            <div key={`${board._id}`} 
              className="flex items-center gap-2 my-2 p-2 w-full hover:shadow-lg rounded-lg cursor-pointer" 
              onClick={() => {
                savePin(board._id);
                setShowChooseBoard(false);
              }}
            >
              <div className='border-[1px] border-black w-14 h-14 rounded-lg'></div>
              <span>{board.name} {board.name === 'Profile' ? '(Default)' : ''}</span>
            </div>
          ))
        )}
      </div>

      <div 
        className='h-[15%] w-full flex items-center gap-2 px-7 hover:bg-gray-200 cursor-pointer shadow-2xl'
        onClick={handleCreateBoard}
      >
        <div className='bg-gray-200 w-14 h-14 rounded-lg flex justify-center items-center'>
          <BsPlusLg size={30} />
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
