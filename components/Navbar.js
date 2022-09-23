import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineDown } from "react-icons/ai";

import Searchbar from './Searchbar';
import logo from '../assets/pinterest-logo.png';

const activeStyles = 'bg-black text-white h-full py-2 px-3 rounded-3xl cursor-pointer';
const activeStylesProfile = 'bg-black text-white border-[1px] border-black h-full w-12 rounded-3xl';

const Navbar = () => {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <div className={currentRoute === '/login' ? 'hidden' : 'fixed w-screen bg-white z-10'}>
      <div className='w-full h-full flex flex-row justify-between items-center py-5 px-2.5'>
        <Link href="/" className="cursor-pointer rounded-3xl hover:bg-[#e9e9e9]">
          <a className="cursor-pointer rounded-3xl hover:bg-[#e9e9e9]">
            <Image src={logo} alt="pin-it-icon" width={50} height={50} /> 
          </a>
        </Link>
        
        <div className='flex flex-row h-full text-lg'>
          <Link href="/">
            <button className={currentRoute === '/' ? activeStyles : 'border-[1px] border-black h-full py-2 px-3 rounded-3xl cursor-pointer hover:bg-[#e9e9e9]'}>Home</button>
          </Link>
          <Link href="/create">
            <button className={currentRoute === '/create' ? activeStyles : 'border-[1px] border-black h-full py-2 px-3 rounded-3xl cursor-pointer hover:bg-[#e9e9e9]'}>Create</button>
          </Link>
        </div>
        <Searchbar/>
        <Link href="/profile/someId">
          <button className={currentRoute === '/profile/[id]' ? activeStylesProfile : 'border-[1px] border-black h-10 w-12 rounded-3xl hover:bg-[#e9e9e9]'}>
            A
          </button>
        </Link>
        <button className='border-[1px] border-black h-10 w-12 rounded-3xl cursor-pointer flex justify-center items-center hover:bg-[#e9e9e9]'>
          <AiOutlineDown fontWeight={40} />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
