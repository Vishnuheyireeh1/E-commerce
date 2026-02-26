import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { product } = state || {};

  const API_URL = import.meta.env.VITE_API_URI;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState({
    fullName: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleProcessOrder = async (simulationStatus) => {
    // 1. Validation Logic with Toasts
    if (!shippingData.fullName.trim()) return toast.error("Full Name is required, bruh!");
    if (!shippingData.address.trim()) return toast.error("Please provide a street address.");
    if (!shippingData.city.trim()) return toast.error("City field cannot be empty.");
    if (!shippingData.pincode.trim()) return toast.error("Pincode is required for shipping.");
    if (!shippingData.phone.trim()) return toast.error("We need your contact number.");

    // 2. Simulate Bank Rejection
    if (simulationStatus === 'failure') {
      toast.error("Transaction Declined by Bank. Try another method.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Verifying transaction with bank...", {
        position: "top-right",
        theme: "dark"
    });

    try {
      // 3. Prepare Payload
      const orderPayload = {
        productId: product._id,
        shippingAddress: `${shippingData.fullName}, ${shippingData.address}, ${shippingData.city} - ${shippingData.pincode}`,
        phoneNumber: shippingData.phone,
        totalAmount: product.price,
        paymentStatus: 'Success' 
      };

      const config = {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      };

      // 4. API Call
      const res = await axios.post(`${API_URL}/orders`, orderPayload, config);

      if (res.status === 201) {
        toast.update(toastId, { 
            render: "Purchase Successful! Stock updated.", 
            type: "success", 
            isLoading: false, 
            autoClose: 3000 
        });
        
        setTimeout(() => navigate('/orders'), 1500); 
      }
    } catch (err) {
      setIsProcessing(false);
      const errorMsg = err.response?.data?.message || "Order failed. Check your connection.";
      
      toast.update(toastId, { 
        render: errorMsg, 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6]">
        <p className="font-serif text-gray-400 mb-4">No product selected for purchase.</p>
        <button onClick={() => navigate('/shop')} className="underline font-bold text-xs tracking-widest uppercase">Return to Shop</button>
      </div>
    );
  }

  const imageUrl = product.image?.startsWith('http') ? product.image : `${BASE_URL}${product.image}`;

  return (
    <div className='min-h-screen bg-[#FAF9F6] pt-24 pb-20 px-6'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12'>
        
        {/* LEFT: Shipping & Payment Method */}
        <div className='space-y-8'>
          <div className='bg-white p-8 shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-serif mb-6'>Shipping Information</h2>
            <div className='grid grid-cols-1 gap-5'>
              <input name="fullName" placeholder="Full Name" onChange={handleChange} className='border-b border-gray-200 py-2 outline-none focus:border-black text-xs uppercase tracking-widest'/>
              <input name="address" placeholder="Street Address" onChange={handleChange} className='border-b border-gray-200 py-2 outline-none focus:border-black text-xs uppercase tracking-widest'/>
              <div className='grid grid-cols-2 gap-4'>
                <input name="city" placeholder="City" onChange={handleChange} className='border-b border-gray-200 py-2 outline-none focus:border-black text-xs uppercase tracking-widest'/>
                <input name="pincode" placeholder="Pincode" onChange={handleChange} className='border-b border-gray-200 py-2 outline-none focus:border-black text-xs uppercase tracking-widest'/>
              </div>
              <input name="phone" placeholder="Phone Number" onChange={handleChange} className='border-b border-gray-200 py-2 outline-none focus:border-black text-xs uppercase tracking-widest'/>
            </div>
          </div>

          <div className='bg-white p-8 shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-serif mb-6'>Payment Method</h2>
            <div className='space-y-3'>
              {['UPI', 'Card', 'Net Banking'].map((method) => (
                <label key={method} className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${paymentMethod === method ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                  <span className='text-[10px] uppercase tracking-widest font-bold'>{method}</span>
                  <input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className='accent-black'/>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className='lg:sticky lg:top-24 h-fit'>
          <div className='bg-gray-950 text-white p-10 shadow-2xl'>
            <h3 className='text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-8'>Final Summary</h3>
            <div className='flex items-center space-x-6 mb-8'>
              <img src={imageUrl} className='w-20 h-24 object-cover grayscale opacity-70' alt="" />
              <div>
                <p className='font-serif text-lg'>{product.name}</p>
                <p className='text-gray-400 text-[10px] uppercase tracking-widest mt-1'>{product.subCategory}</p>
                <p className='text-white text-xs mt-2'>₹{product.price?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className='border-t border-gray-800 pt-6 space-y-2'>
              <div className='flex justify-between text-[10px] uppercase tracking-widest text-gray-400'>
                <span>Subtotal</span>
                <span>₹{product.price?.toLocaleString('en-IN')}</span>
              </div>
              <div className='flex justify-between text-[10px] uppercase tracking-widest text-gray-400'>
                <span>Shipping</span>
                <span className='text-green-500'>Free</span>
              </div>
              <div className='flex justify-between items-baseline pt-4 border-t border-gray-800'>
                <span className='text-[10px] uppercase tracking-widest font-bold'>Total Payable</span>
                <span className='text-3xl font-serif text-white'>₹{product.price?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className='mt-10 grid grid-cols-2 gap-4'>
              <button 
                onClick={() => handleProcessOrder('success')}
                disabled={isProcessing}
                className='bg-white text-black py-4 text-[9px] uppercase tracking-widest font-bold hover:bg-gray-200 transition-all disabled:bg-gray-400'
              >
                {isProcessing ? 'Verifying...' : 'Confirm & Pay'}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;