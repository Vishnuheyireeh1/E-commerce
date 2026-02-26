import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminProductAdd = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCatSubs, setSelectedCatSubs] = useState([]); // To store subs of picked category
  const [editId, setEditId] = useState(null);
  
  const [form, setForm] = useState({ 
    name: '', price: '', category: '', subCategory: '', stock: '', description: '', image: '' 
  });
  
  const API_URL = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const catRes = await axios.get(`${API_URL}/categories`);
      setCategories(catRes.data);
      const prodRes = await axios.get(`${API_URL}/products`);
      setProducts(prodRes.data.products);
    } catch (err) {
      toast.error("Error loading data");
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Handle Category Change to update subcategory list
  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const category = categories.find(c => c._id === catId);
    
    setForm({ ...form, category: catId, subCategory: '' }); // Reset subcat on cat change
    setSelectedCatSubs(category ? category.subCategories : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/products/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Product Updated!");
      } else {
        await axios.post(`${API_URL}/products`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Product Created!");
      }
      setEditId(null);
      setForm({ name: '', price: '', category: '', subCategory: '', stock: '', description: '', image: '' });
      fetchData();
    } catch (err) {
      toast.error("Operation failed. Check all fields.");
    }
  };

  const startEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      price: p.price,
      category: p.category._id,
      subCategory: p.subCategory,
      stock: p.stock,
      description: p.description,
      image: p.image
    });
    // Trigger subcategory population for editing
    const category = categories.find(c => c._id === p.category._id);
    setSelectedCatSubs(category ? category.subCategories : []);
    window.scrollTo(0,0);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete product?")) {
      await axios.delete(`${API_URL}/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 border border-gray-100">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
          {editId ? 'Edit Product' : 'Add New Product'}
        </h3>
        
        <input value={form.name} placeholder="Name" className="w-full border-b py-2 bg-transparent" onChange={e => setForm({...form, name: e.target.value})} required />
        
        <textarea value={form.description} placeholder="Description" className="w-full border-b py-2 bg-transparent" onChange={e => setForm({...form, description: e.target.value})} required />
        
        <div className="flex gap-4">
          <input value={form.price} type="number" placeholder="Price" className="w-1/2 border-b py-2 bg-transparent" onChange={e => setForm({...form, price: e.target.value})} required />
          <input value={form.stock} type="number" placeholder="Stock" className="w-1/2 border-b py-2 bg-transparent" onChange={e => setForm({...form, stock: e.target.value})} required />
        </div>

        <div className="flex gap-4">
          {/* Main Category */}
          <select value={form.category} className="w-1/2 border-b py-2 bg-transparent" onChange={handleCategoryChange} required>
            <option value="">Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          {/* Dynamic Subcategory */}
          <select value={form.subCategory} className="w-1/2 border-b py-2 bg-transparent" onChange={e => setForm({...form, subCategory: e.target.value})} required disabled={!form.category}>
            <option value="">Subcategory</option>
            {selectedCatSubs.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
          </select>
        </div>

        <input value={form.image} placeholder="Image URL" className="w-full border-b py-2 bg-transparent" onChange={e => setForm({...form, image: e.target.value})} required />
        
        <div className="flex gap-2">
            <button className="bg-black text-white w-full py-4 text-[10px] uppercase font-bold">{editId ? 'Update' : 'Publish'}</button>
            {editId && <button type="button" onClick={() => window.location.reload()} className="border border-black w-full py-4 text-[10px] uppercase font-bold">Cancel</button>}
        </div>
      </form>

      {/* Inventory List Section */}
      <div className="space-y-4">
         <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Inventory</h3>
         <div className="max-h-[500px] overflow-y-auto space-y-2">
            {products.map(p => (
            <div key={p._id} className="flex items-center gap-4 p-3 border hover:border-black group">
                <img src={p.image} className="w-12 h-12 object-cover grayscale group-hover:grayscale-0" alt="" />
                <div className="flex-1">
                <p className="text-xs font-bold uppercase">{p.name}</p>
                <p className="text-[9px] text-gray-400">{p.category?.name} {p.subCategory && `> ${p.subCategory}`}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => startEdit(p)} className="text-[10px] font-bold uppercase hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-[10px] font-bold uppercase text-red-400 hover:text-red-600">Delete</button>
                </div>
            </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AdminProductAdd;