import React from 'react'
import { useState } from 'react'

const Navbar = () => {
    const [isOpen,setIsOPen] = useState(false);

    const [ isLoginView,setIsLoginView ] = useState(true)
  return (
    <nav className='flex items-center justify-between px-8 py-4 bg-white sticky shadow-xl top-0 z-100' >
        <div className='text-3xl font-medium text-gray-950 tracking-tight cursor-pointer'>
            Unisex <span className='text-gray-600'>Store</span> 
        </div>

    <div className='hidden md:flex space-x-8 font-medium text-gray-500'>
    <a href="#" className='hover:text-gray-950 transition'>Home</a>
    <a href="#" className='hover:text-gray-950 transition'>Shop</a>
    <a href="#" className='hover:text-gray-950 transition'>Contact</a>
    </div>


    <div className='flex items-center space-x-5'>
    <button className='px-3 py-2 text-sm  cursor-pointer font-semibold text-white bg-indigo-500 rounded-full hover:bg-indigo-700 transition shadow-md'>
        Login
    </button>
    </div>
    </nav>  
)
}

export default Navbar