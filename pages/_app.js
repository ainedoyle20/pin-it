import React, {useEffect, useState} from 'react';
import Router from 'next/router';
import { Circles } from 'react-loader-spinner';
import Navbar from '../components/Navbar';
import {StateContextProvider} from '../context/StateContext';
import { CookiesProvider } from 'react-cookie';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
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

  return (
    <>
    {loading ? (
      <div className='w-screen h-screen flex justify-center items-center'>
        <Circles
          height="80"
          width="80"
          color="#65B2FF"
          ariaLabel="circles-loading"
          visible={true}
        />
      </div>
    ) : (
      <StateContextProvider>
          <Navbar {...pageProps}  />
          <CookiesProvider>
            <Component {...pageProps} />
          </CookiesProvider>
      </StateContextProvider>
    )}
    </>
  );
}

export default MyApp;
