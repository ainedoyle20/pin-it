import React, {useState, useEffect} from 'react';
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
      alert('Sorry something went wrong please try again');
    }
  }


  return (
    <div className="shadow-2xl w-[55vw] min-h-[70vh] p-5 rounded-3xl flex flex-col">
      <form onSubmit={handleSubmit}>
        <input 
          name="email"
          type="email"
          value={loginDetails.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <input 
          name="password"
          type="password"
          value={loginDetails.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <button type='submit'>Sign in</button>
      </form>
    </div>
  )
}

export default SignIn