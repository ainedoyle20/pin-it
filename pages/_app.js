import React, {useEffect, useState} from 'react';
import Router from 'next/router';
import { Circles } from 'react-loader-spinner';
// import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

import { client } from '../lib/client';
import { userQuery } from '../lib/data';

function MyApp({ Component, pageProps }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  let userId = null;
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    if (localStorage.getItem('user') !== 'undefined' && localStorage.getItem('user') !== null) {
      userId = JSON.parse(localStorage.getItem('user')).userId; 
      // console.log(typeof userId);
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
    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("finished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      setUserDetails(null);
    } else {
      getUserDetails(userId);
    }
  }, [userId])

  return (
    <>
    {loading ? (
      <div className='w-screen h-screen flex justify-center items-center'>
        <Circles
          height="80"
          width="80"
          color="#65B2FF"
          ariaLabel="circles-loading"
          // wrapperStyle={{}}
          // wrapperClass=""
          visible={true}
        />
      </div>
    ) : (
      <>
      {/* <Layout> */}
        <Navbar {...pageProps} userId={userId} userDetails={userDetails}  />
        <Component {...pageProps} userId={userId} userDetails={userDetails} />
      {/* </Layout> */}
      </>
    )}
    </>
  );
}

export default MyApp;
