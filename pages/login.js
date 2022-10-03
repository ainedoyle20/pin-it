import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import { StateContext } from '../context/StateContext';

const Login = () => {
  const { user } = useContext(StateContext);

  const [showSignUp, setShowSignUp] = useState(false);

  const router = useRouter();

  // useEffect(() => {
  //   if (user) router.replace("/");
  // }, [user]);

  return (
    <div 
      className="h-screen overflow-scroll flex flex-col justify-center items-center gap-5 3xl:gap-10"
    >
      <div className='flex flex-row border-[1px] border-gray-100 rounded-xl'>
        <button 
          type="button" 
          onClick={() => setShowSignUp(false)}
          className={`px-3 py-2 xl:px-5 xl:py-3 3xl:px-5 3xl:py-3 ${showSignUp ? '' : 'bg-gray-100'} hover:bg-gray-200 text-xl lg:text-2xl 3xl:text-[35px]`}
        >
          Sign In
        </button>

        <button 
          type="button" 
          onClick={() => setShowSignUp(true)}
          className={`px-3 py-2 xl:px-5 xl:py-3 3xl:px-5 3xl:py-3 ${showSignUp ? 'bg-gray-100' : ''} hover:bg-gray-200 text-xl lg:text-2xl 3xl:text-[35px]`}
        >
          Sign Up
        </button>
      </div>
      {showSignUp ? (
        <SignUp />
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export default Login

// const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();