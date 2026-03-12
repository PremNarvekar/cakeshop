"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { CheckCircle } from "lucide-react";

export default function CheckoutPage() {
    const { cart, totalAmount, totalItems, clearCart } = useCart();
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        notes: "",
    });

    useEffect(() => {
        setIsClient(true);
        // If cart is empty on mount, redirect back
        if (cart.length === 0) {
            router.push('/cart');
        }
    }, [cart.length, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handlePlaceOrder = () => {
        // Format WhatsApp message
        const phoneNumber = "919999999999"; // Replace with actual shop number

        let message = `*New Order - CandyCake*\n\n`;
        message += `*Customer Details:*\n`;
        message += `Name: ${formData.name}\n`;
        message += `Phone: ${formData.phone}\n`;
        message += `Address: ${formData.address}\n`;
        if (formData.notes) {
            message += `Notes: ${formData.notes}\n`;
        }
        
        message += `\n*Order Details:*\n`;
        cart.forEach((item) => {
            message += `- ${item.name} (${item.quantity}x) = ₹${item.price * item.quantity}\n`;
        });
        
        message += `\n*Total Items:* ${totalItems}\n`;
        message += `*Total Amount:* ₹${totalAmount}\n`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Clear local cart
        clearCart();
        
        // Redirect to WhatsApp
        window.location.href = whatsappUrl;
    };

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#444444] font-sans flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12 md:py-24 mt-16 md:mt-16">
                
                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 1 ? 'bg-[#A21414] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                        <span className={`font-bold ${step >= 1 ? 'text-[#A21414]' : 'text-gray-500'}`}>Delivery Config</span>
                        <div className="w-12 h-px bg-gray-300 mx-2"></div>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 2 ? 'bg-[#A21414] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                        <span className={`font-bold ${step >= 2 ? 'text-[#A21414]' : 'text-gray-500'}`}>Summary & Pay</span>
                    </div>
                </div>

                {step === 1 && (
                    <div className="bg-white p-8 md:p-12 rounded-[32px] border border-[#E8E2D5] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="text-3xl font-black text-[#2A2A2A] mb-8">Delivery Details</h1>
                        <form onSubmit={handleNextStep} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#2A2A2A] mb-2 uppercase tracking-wide">Full Name *</label>
                                    <input 
                                        required 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        className="w-full bg-[#FDFBF7] border border-[#E8E2D5] p-4 rounded-xl focus:outline-none focus:border-[#A21414] transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#2A2A2A] mb-2 uppercase tracking-wide">Phone Number *</label>
                                    <input 
                                        required 
                                        type="tel" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleChange} 
                                        className="w-full bg-[#FDFBF7] border border-[#E8E2D5] p-4 rounded-xl focus:outline-none focus:border-[#A21414] transition-colors"
                                        placeholder="+91 99999 99999"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-[#2A2A2A] mb-2 uppercase tracking-wide">Complete Delivery Address *</label>
                                <textarea 
                                    required 
                                    name="address" 
                                    value={formData.address} 
                                    onChange={handleChange} 
                                    rows={3}
                                    className="w-full bg-[#FDFBF7] border border-[#E8E2D5] p-4 rounded-xl focus:outline-none focus:border-[#A21414] transition-colors resize-none"
                                    placeholder="House No, Street, City, Landmark..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#2A2A2A] mb-2 uppercase tracking-wide">Additional Notes (Optional)</label>
                                <textarea 
                                    name="notes" 
                                    value={formData.notes} 
                                    onChange={handleChange} 
                                    rows={2}
                                    className="w-full bg-[#FDFBF7] border border-[#E8E2D5] p-4 rounded-xl focus:outline-none focus:border-[#A21414] transition-colors resize-none"
                                    placeholder="Any specific delivery instructions or allergies?"
                                />
                            </div>

                            <div className="pt-6 border-t border-[#E8E2D5] flex justify-end">
                                <button type="submit" className="bg-[#A21414] text-white font-bold py-4 px-12 rounded-full hover:bg-[#8A0F0F] transition-colors shadow-md active:scale-95">
                                    Next: Order Summary
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 animate-in fade-in slide-in-from-right-8 duration-500">
                        {/* Final Summary Card */}
                        <div className="lg:col-span-3 bg-white p-8 md:p-10 rounded-[32px] border border-[#E8E2D5] shadow-sm">
                            <div className="flex justify-between items-center mb-8 border-b border-[#E8E2D5] pb-6">
                                <h2 className="text-2xl font-black text-[#2A2A2A]">Order Confirmation</h2>
                                <button onClick={() => setStep(1)} className="text-sm font-bold text-[#666666] underline hover:text-[#A21414]">Edit Details</button>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-[#888888] uppercase tracking-wide mb-4">Delivery Information</h3>
                                <div className="bg-[#FDFBF7] p-5 rounded-xl border border-[#E8E2D5]">
                                    <p className="font-bold text-[#2A2A2A] text-lg mb-1">{formData.name}</p>
                                    <p className="text-[#666666] mb-1">{formData.phone}</p>
                                    <p className="text-[#666666]">{formData.address}</p>
                                    {formData.notes && <p className="text-[#A21414] text-sm mt-3 pt-3 border-t border-[#E8E2D5]"><span className="font-bold">Note:</span> {formData.notes}</p>}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-[#888888] uppercase tracking-wide mb-4">Order Items ({totalItems})</h3>
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item._id} className="flex gap-4">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E8E2D5] relative">
                                                <Image src={item.image ? (item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.image}`) : '/cake/products/fruit-cake.jpg'} unoptimized alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-grow flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-[#2A2A2A]">{item.name}</p>
                                                    <p className="text-sm text-[#666666]">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold text-[#A21414]">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Payment / Action Sidebar */}
                        <div className="lg:col-span-2">
                            <div className="bg-[#2A2A2A] text-white rounded-[32px] p-8 shadow-[0_20px_40px_rgba(42,42,42,0.15)] sticky top-32">
                                <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Total Amount</h3>
                                
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-[#CCCCCC]">Subtotal</span>
                                    <span className="text-4xl font-black text-[#FF4D6D]">₹{totalAmount}</span>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3 text-sm text-[#CCCCCC]">
                                        <CheckCircle size={18} className="text-[#4ADE80] shrink-0 mt-0.5" />
                                        <p>Your order details will be securely sent to our team via WhatsApp.</p>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm text-[#CCCCCC]">
                                        <CheckCircle size={18} className="text-[#4ADE80] shrink-0 mt-0.5" />
                                        <p>Payment links will be provided via chat after finalizing delivery time.</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handlePlaceOrder}
                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-full flex items-center justify-center gap-3 transition-transform transform active:scale-95 shadow-md"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                    Place Order on WhatsApp
                                </button>
                                
                                <p className="text-xs text-center mt-4 text-[#888888]">
                                    By placing this order, your cart will be automatically cleared.
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
