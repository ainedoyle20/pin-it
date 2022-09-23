import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import SignUp from '../components/SignUp';

const Login = ({ userId }) => {
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/");
  }, [userId]);

  return (
    <div className="h-screen overflow-scroll flex flex-col justify-center items-center pt-5">
        <SignUp />
    </div>
  );
}

export default Login

// const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();