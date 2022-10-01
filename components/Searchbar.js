import React, {useState} from 'react';
import { FaSearch } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';

import { categories } from '../lib/data';

const Searchbar = ({ setShowSearchBar, showSearchBar }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectedCategory = (name) => {
    setSearchTerm(name);
    setShowCategories(false);
  }

  return (
    <div className={`${showSearchBar ? 'flex' : 'hidden lg:flex'} flex-col justify-center items-center mx-2.5`}>
        {/* <div className='hidden w-full h-12 z-20 w-[80vw] px-2 border-2 border-black rounded-3xl bg-white lg:flex items-center' onClick={() => setShowCategories(true)}> */}
        <div 
          className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-full lg:w-2/4 h-12 z-[500] px-2 border-2 border-black rounded-3xl bg-white flex items-center' 
          onClick={() => setShowCategories(true)}
        >
            <div className='ml-2 mr-5 cursor-pointer rounded-3xl'>
                <FaSearch />
            </div>
            <input
                type="text"
                value={searchTerm}
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-4/5 h-full outline-none text-blue"
            /> 
            <div className='w-full flex justify-end px-2'>
              <GiCancel 
                size={25}
                className="cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowSearchBar(false);
                    handleSelectedCategory("");
                }}
              /> 
            </div>
              
        </div> 

        <div className={showCategories ? 'absolute top-12 left-[50%] -translate-x-[50%] z-10 pt-5 flex flex-col border-[1px] border-gray-100 shadow-2xl w-[74%] lg:w-[48%] h-[200px] overflow-scroll bg-white' : 'hidden'}>
            {categories.map((category) => (
                <div 
                    key={category.name}
                    className="p-5 w-full hover:bg-[#a5a5a5] cursor-pointer"
                    onClick={() => handleSelectedCategory(category.name)}
                >
                    {category.name}
                </div>
                
            ))}
        </div>
    </div>
  );
}

export default Searchbar;
