import React, {useEffect} from 'react';
import { useRouter } from 'next/router';

import PinsContainer from '../components/PinsContainer';
import { client } from '../lib/client';
import { pinsQuery } from '../lib/data';

const Home = ({ pins, userId }) => {
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.replace("/login");
  }, [userId]);

  return (
   <>
      <PinsContainer pins={pins} userId={userId} />
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