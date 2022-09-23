import React, {useState} from "react";

import { urlFor } from '../../lib/client';
import MasonryLayout from '../../components/MasonryLayout';

const Profile = ({ userId, userDetails }) => {
  const [activeButton, setActiveButton] = useState('Created');
    return (
      <div className="h-screen flex flex-col items-center pt-16">
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
          
      </div>
    );
}

export default Profile;
