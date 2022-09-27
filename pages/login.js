import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';

const Login = ({ userId }) => {
  const [showSignUp, setShowSignUp] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (userId) router.replace("/");
  }, [userId]);

  return (
    <div className="h-screen overflow-scroll flex flex-col justify-center items-center pt-5">
      <div className='flex flex-row'>
        <button type="button" onClick={() => setShowSignUp(false)}>Sign In</button>
        <button type="button" onClick={() => setShowSignUp(true)}>Sign Up</button>
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