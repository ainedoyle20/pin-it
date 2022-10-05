import { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, auth } from '../lib/firebase';
import { useCookies } from 'react-cookie';
import axios from 'axios';

import {BASE_URL} from '../lib/utils';

export const StateContext = createContext({});

export const StateContextProvider = ({children}) => {
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);

  const [searchCategory, setSearchCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchBoard, setSearchBoard] = useState("");
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  
  const onSearch = () => {
    setFilterCategory(searchCategory);
  }

  const getUserDetails = async (id) => {
    const {data} = await axios.get(`${BASE_URL}/api/profile/${id}`);
    
    if (data) {
      setUserDetails(data);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
      
      if (currentuser) {
        setCookie('currentUser', true, { path: '/' });
      } else {
        removeCookie('currentUser', { path: '/' });
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
    setUserDetails,
    user,
    userDetails,
  };

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

export function useUserAuth() {
  return useContext(StateContext);
}
