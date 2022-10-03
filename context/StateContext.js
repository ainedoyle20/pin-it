import { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, auth } from '../lib/firebase';
import { useCookies } from 'react-cookie';

import { userQuery } from '../lib/data';
import { client } from '../lib/client';

export const StateContext = createContext({});

export const StateContextProvider = ({children}) => {
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);

  const [searchCategory, setSearchCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchBoard, setSearchBoard] = useState("");
  const [statusProps, setStatusProps] = useState(null);
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const onSearch = () => {
    setFilterCategory(searchCategory);
  }

  const getUserDetails = async (id) => {
    const query = userQuery(id);
    const userDetails = await client.fetch(query);
    
    setUserDetails(userDetails[0]);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);

      if (currentuser) {
        setCookie('currentUser', true, { path: '/' });
      } else {
        removeCookie('currentUser', true, { path: '/' });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setUserDetails(null);
    } else {
      getUserDetails(user?.uid);
    }
  }, [user]);

  const value = { 
    searchCategory,
    setSearchCategory,
    filterCategory,
    onSearch,
    searchBoard,
    setSearchBoard,
    statusProps,
    setStatusProps,
    setUserDetails,
    user,
    userDetails,
  };

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

export function useUserAuth() {
  return useContext(StateContext);
}
