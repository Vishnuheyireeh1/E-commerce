import React from 'react'

const Hero = () => {
  return (
    <div className='relative bg-gray-50 overflow-hidden h-screen'>
    <div className='max-w-7xl mx-auto px-8 py-20 flex flex-col md:flex-row items-center'>
    <div className='md:w-1/2 mb-12 md:mb-0'>
        <h1 className='text-5xl md:text-6xl font-medium font-serif text-gray-600 leading-tight mb-6'>
            Upgrade Your <br /><span className='text-gray-900'>LifeStyle.</span> 
        </h1>
        <p className='text-lg text-gray-600 mb-8 max-w-lg font-serif'>
            Grab now the latest trends with our curated collections.
        </p>

        <div className='flex space-x-4'>
            <button className='px-5 py-2 bg-gray-900 cursor-pointer text-white font-bold rounded-full hover:bg-gray-800 transition'>
                Shop now
            </button>
            <button className='px-5 py-2 bg-gray-600 cursor-pointer text-white font-bold rounded-full hover:bg-gray-800 transition'>
                Contact
            </button>
        </div>
    </div>

    <div className='md:w-1/2 flex justify-center relative'>
        <div className='w-72 h-92 '>
            <img src="https://static1.squarespace.com/static/623b5b22707a2440da789d58/623b6eec5ac3595c61a6deb6/631141c9ea63f6280b2bb536/1662144470216/21.png?format=1500w" alt="" />
        </div>
    </div>
    </div>
    </div>
  )
}

export default Hero