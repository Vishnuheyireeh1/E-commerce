import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem('token');

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      // This hits the GET /api/orders route you just added
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load master list, bruh!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center font-serif uppercase tracking-widest text-gray-400">
      Syncing Database...
    </div>
  );

  return (
    <div className="bg-white border border-gray-100 shadow-2xl overflow-hidden">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-3xl font-serif text-gray-950 tracking-tighter uppercase">Order Archive</h2>
          <p className="text-[10px] text-gray-400 tracking-widest mt-1">TOTAL TRANSACTIONS: {orders.length}</p>
        </div>
        <button 
          onClick={fetchAllOrders}
          className="text-[10px] border border-gray-950 px-6 py-2 hover:bg-black hover:text-white transition-all font-bold tracking-widest uppercase"
        >
          Refresh Data
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[10px] uppercase tracking-widest">
          <thead className="bg-gray-950 text-white">
            <tr>
              <th className="p-5 font-bold">ID</th>
              <th className="p-5 font-bold">Client / Contact</th>
              <th className="p-5 font-bold">Product Details</th>
              <th className="p-5 font-bold">Shipping Destination</th>
              <th className="p-5 font-bold">Total</th>
              <th className="p-5 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50/80 transition-all group">
                {/* Order ID */}
                <td className="p-5 font-mono text-gray-400 group-hover:text-black">
                  #{order._id.slice(-6)}
                </td>

                {/* Client Info */}
                <td className="p-5">
                  <p className="font-bold text-gray-950">{order.user?.name || 'Unknown'}</p>
                  <p className="text-[9px] lowercase tracking-normal text-gray-400">{order.user?.email}</p>
                  <p className="text-[9px] text-gray-500 mt-1">{order.phoneNumber}</p>
                </td>

                {/* Product Name */}
                <td className="p-5">
                  <span className="bg-gray-100 px-2 py-1 text-gray-600 font-semibold italic">
                    {order.product.name}
                  </span>
                </td>

                {/* Address */}
                <td className="p-5 text-gray-500 normal-case tracking-tight max-w-[200px]">
                  {order.shippingAddress}
                </td>

                {/* Price */}
                <td className="p-5 font-bold text-gray-950">
                  ₹{order.product.price?.toLocaleString('en-IN')}
                </td>

                {/* Status Badge */}
                <td className="p-5">
                  <span className={`inline-block w-full text-center py-2 px-3 font-bold text-[9px] rounded-sm ${
                    order.status === 'Processing' 
                    ? 'bg-orange-50 text-orange-600 border border-orange-100' 
                    : 'bg-green-50 text-green-700 border border-green-100'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {orders.length === 0 && (
        <div className="p-20 text-center font-serif text-gray-300 italic">
          The archive is currently empty.
        </div>
      )}
    </div>
  );
};

export default AdminOrders;