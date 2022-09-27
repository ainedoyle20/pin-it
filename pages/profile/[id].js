import React, {useState, useEffect} from "react";
import { useRouter } from "next/router";

import { urlFor, client } from '../../lib/client';
import { boardsQuery, createdPinsQuery } from '../../lib/data';
import { handleSignOut } from '../../lib/utils';
import Board from "../../components/Board";
import MasonryLayout from '../../components/MasonryLayout';

const Profile = ({ userId, userDetails }) => {
  const [activeButton, setActiveButton] = useState('Created');
  const [loggingOut, setLoggingOut] = useState(false);
  const [boards, setBoards] = useState([]);
  const [unorganisedBoard, setUnorganisedBoard] = useState([]);
  const [createdPins, setCreatedPins] = useState([]);

  const router = useRouter();

  const fetchBoards = async () => {
    if (!userId) return;

    try {
      const query = boardsQuery(userId);
      const boards = await client.fetch(query);
      
      const profileBoard = boards?.filter(board => board.name === 'Profile');
      const createdBoards = boards.filter(board => board.name !== 'Profile');

      // console.log("profileBoard: ", profileBoard, "createdBoards: ", createdBoards);
      setBoards(createdBoards);
      setUnorganisedBoard(profileBoard);
    } catch (error) {
      console.log("Error fetching boards: ", error);
    }
  }

  const fetchCreatedPins = async () => {
    const query = createdPinsQuery(userId);
    try {
      const createdPins = await client.fetch(query);
      setCreatedPins(createdPins);
      // console.log(createdPins);
    } catch (error) {
      console.log('Erro fetching saved pins: ', error);
    }
  }

  useEffect(() => {
    if (!userId) router.replace("/login");
  }, [userId]);

  useEffect(() => {
    fetchBoards();
  }, [userId]);

  useEffect(() => {
    fetchCreatedPins();
  }, [userId]);

  const handleLogout = async () => {
    const success = await handleSignOut();
    if (success) {
      router.replace("/login");
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-24">
      <button 
        type="button" 
        onClick={handleLogout} 
        className="border-2 border-black p-3 rounded-lg"
      >
        Log out
      </button>


      {userDetails && (
        <img
          src={urlFor(userDetails?.image).url()}
          alt="profile-pic"
          className="w-40 h-40 rounded-[100%] mt-8"
        />  
      )}

      <span className="mt-10 text-3xl font-bold">{userDetails?.userName}</span>

      <div className="flex flex-row gap-10 mt-10">
        <span
          className={`${activeButton === "Created" ? "border-b-4 border-black" : "hover:border-b-4 border-black"} text-xl font-medium p-2 cursor-pointer`}
          onClick={() => setActiveButton('Created')}
        >Created</span>
        <span
          className={`${activeButton === "Saved" ? "border-b-4 border-black" : "hover:border-b-4 border-black"} text-xl font-medium p-2 cursor-pointer`}
          onClick={() => setActiveButton('Saved')}
        >Saved</span>
      </div>

      {activeButton === "Created" ? (
        <div 
          className="border-2 border-black w-full h-full mt-8 "
        >
          {createdPins?.length ? (
            <MasonryLayout pins={createdPins} userId={userId} />
          ) : (
            <p>No Pins Created</p>
          )}
        </div>
      ): (
        <>
        <div className="h-full mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 items-center justify-items-center px-3">
          {boards?.length ? (
            boards.map((board) => (
              <Board key={board._id} board={board} />
            ))
          ): (
            <p>No Pins Saved</p>
          )}
        </div>

        {(unorganisedBoard?.length && unorganisedBoard[0]?.savedPins?.length) ? (
          <div className="w-full border-t-2 border-gray-300 mt-12 pt-12 flex flex-col">
            <div className="w-full flex justify-between items-center mb-8 sm:px-3">
              <span className="text-2xl font-semibold">Unorganised ideas</span>
              <button 
                type="button" 
                onClick={() => {}}
                className="text-lg font-medium p-3 rounded-3xl bg-gray-100 hover:bg-gray-200"
              >
                Organise
              </button>
            </div>
            <MasonryLayout pins={unorganisedBoard[0]?.savedPins} userId={userId} />
          </div>
        ): (
          null
        )}
        </>
      )}
        
    </div>
  );
}

export default Profile;
