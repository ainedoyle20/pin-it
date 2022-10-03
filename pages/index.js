import React, {useEffect, useState, useContext} from 'react';
import { StateContext } from '../context/StateContext';
import { Circles } from 'react-loader-spinner';

import PinsContainer from '../components/PinsContainer';
import { client } from '../lib/client';
import { pinsQuery } from '../lib/data';

const Home = ({ pins }) => {
  const { userDetails } = useContext(StateContext);
  const [filteredPins, setFilteredPins] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userDetails) return;

    const {tuneFeed} = userDetails;

    if (!tuneFeed) {
      setLoading(false);
      return;
    } else {
      const newPins = pins.filter((pin) => tuneFeed?.find(theme => theme.name === pin.category));

      setFilteredPins(newPins); 
      setLoading(false);
    }
  }, [userDetails])

  if (!userDetails || loading) {
    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <Circles
          height="80"
          width="80"
          color="#65B2FF"
          ariaLabel="circles-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
   <>
      <PinsContainer pins={filteredPins} />
   </>
  );
}

export const getServerSideProps = async (context) => {
  const pins = await client.fetch(pinsQuery);

  if (!context.req.cookies.currentUser) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      }
    }
  }

  return {
    props: {pins}
  }
}

export default Home;