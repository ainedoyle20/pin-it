import { createContext, useState } from 'react';

export const StateContext = createContext({});

const StateContextProvider = ({children}) => {
  const [searchCategory, setSearchCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchBoard, setSearchBoard] = useState("");

  const onSearch = () => {
    setFilterCategory(searchCategory);
  }

  const value = { searchCategory, setSearchCategory, filterCategory, onSearch, searchBoard, setSearchBoard };

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

export default StateContextProvider;
