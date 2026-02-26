import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminCategoryAdd = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [subCategories, setSubCategories] = useState('');
  const [editId, setEditId] = useState(null); 
  
  const API_URL = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem('token');

  const fetchCats = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => { fetchCats(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const subArray = subCategories.split(',').map(s => s.trim()).filter(s => s !== "");

    try {
      if (editId) {
        await axios.put(`${API_URL}/categories/${editId}`, 
          { name, subCategories: subArray }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Category Updated");
      } else {
        await axios.post(`${API_URL}/categories`, 
          { name, subCategories: subArray }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Category Created");
      }
      
      setName('');
      setSubCategories('');
      setEditId(null);
      fetchCats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const startEdit = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
    setSubCategories(cat.subCategories.join(', ')); 
    window.scrollTo(0, 0); 
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await axios.delete(`${API_URL}/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.info("Category Deleted");
        fetchCats();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="max-w-md space-y-4 bg-gray-50 p-6 border border-gray-100">
        <h3 className="text-sm font-bold uppercase tracking-widest">
          {editId ? 'Edit Category' : 'Add New Category'}
        </h3>
        
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Category Name</label>
          <input 
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Luxury Suits" required
            className="w-full border-b bg-transparent py-2 outline-none focus:border-black"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Subcategories (Comma separated)</label>
          <input 
            value={subCategories} onChange={(e) => setSubCategories(e.target.value)}
            placeholder="e.g. Slim Fit, Tuxedo, Double Breasted" 
            className="w-full border-b bg-transparent py-2 outline-none focus:border-black text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button className="bg-black text-white px-6 py-2 text-[10px] uppercase font-bold hover:bg-gray-800 transition-all">
            {editId ? 'Update Category' : 'Save Category'}
          </button>
          
          {editId && (
            <button 
              type="button" 
              onClick={() => { setEditId(null); setName(''); setSubCategories(''); }}
              className="border border-black px-6 py-2 text-[10px] uppercase font-bold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Categories List */}
      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-2">Existing Categories</h3>
        {categories.length === 0 && <p className="text-xs text-gray-400">No categories found.</p>}
        
        {categories.map(cat => (
          <div key={cat._id} className="p-4 border bg-white flex justify-between items-center group hover:border-black transition-all">
            <div>
              <span className="text-sm font-bold">{cat.name}</span>
              <div className="flex gap-1 mt-1">
                {cat.subCategories.map((sub, i) => (
                  <span key={i} className="text-[9px] bg-gray-100 px-2 py-0.5 text-gray-500 rounded-sm">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => startEdit(cat)} 
                className="text-gray-400 hover:text-black text-[10px] uppercase font-bold transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(cat._id)} 
                className="text-red-300 hover:text-red-600 text-[10px] uppercase font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoryAdd;