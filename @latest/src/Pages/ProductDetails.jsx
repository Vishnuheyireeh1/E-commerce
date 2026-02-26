import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  const API_URL = import.meta.env.VITE_API_URI;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(`Fetching product with ID: ${id}...`);
        const res = await axios.get(`${API_URL}/products/${id}`);
        
        console.log("Product Data Received:", res.data);
        
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Product not found");
        navigate('/shop');
      }
    };
    if (id) fetchProduct();
  }, [id, API_URL, navigate]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleDirectBuy = () => {
    if (!localStorage.getItem('token')) {
      toast.info("Please sign in to complete your purchase");
      navigate('/login');
      return;
    }
    navigate('/payment', { state: { product } });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif uppercase tracking-widest text-gray-400">Loading Archive...</div>;

  const imageUrl = product.image?.startsWith('http') 
    ? product.image 
    : `${BASE_URL}${product.image}`;

  console.log("Final computed Image URL:", imageUrl);

  return (
    <div className='min-h-screen bg-[#FAF9F6] pt-10 pb-20 px-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center space-x-3 mb-8'>
          <span className='px-3 py-1 bg-gray-950 text-white text-[9px] uppercase tracking-widest font-bold'>
            {product.category?.name || 'Collection'}
          </span>
          {product.subCategory && (
            <span className='px-3 py-1 border border-gray-300 text-gray-600 text-[9px] uppercase tracking-widest font-bold'>
              {product.subCategory}
            </span>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-16 items-start'>
          {/* Zoomable Image */}
          <div 
            className='relative aspect-[3/4] overflow-hidden bg-white border border-gray-100 cursor-zoom-in group'
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomPos({ ...zoomPos, show: false })}
          >
            <img 
              src={imageUrl} 
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${zoomPos.show ? 'opacity-0' : 'opacity-100'}`}
              onError={(e) => {
                console.error("Image failed to load:", imageUrl);
                e.target.src = "https://via.placeholder.com/600x800?text=Image+Not+Found";
              }}
            />
            {zoomPos.show && (
              <div 
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '250%'
                }}
              />
            )}
          </div>

          {/* Details */}
          <div className='flex flex-col justify-center'>
            <div className='border-b border-gray-200 pb-8 mb-8'>
              <h1 className='text-5xl font-serif text-gray-950 leading-tight mb-4'>{product.name}</h1>
              <p className='text-3xl font-light text-gray-950'>₹{product.price?.toLocaleString('en-IN')}</p>
            </div>

            <div className='space-y-6'>
              <p className='text-sm leading-relaxed text-gray-500 font-light'>{product.description}</p>

              <div className='pt-4'>
                <p className='text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>Availability</p>
                <p className={`text-sm ${product.stock > 0 ? 'text-green-700' : 'text-red-500'} font-medium`}>
                  {product.stock > 0 ? `${product.stock} units available` : 'Currently Sold Out'}
                </p>
              </div>

              <div className='pt-8'>
                <button 
                  onClick={handleDirectBuy}
                  disabled={product.stock <= 0}
                  className='w-full bg-gray-950 text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black transition-all shadow-xl disabled:bg-gray-200'
                >
                  {product.stock > 0 ? 'Direct Buy Now' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;