import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URI;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/auth/login`, { 
          email: formData.email, 
          password: formData.password 
        });

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('role', res.data.user.role); 

        toast.success(`Welcome back, ${res.data.user.name}`);

        if (res.data.user.role === 'admin') {
          console.log("Admin detected. Redirecting to Admin Dashboard...");
          setTimeout(() => navigate('/admin-dashboard'), 1500); 
        } else {
          console.log("User detected. Redirecting to Shop...");
          setTimeout(() => navigate('/shop'), 1500);
        }

      } else {
        const res = await axios.post(`${API_URL}/auth/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        toast.success(res.data.message || "Account created!");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Auth Error:", err.response?.data || err.message);
      const errMsg = err.response?.data?.message || "Something went wrong";
      toast.error(errMsg);
    }
  };

  return (
    <div className='min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 relative'>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
      <div className='w-full max-w-md z-10'>
        <div className='bg-white p-10 shadow-2xl border border-gray-100'>
          
          <div className='text-center mb-10'>
            <h2 className='text-4xl font-serif text-gray-950 mb-2'>
              {isLogin ? 'Sign In' : 'Join Us'}
            </h2>
            <p className='text-xs uppercase tracking-[0.2em] text-gray-400 font-bold'>
              {isLogin ? 'Access your curated lifestyle' : 'Start your journey with Heyireeh'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {!isLogin && (
              <div className='space-y-1'>
                <label className='text-[10px] uppercase tracking-widest text-gray-500 font-bold'>Full Name</label>
                <input
                  type='text' name='name' required
                  className='w-full border-b border-gray-200 py-3 focus:border-gray-950 outline-none transition-colors bg-transparent text-[11px] tracking-widest uppercase'
                  placeholder='John Doe'
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>
            )}

            <div className='space-y-1'>
              <label className='text-[10px] uppercase tracking-widest text-gray-500 font-bold'>Email Address</label>
              <input
                type='email' name='email' required
                className='w-full border-b border-gray-200 py-3 focus:border-gray-950 outline-none transition-colors bg-transparent text-[11px] tracking-widest uppercase'
                placeholder='hello@heyireeh.com'
                onChange={handleChange}
                value={formData.email}
              />
            </div>

            <div className='space-y-1'>
              <label className='text-[10px] uppercase tracking-widest text-gray-500 font-bold'>Password</label>
              <input
                type='password' name='password' required
                className='w-full border-b border-gray-200 py-3 focus:border-gray-950 outline-none transition-colors bg-transparent'
                placeholder='••••••••'
                onChange={handleChange}
                value={formData.password}
              />
            </div>

            <button type="submit" className='w-full bg-gray-950 text-white py-4 mt-4 text-xs uppercase tracking-widest font-bold hover:bg-black transition-all'>
              {isLogin ? 'Authenticate' : 'Register'}
            </button>
          </form>

          <div className='mt-8 text-center'>
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className='text-xs text-gray-500 hover:text-gray-950 transition-colors uppercase tracking-widest font-bold underline underline-offset-4'
            >
              {isLogin ? "Don't have an account? Register" : "Already a member? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;