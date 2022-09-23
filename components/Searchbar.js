import React, {useState} from 'react';
import { FaSearch } from 'react-icons/fa';

import { categories } from '../lib/data';

const Searchbar = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSelectedCategory = (name) => {
        setSearchTerm(name);
        setShowCategories(false);
    }

    return (
        <div className='flex flex-col justify-center items-center mx-2.5'>
            <div className='w-full h-12 z-20 w-[80vw] px-2 border-2 border-black rounded-3xl bg-white flex items-center' onClick={() => setShowCategories(true)}>
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
            </div>
            

            <div className={showCategories ? 'absolute top-8 z-10 pt-12 flex flex-col border-2 border-black w-[78vw] bg-white' : 'hidden'}>
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
