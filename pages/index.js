import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { Circles } from 'react-loader-spinner';

import PinsContainer from '../components/PinsContainer';
import { client } from '../lib/client';
import { pinsQuery } from '../lib/data';

const Home = ({ pins, userId, userDetails }) => {
  const [filteredPins, setFilteredPins] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!userId) router.replace("/login");
  }, [userId]);

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
        {/* <span className='text-2xl'>
          Loading...
        </span> */}

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

      
    )
  }

  return (
   <>
      <PinsContainer pins={filteredPins} userId={userId} />
   </>
  );
}

export const getServerSideProps = async () => {
  const pins = await client.fetch(pinsQuery);

  return {
    props: {pins}
  }
}

export default Home;