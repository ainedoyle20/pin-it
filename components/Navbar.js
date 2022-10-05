import React, {useState, useContext} from 'react';
import { StateContext } from '../context/StateContext';
import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineDown } from "react-icons/ai";
import { FaSearch } from 'react-icons/fa';

import Searchbar from './Searchbar';
import logo from '../assets/pinterest-logo.png';
import Dropdown from './Dropdown';
import TuneFeed from './TuneFeed';
import { urlFor } from '../lib/client';

const activeStyles = 'bg-black text-white h-full py-2 px-3 rounded-3xl cursor-pointer';

const Navbar = () => {
  const { userDetails, user } = useContext(StateContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showTuneFeed, setShowTuneFeed] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const router = useRouter();
  const currentRoute = router.pathname;

  if (!userDetails) {
    return null;
  }

  return (
    <>
    <div className={currentRoute === '/login' ? 'hidden' : 'fixed w-screen bg-white z-[400]'}>
      <div className='w-full h-full flex flex-row justify-between items-center py-5 px-2.5'>

        <div className='flex flex-row items-center'>
          <Link href="/" className="cursor-pointer rounded-3xl hover:bg-[#e9e9e9]">
            <a className="cursor-pointer rounded-3xl hover:bg-[#e9e9e9]">
              <Image src={logo} alt="pin-it-icon" width={50} height={50} priority /> 
            </a>
          </Link>

          <div className='md:hidden flex flex-col h-full cursor-pointer'>
            <div className='flex flex-row items-center h-full'>
              <button className='h-full px-2 rounded-3xl cursor-pointer' onClick={() => router.push('/')}>Home</button>
              <AiOutlineDown fontWeight={20} onClick={() => setShowOption(!showOption)} />
            </div>
            
            {showOption ? (
                <button 
                  className='px-3 cursor-pointer absolute bottom-0 bg-white'
                  onClick={() => router.push('/create')}
                >
                  Create
                </button>
            ) : null}
            
          </div>

          <div className='hidden md:flex flex-row h-full text-lg'>
            <Link href="/">
              <button className={currentRoute === '/' ? activeStyles : 'h-full py-2 px-3 rounded-3xl cursor-pointer hover:bg-[#e9e9e9]'}>Home</button>
            </Link>
            <Link href="/create">
              <button className={currentRoute === '/create' ? activeStyles : 'h-full py-2 px-3 rounded-3xl cursor-pointer hover:bg-[#e9e9e9]'}>Create</button>
            </Link>
          </div>
        </div>

        {router.route === "/" ? <Searchbar setShowSearchBar={setShowSearchBar} showSearchBar={showSearchBar}/> : null}
        

        <div className='flex flex-row items-center gap-1 lg:gap-3 h-full'>
          {showSearchBar ? (
            null
          ) : router.route === "/" ? (
            <FaSearch 
              className='lg:hidden mr-2 cursor-pointer'
              onClick={() => setShowSearchBar(true)}
              size={20}
            />  
          ): null}

          <Link href={`/profile/${user?.uid}`}>
            {userDetails?.image ? (
              <div>
              <Image 
                alt="profile pic"
                src={urlFor(userDetails?.image).url()}
                className="w-8 h-8 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 rounded-3xl cursor-pointer"
                width={50}
                height={50}
              />
              </div>
            ) : (
             <button 
                type='button'
                className='w-8 h-8 sm:h-10 sm:w-10 rounded-3xl hover:bg-[#e9e9e9] cursor-pointer'
              >
                {userDetails?.userName ? userDetails?.userName[0] : 'P'}
              </button> 
            )}
            
          </Link>

          <button 
            type='button'
            className='h-8 w-8 rounded-3xl cursor-pointer flex justify-center items-center bg-gray-100 hover:bg-gray-200'
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <AiOutlineDown fontWeight={40} size={20} />
          </button>
        </div>
        
        {showDropdown ? <Dropdown setShowTuneFeed={setShowTuneFeed} setShowDropdown={setShowDropdown} /> : null}
      </div>
    </div>


    {showTuneFeed ? <TuneFeed userDetails={userDetails} setShowTuneFeed={setShowTuneFeed} /> : null}
    </>
  );
}

export default Navbar;
