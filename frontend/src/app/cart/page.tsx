"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalAmount, totalItems } = useCart();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null; // Avoid hydration mismatch on initial render

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#444444] font-sans flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12 md:py-24 mt-16 md:mt-16">
                <h1 className="text-4xl md:text-5xl font-black text-[#2A2A2A] mb-12 uppercase tracking-wide">
                    Your Cart <span className="text-[#A21414] text-3xl font-bold">({totalItems})</span>
                </h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-[#E8E2D5] shadow-sm">
                        <div className="w-24 h-24 bg-[#FFF0F2] rounded-full flex items-center justify-center text-[#A21414] mx-auto mb-6">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#2A2A2A] mb-4">Your cart is empty</h2>
                        <p className="text-[#666666] mb-8">Looks like you haven't added any delicious cakes yet.</p>
                        <Link href="/" className="inline-block bg-[#A21414] text-white font-bold py-4 px-8 rounded-full shadow-md hover:bg-[#8A0F0F] transition-colors">
                            Browse Cakes
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Cart Items List */}
                        <div className="flex-grow">
                            <div className="bg-white rounded-[32px] border border-[#E8E2D5] shadow-sm overflow-hidden">
                                {cart.map((item, index) => (
                                    <div 
                                        key={item._id} 
                                        className={`flex flex-col sm:flex-row items-center gap-6 p-6 ${index !== cart.length - 1 ? 'border-b border-[#E8E2D5]' : ''}`}
                                    >
                                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-[#E8E2D5]">
                                            <Image 
                                                src={item.image ? `http://localhost:5000${item.image}` : '/cake/products/fruit-cake.jpg'} 
                                                unoptimized
                                                alt={item.name} 
                                                fill 
                                                className="object-cover" 
                                            />
                                        </div>

                                        <div className="flex-grow text-center sm:text-left">
                                            {item.category && (
                                                <span className="text-[#A21414] text-xs font-bold uppercase tracking-wider mb-1 block">
                                                    {item.category}
                                                </span>
                                            )}
                                            <h3 className="text-xl font-bold text-[#2A2A2A] mb-2">{item.name}</h3>
                                            <p className="text-[#A21414] font-bold text-lg mb-4 sm:mb-0">₹{item.price}</p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center bg-[#FDFBF7] rounded-full border border-[#E8E2D5] p-1">
                                                <button 
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#666666] hover:bg-white hover:text-[#A21414] transition-colors"
                                                >
                                                    <Minus size={16} strokeWidth={3} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-[#2A2A2A]">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#666666] hover:bg-white hover:text-[#A21414] transition-colors"
                                                >
                                                    <Plus size={16} strokeWidth={3} />
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => removeFromCart(item._id)}
                                                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FFF0F2] text-[#A21414] hover:bg-[#A21414] hover:text-white transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-[400px] shrink-0">
                            <div className="bg-[#2A2A2A] text-white rounded-[32px] p-8 sticky top-32 shadow-[0_20px_40px_rgba(42,42,42,0.15)]">
                                <h3 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Order Summary</h3>
                                
                                <div className="space-y-4 mb-6 text-[#CCCCCC]">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span className="text-white font-medium">₹{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery</span>
                                        <span className="text-green-400 font-medium">Calculated upon order</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-medium content-end">Total Amount</span>
                                        <span className="text-3xl font-black text-[#FF4D6D]">₹{totalAmount}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => router.push('/checkout')}
                                    className="w-full bg-[#A21414] hover:bg-[#8A0F0F] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-transform transform active:scale-95 shadow-md"
                                >
                                    Proceed to Checkout
                                    <ArrowRight size={20} />
                                </button>
                                
                                <p className="text-xs text-center mt-4 text-[#888888]">
                                    Secure checkout. Delivery finalized via WhatsApp.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
