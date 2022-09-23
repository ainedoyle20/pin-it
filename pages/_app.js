import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import '../styles/globals.css';

import { client, urlFor } from '../lib/client';
import { userQuery } from '../lib/data';

function MyApp({ Component, pageProps }) {
  const [userDetails, setUserDetails] = useState(null);

  let userId = null;
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    if (localStorage.getItem('user') !== 'undefined') {
      userId = JSON.parse(localStorage.getItem('user')).userId; 
    } else {
      localStorage.clear();
    }
  }

  const getUserDetails = async (id) => {
    const query = userQuery(id);
    const userDetails = await client.fetch(query);
    // console.log(userDetails[0]);
    setUserDetails(userDetails[0]);
  }

  useEffect(() => {
    if (!userId) return;

    getUserDetails(userId);
  }, [userId])

  const someVal = '123';

  return (
    <Layout>
      <Component {...pageProps} userId={userId} userDetails={userDetails} someVal={someVal} />
    </Layout>
  );
}

export default MyApp;
