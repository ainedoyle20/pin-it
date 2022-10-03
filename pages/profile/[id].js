import React, {useState, useEffect, useContext} from "react";
import { StateContext } from "../../context/StateContext";
import { useRouter } from "next/router";

import { urlFor, client } from '../../lib/client';
import { boardsQuery, createdPinsQuery, userQuery } from '../../lib/data';
import { handleSignOut } from '../../lib/utils';
import Board from "../../components/Board";
import MasonryLayout from '../../components/MasonryLayout';
import OrganiseBoard from "../../components/OrganiseBoard";

const Profile = ({ userUrlId, profileDetails, boards, createdPins }) => {
  const { setStatusProps, user } = useContext(StateContext);

  const [activeButton, setActiveButton] = useState('Created');
  const [organisedBoards, setOrganisedBoards] = useState([]);
  const [unorganisedBoard, setUnorganisedBoard] = useState([]);
  const [showOrganiseBoard, setShowOrganiseBoard] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if(!boards) return;

    const profileBoard = boards?.filter(board => board.name === 'Profile');
    const createdBoards = boards.filter(board => board.name !== 'Profile');

    setOrganisedBoards(createdBoards);
    setUnorganisedBoard(profileBoard);
  }, [boards]);

  const handleLogout = async () => {
    await handleSignOut();
    router.replace("/login");
  }

  const handleRemoveUnorganisedPin = (pinId) => {
    client.patch(unorganisedBoard[0]._id)
      .unset([`savedPins[_ref=="${pinId}"]`])
      .commit()
      .then(() => {
        setStatusProps({ success: true, message: "Pin removed" });
      })
      .catch((error) => {
        console.log("error removing unorganised pin", error);
        setStatusProps({ success: false });
      })
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-24">
      <button 
        type="button" 
        onClick={handleLogout} 
        className="p-2 rounded-lg mt-3 hover:text-lg"
      >
        Log out
      </button>


      {profileDetails && (
        <img
          src={urlFor(profileDetails?.image).url()}
          alt="profile-pic"
          className="w-40 h-40 rounded-[100%] mt-8"
        />  
      )}

      <span className="mt-10 text-3xl font-bold">{profileDetails?.userName}</span>

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
          className="w-full h-full mt-8 "
        >
          {createdPins?.length ? (
            <MasonryLayout pins={createdPins} userId={userUrlId} />
          ) : (
            <p
              className="w-full flex justify-center mt-28 text-2xl font-medium"
            >No Pins Created</p>
          )}
        </div>
      ): ( !organisedBoards?.length && !unorganisedBoard[0]?.savedPins?.length) ? (
        <div 
          className="w-full flex justify-center mt-28"
        >
          <span className="text-2xl font-medium">No Pins Saved</span>
        </div>
      ) : (
        <>
          <div className="h-full mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 items-center justify-items-center px-3">
            {organisedBoards?.length ? (
              organisedBoards.map((board) => (
                <Board key={board._id} board={board} />
              ))
            ): (
              null
            )}
          </div>

          {(unorganisedBoard?.length && unorganisedBoard[0]?.savedPins?.length) ? (
            <div className="relative w-full min-h-[80vh] border-t-2 border-gray-300 mt-12 pt-12 flex flex-col">
              {showOrganiseBoard && unorganisedBoard?.length && unorganisedBoard[0]?.savedPins ? (
                <OrganiseBoard userId={userUrlId} pins={unorganisedBoard[0]?.savedPins} setShowOrganiseBoard={setShowOrganiseBoard} profileBoardId={unorganisedBoard[0]?._id} />
              ) : (
                null
              )
              }

              <div className="w-full flex justify-between items-center mb-8 px-5">
                <span className="text-md sm:text-2xl font-semibold">Unorganised ideas</span>
                <button 
                  type="button" 
                  onClick={() => setShowOrganiseBoard(true)}
                  className="text-sm sm:text-lg font-medium p-2 sm:p-3 rounded-3xl bg-gray-100 hover:bg-gray-200"
                >
                  Organise
                </button>
              </div>
              <MasonryLayout pins={unorganisedBoard[0]?.savedPins} userId={userUrlId} unorganised={true} handleRemoveUnorganisedPin={handleRemoveUnorganisedPin} />
            </div>
          ): (
            null
          )}
        </>
      )}
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const userUrlId = context.query.id;
  let profileDetails = null;
  let boards = null;
  let createdPins = null;

  if (!context.req.cookies.currentUser) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      }
    }
  }

  if (userUrlId) {
    const userQ = userQuery(userUrlId);
    const profile = await client.fetch(userQ);

    if (profile) {
      profileDetails = profile[0];

    
      const query = boardsQuery(userUrlId);
      boards = await client.fetch(query);

      
      const createdPinsQ = createdPinsQuery(userUrlId);
      createdPins = await client.fetch(createdPinsQ); 
    }
  }

  if (!profileDetails) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }
  

  return {
    props: {
      userUrlId,
      profileDetails,
      boards,
      createdPins,
    }
  }
}

export default Profile;
