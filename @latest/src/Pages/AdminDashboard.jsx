import React, { useState } from 'react';
import AdminOrders from "../Components/AdminOrders";
import AdminCategoryAdd from '../Components/AdminCategoryAdd';
import AdminProductAdd from '../Components/AdminProductAdd';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'orders', label: 'All Orders' },
    { id: 'categories', label: 'Categories' },
    { id: 'products', label: 'Products' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-serif text-gray-950">Heyireeh Management</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mt-2">Executive Control Panel</p>
        </header>

        <div className="flex border-b border-gray-200 mb-8 space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all ${
                activeTab === tab.id ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white p-6 shadow-sm border border-gray-100 min-h-[600px]">
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'categories' && <AdminCategoryAdd />}
          {activeTab === 'products' && <AdminProductAdd />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;