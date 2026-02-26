import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Shop = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const selectedCat = searchParams.get('category') || "All";
  const selectedSub = searchParams.get('subCategory') || "";
  const search = searchParams.get('search') || "";
  const sort = searchParams.get('sort') || "newest";
  const currentPage = parseInt(searchParams.get('page')) || 1;

  const API_URL = import.meta.env.VITE_API_URI;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchShopData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Categories
      const catRes = await axios.get(`${API_URL}/categories`);
      setCategories(catRes.data);

      // 2. Fetch Products
      const params = {
        page: currentPage,
        search,
        sort,
        category: selectedCat === "All" ? "" : selectedCat,
        subCategory: selectedSub
      };
      
      console.log("Requesting with Params:", params);
      const prodRes = await axios.get(`${API_URL}/products`, { params });
      
      console.log("Data fetched successfully:", prodRes.data.products);
      setProducts(prodRes.data.products);
      setTotalPages(prodRes.data.totalPages);
    } catch (err) {
      console.error("Shop Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, [searchParams]);

  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, ...newParams, page: 1 });
  };

  const handleCategorySelect = (catId) => {
    if (catId === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId }); 
    }
  };

  const handleSubSelect = (e, subName) => {
    e.stopPropagation(); 
    updateParams({ subCategory: subName });
  };

  return (
    <div className='min-h-screen bg-[#FAF9F6] pt-12 pb-20 px-6 md:px-12'>
      <div className='max-w-7xl mx-auto'>
        
        {/* HEADER */}
        <div className='flex flex-col md:flex-row justify-between items-end mb-12 gap-6'>
          <div className='space-y-2'>
            <h1 className='text-6xl font-serif text-gray-900 uppercase tracking-tighter'>Archive</h1>
            <div className='flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold'>
                <span className={selectedCat === "All" ? "text-gray-400" : "text-black"}>
                  {selectedCat === "All" ? "All Collections" : categories.find(c => c._id === selectedCat)?.name || "Category"}
                </span>
                {selectedSub && <span className='text-black'> / {selectedSub}</span>}
            </div>
          </div>
          
          <div className='w-full md:w-96'>
            <input 
              type="text" 
              placeholder="SEARCH THE ARCHIVE..." 
              value={search}
              className='w-full bg-transparent border-b border-gray-300 py-2 outline-none text-xs tracking-widest focus:border-gray-950 transition-all'
              onChange={(e) => updateParams({ search: e.target.value })}
            />
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-16'>
          
          {/* SIDEBAR */}
          <div className='w-full md:w-48 space-y-10'>
            <div>
              <h3 className='text-[10px] uppercase tracking-widest font-bold mb-6 text-gray-950'>Categories</h3>
              <ul className='space-y-5 text-sm'>
                <li 
                  onClick={() => handleCategorySelect("All")}
                  className={`cursor-pointer transition-all ${selectedCat === "All" ? 'text-black font-bold' : 'text-gray-400 hover:text-black'}`}
                >
                  {selectedCat === "All" && "— "} ALL ITEMS
                </li>

                {categories.map(cat => (
                  <li key={cat._id} className="space-y-4">
                    <div 
                      onClick={() => handleCategorySelect(cat._id)}
                      className={`cursor-pointer transition-all uppercase text-[12px] tracking-widest ${selectedCat === cat._id ? 'text-black font-bold' : 'text-gray-400 hover:text-black'}`}
                    >
                      {selectedCat === cat._id && "— "} {cat.name}
                    </div>

                    {/* SUBCATEGORIES: Only show for active category */}
                    {selectedCat === cat._id && (
                      <ul className='ml-4 space-y-3 border-l border-gray-200 pl-4'>
                        {cat.subCategories.map((sub, i) => (
                          <li 
                            key={i} 
                            onClick={(e) => handleSubSelect(e, sub)}
                            className={`cursor-pointer text-[11px] uppercase tracking-tight transition-all ${selectedSub === sub ? 'text-black font-bold underline underline-offset-4' : 'text-gray-400 hover:text-black'}`}
                          >
                            {sub}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='text-[10px] uppercase tracking-widest font-bold mb-4 text-gray-950'>Sort By</h3>
              <select 
                value={sort}
                className='bg-transparent border-b border-gray-200 py-2 text-[10px] uppercase tracking-widest w-full outline-none cursor-pointer' 
                onChange={(e) => updateParams({ sort: e.target.value })}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low — High</option>
                <option value="price-high">Price: High — Low</option>
              </select>
            </div>
          </div>

          {/* GRID */}
          <div className='flex-1'>
            {loading ? (
                <div className="h-64 flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-400">Loading Archive...</div>
            ) : products.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">No items found in this archive selection.</p>
                  <button onClick={() => handleCategorySelect("All")} className="text-[10px] border-b border-black uppercase tracking-widest">View All Items</button>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16'>
                {products.map((p) => {
                    const imgUrl = p.image?.startsWith('http') ? p.image : `${BASE_URL}${p.image}`;
                    return (
                        <div key={p._id} className='group cursor-pointer' onClick={() => navigate(`/product/${p._id}`)}>
                            <div className='relative aspect-[3/4] overflow-hidden bg-gray-100'>
                                <img 
                                  src={imgUrl} 
                                  alt={p.name}
                                  className='w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105'
                                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x533?text=Archive+Image"; }}
                                />
                                {p.stock <= 0 && (
                                    <div className="absolute top-2 right-2 bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-widest">Sold Out</div>
                                )}
                            </div>
                            <div className='mt-6 flex justify-between items-start'>
                                <div>
                                    <h2 className='text-[11px] uppercase tracking-widest font-bold text-gray-950'>{p.name}</h2>
                                    <p className='text-[9px] text-gray-400 uppercase mt-1 tracking-tighter'>{p.subCategory || p.category?.name}</p>
                                </div>
                                <p className='text-sm font-serif'>₹{p.price?.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    );
                })}
                </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className='mt-24 flex justify-center items-center space-x-8'>
                    {[...Array(totalPages)].map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => updateParams({ page: i + 1 })} 
                        className={`text-[10px] font-bold tracking-tighter transition-all ${currentPage === i + 1 ? 'text-black scale-125 border-b border-black' : 'text-gray-300 hover:text-gray-500'}`}
                    >
                        {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </button>
                    ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;