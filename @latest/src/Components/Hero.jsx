import React from 'react';

const Hero = () => {
  return (
    <div className='relative bg-[#FAF9F6] overflow-hidden min-h-screen flex items-center selection:bg-gray-200'>
      
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 text-[40rem] font-serif font-bold text-gray-200/30 select-none z-0 pointer-events-none">
        H
      </div>

      <div className='max-w-7xl mx-auto px-6 md:px-12  w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10'>
        
        {/* Left Side: The "Vibe" Side */}
        <div className='flex flex-col space-y-10 md:pr-12'>
          
          {/* 1. Minimalist Badge */}
          <div className='flex items-center space-x-4 animate-fade-in'>
            <div className='h-[1px] w-8 bg-gray-900' />
            <span className='text-xs uppercase tracking-[0.4em] text-gray-500 font-bold'>
              A New Era of Style
            </span>
          </div>

          {/* 2. Bold, Designer Typography */}
          <div className='space-y-2'>
            <h1 className='text-7xl md:text-9xl font-serif text-gray-950 leading-none tracking-tighter'>
              Heyireeh
            </h1>
            <div className='flex items-baseline space-x-4'>
               <div className='hidden md:block h-[1px] flex-grow bg-gray-300' />
               <h2 className='text-5xl md:text-7xl font-serif italic font-light text-gray-400'>
                Collection.
               </h2>
            </div>
          </div>

          {/* 3. Refined Copy */}
          <p className='text-lg md:text-xl text-gray-600 max-w-sm font-light leading-relaxed border-l-2 border-gray-100 pl-6'>
            Redefining the modern wardrobe through intentional design and effortless sophistication. 
          </p>

          {/* 4. High-End CTA buttons */}
          <div className='flex flex-wrap items-center gap-8 pt-4'>
            <button className='group relative overflow-hidden bg-gray-950 px-12 py-5 text-white transition-all duration-500'>
              <span className='relative z-10 text-xs uppercase tracking-widest font-bold'>
                Explore Now
              </span>
              <div className='absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
            </button>
            
            <button className='group flex items-center space-x-3 text-xs uppercase tracking-widest font-bold text-gray-900'>
              <span>View Lookbook</span>
              <span className='group-hover:translate-x-2 transition-transform duration-300'>→</span>
            </button>
          </div>
          
          {/* 5. Subtle Social/Metric Proof */}
          <div className='pt-8 flex items-center space-x-12'>
             <div>
                <p className='text-xl font-serif text-gray-900'>24'</p>
                <p className='text-[10px] uppercase tracking-tighter text-gray-400'>Winter Series</p>
             </div>
             <div className='w-[1px] h-8 bg-gray-200' />
             <div>
                <p className='text-xl font-serif text-gray-900'>01</p>
                <p className='text-[10px] uppercase tracking-tighter text-gray-400'>Limited Edition</p>
             </div>
          </div>
        </div>

        {/* Right Side: The Image (Simplified and cleaner) */}
        <div className='relative group'>
          <div className='absolute -inset-4 border border-gray-200 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700' />
          <div className='relative overflow-hidden aspect-[4/5] bg-gray-100 shadow-3xl'>
            <img 
              src="https://static1.squarespace.com/static/623b5b22707a2440da789d58/623b6eec5ac3595c61a6deb6/631141c9ea63f6280b2bb536/1662144470216/21.png?format=1500w" 
              alt="Heyireeh Editorial" 
              className='w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 hover:scale-105'
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;