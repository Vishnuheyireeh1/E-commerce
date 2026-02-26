import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get both token and role from storage
  const isLoggedIn = localStorage.getItem('token'); 
  const isAdmin = localStorage.getItem('role') === 'admin'; 

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Clear role on logout
    navigate('/login');
  };

  return (
    <nav className='flex items-center justify-between px-8 py-6 bg-[#FAF9F6]/80 backdrop-blur-md sticky top-0 z-[100] border-b border-gray-100'>
      
      <div 
        onClick={() => navigate('/')} 
        className='text-2xl font-serif text-gray-950 tracking-tighter cursor-pointer group'
      >
        Heyireeh <span className='text-gray-400 group-hover:text-gray-600 transition-colors'>.</span> 
      </div>

      <div className='hidden md:flex items-center space-x-12 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400'>
        <div className='relative group'>
          <Link 
            to="/" 
            className={`${isActive('/') ? 'text-gray-950' : 'hover:text-gray-950'} transition-all duration-300`}
          >
            Home
          </Link>
          {isActive('/') && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-950 rounded-full"></span>}
        </div>

        <div className='relative group'>
          <Link 
            to="/shop" 
            className={`${isActive('/shop') ? 'text-gray-950' : 'hover:text-gray-950'} transition-all duration-300`}
          >
            Shop
          </Link>
          {isActive('/shop') && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-950 rounded-full"></span>}
        </div>

        {/* User Specific Link */}
        {isLoggedIn && !isAdmin && (
          <div className='relative group'>
            <Link 
              to="/orders" 
              className={`${isActive('/orders') ? 'text-gray-950' : 'hover:text-gray-950'} transition-all duration-300`}
            >
              My Orders
            </Link>
            {isActive('/orders') && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-950 rounded-full"></span>}
          </div>
        )}

        {/* Admin Specific Link - NEW */}
        {isLoggedIn && isAdmin && (
          <div className='relative group'>
            <Link 
              to="/admin-dashboard" 
              className={`${isActive('/admin-dashboard') ? 'text-indigo-600' : 'text-gray-950 hover:text-indigo-600'} transition-all duration-300`}
            >
              Master Dashboard
            </Link>
            {isActive('/admin-dashboard') && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"></span>}
          </div>
        )}
      </div>

      <div className='flex items-center space-x-8'>
        {!isLoggedIn ? (
          <button 
            onClick={() => navigate('/login')} 
            className='px-8 py-2.5 text-[10px] uppercase tracking-widest font-bold text-white bg-gray-950 hover:bg-black transition-all shadow-sm'
          >
            Sign In
          </button>
        ) : (
          <div className="flex items-center space-x-6">
            <span className={`text-[10px] uppercase tracking-widest font-bold ${isAdmin ? 'text-indigo-600' : 'text-gray-400 font-light'}`}>
              {isAdmin ? 'Administrator' : 'Member'}
            </span>
            <span className="text-gray-200">|</span>
            <button 
              onClick={handleLogout} 
              className='text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600 transition-colors'
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>  
  );
};

export default Navbar;