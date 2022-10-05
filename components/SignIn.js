import React, {useState } from 'react';
import { useRouter } from 'next/router';

import { handleSignIn } from '../lib/utils';

const SignIn = () => {
  const [loginDetails, setLoginDetails] = useState({ email: '', password: ''});

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginDetails({ ...loginDetails, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleSignIn(loginDetails);

    if (success) {
      router.replace("/");
    } else {
      alert('Incorrect details, please try again');
    }
  }


  return (
    <div className="shadow-2xl w-[80vw] md:w-[55vw] lg:w-[600px] 2xl:w-[35vw] 3xl:w-[40vw] min-h-[40vh] sm:min-h-[50vh] p-5 rounded-3xl">
      <form onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-8 lg:gap-10 3xl:gap-20 h-full"
      >
        <input 
          className='w-[90%] sm:w-3/4 focus:outline-none border-b-[1px] border-gray-500 pt-5 3xl:pt-8 3xl:pb-2 text-xl 3xl:text-[35px]'
          name="email"
          type="email"
          value={loginDetails.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <input 
          className='w-[90%] sm:w-3/4 focus:outline-none border-b-[1px] border-gray-500 pt-5 3xl:pt-8 3xl:pb-2 text-xl 3xl:text-[35px]'
          name="password"
          type="password"
          value={loginDetails.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <button type='submit' className='mt-8 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-3xl 3xl:px-5 3xl:py-3 text-xl 3xl:text-[30px]'>Sign in</button>
      </form>
    </div>
  )
}

export default SignIn