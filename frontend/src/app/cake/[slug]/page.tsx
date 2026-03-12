"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CakeDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [cake, setCake] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (slug) {
      fetchCake();
    }
  }, [slug]);

  const fetchCake = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cakes/slug/${slug}`);
      const data = await res.json();
      if (data.success) {
        setCake(data.data);
        if (data.data.images && data.data.images.length > 0) {
          setActiveImage(data.data.images[0]);
        }
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // Simple push to cart array in local storage
    if (!cake) return;
    
    // Check if cartStore exists, for now implement local storage directly
    const cartData = localStorage.getItem('cart');
    let cart = cartData ? JSON.parse(cartData) : [];
    
    const existingIndex = cart.findIndex((item: any) => item._id === cake._id);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        _id: cake._id,
        name: cake.name,
        price: cake.price,
        image: cake.images?.[0],
        category: cake.category,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event to notify Sidebar Cart if needed
    window.dispatchEvent(new Event('cartUpdated'));
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-[#A21414] text-xl font-bold animate-pulse">Loading cake details...</p>
      </div>
    );
  }

  if (!cake) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#444444] font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24 mt-16 md:mt-16">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Image Gallery */}
          <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-x-hidden md:w-24 shrink-0">
              {cake.images?.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#A21414] scale-105' : 'border-transparent hover:border-[#E8E2D5]'}`}
                >
                  <Image src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${img}`} unoptimized alt={`${cake.name} view ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            
            <div className="relative w-full aspect-square bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#E8E2D5]">
              {activeImage ? (
                <Image src={activeImage.startsWith('http') ? activeImage : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${activeImage}`} unoptimized alt={cake.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 italic text-gray-500">No Image provided</div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="mb-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFF0F2] text-[#A21414] text-sm font-bold tracking-wide uppercase">
                {cake.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#2A2A2A] mb-4 leading-tight">
              {cake.name}
            </h1>
            <p className="text-3xl text-[#A21414] font-black mb-8 border-b border-[#E8E2D5] pb-8">
              ₹{cake.price}
            </p>
            
            <div className="mb-10 text-lg leading-relaxed text-[#666666] whitespace-pre-wrap">
              {cake.description}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 px-8 py-4 rounded-full border-2 border-[#2A2A2A] text-[#2A2A2A] font-bold uppercase tracking-wider hover:bg-[#2A2A2A] hover:text-white transition-all shadow-sm active:scale-95"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 px-8 py-4 rounded-full bg-[#A21414] text-white font-bold uppercase tracking-wider hover:bg-[#8A0F0F] transition-all shadow-md active:scale-95"
              >
                Buy Now
              </button>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-2xl border border-[#E8E2D5] flex gap-4 items-center">
              <div className="w-12 h-12 bg-[#FFF0F2] rounded-full flex items-center justify-center text-[#A21414] shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="text-sm text-[#666666]">
                <strong className="text-[#2A2A2A] block">Premium Quality Guarantee</strong>
                Baked fresh within 24 hours of your delivery. No preservatives.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
