import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URI;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };
        const res = await axios.get(`${API_URL}/orders/myorders`, config);
        setOrders(res.data);
      } catch (err) {
        console.error("Fetch Orders Error:", err);
        toast.error("Failed to load your archive history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_URL]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400x533?text=No+Image";
    return img.startsWith('http') ? img : `${BASE_URL}${img}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 animate-pulse">Loading Archive...</p>
      </div>
    );
  }

  // View 1: Order History List
  if (!selectedOrder) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-serif text-gray-950 uppercase tracking-tighter">My Archive</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold mt-2">Personal Purchase History</p>
          </div>

          {orders.length === 0 ? (
            <div className="py-20 text-center border-t border-gray-200">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Your archive is empty.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Ref No.</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Item</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Date</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Status</th>
                    <th className="py-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="group hover:bg-white transition-colors">
                      <td className="py-8 font-mono text-[10px] text-gray-500 uppercase">{order._id.slice(-8)}</td>
                      <td className="py-8">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-serif text-gray-900">{order.product?.name || "Product"}</span>
                        </div>
                      </td>
                      <td className="py-8 text-xs text-gray-500 font-light">
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-8 text-sm font-medium text-gray-950">
                        {formatCurrency(order.product?.price)}
                      </td>
                      <td className="py-8">
                        <span className={`text-[9px] uppercase tracking-widest px-3 py-1 font-bold ${
                          order.status === 'Delivered' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-8 text-right">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-[10px] uppercase tracking-widest font-bold border-b border-gray-950 pb-1 hover:text-gray-400 hover:border-gray-400 transition-all"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // View 2: Individual Order Details (Receipt Style)
  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto bg-white p-12 shadow-2xl border border-gray-100">
        <button 
          onClick={() => setSelectedOrder(null)}
          className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-gray-950 mb-12 flex items-center"
        >
          ← Return to Archive
        </button>

        <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Transaction Receipt</p>
            <h2 className="text-2xl font-serif text-gray-950 mt-2 uppercase">Order {selectedOrder._id.slice(-12)}</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Issue Date</p>
            <p className="text-sm text-gray-600 mt-2">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center space-x-8">
            {/* Display item details */}
            <div>
              <h3 className="text-xl font-serif text-gray-950 uppercase">{selectedOrder.product?.name}</h3>
              <p className="text-gray-500 font-light mt-1 text-xs">Authentic Archive Selection</p>
              <p className="text-lg font-medium mt-4">{formatCurrency(selectedOrder.product?.price)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-gray-100">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Destination</p>
              <p className="text-xs text-gray-600 leading-relaxed font-light uppercase">{selectedOrder.shippingAddress}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Payment</p>
              <p className="text-[10px] text-gray-600 font-light uppercase">
                Status: <span className="text-green-600 font-bold">{selectedOrder.paymentStatus}</span>
              </p>
              <p className="text-[10px] text-gray-600 font-light mt-1 uppercase">Method: Digital Transaction</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-gray-950 flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-widest font-bold">Net Amount</span>
          <span className="text-3xl font-serif text-gray-950">{formatCurrency(selectedOrder.product?.price)}</span>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;