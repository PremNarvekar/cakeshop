"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const CATEGORIES = [
    "All",
    "Chocolate",
    "Rainbow",
    "Birthday",
    "Wedding",
    "Custom Cakes",
    "Cupcakes",
];

export default function CakesPage() {
    const [cakes, setCakes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const { addToCart } = useCart();

    useEffect(() => {
        fetchCakes();
    }, [activeCategory, page, searchQuery]);

    const fetchCakes = async () => {
        setLoading(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/cakes?page=${page}&limit=12`;
            if (activeCategory !== "All") {
                url += `&category=${encodeURIComponent(activeCategory)}`;
            }
            if (searchQuery.trim()) {
                url += `&search=${encodeURIComponent(searchQuery)}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setCakes(data.data);
                setTotalPages(data.totalPages);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        setPage(1);
    };

    const handleAddToCart = (cake: any) => {
        addToCart({
            _id: cake._id,
            name: cake.name,
            price: cake.price,
            image: cake.images?.[0],
            category: cake.category,
        });
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#444444] font-sans flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 md:py-24 mt-16 md:mt-16">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-[#2A2A2A] uppercase tracking-wide mb-4">
                        Our <span className="text-[#A21414]">Cakes</span>
                    </h1>
                    <p className="text-[#666666] text-lg max-w-xl mx-auto">
                        Browse our handcrafted collection. Every cake is baked fresh with premium ingredients.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-8">
                    <input
                        type="text"
                        placeholder="Search cakes..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        className="w-full bg-white border border-[#E8E2D5] rounded-full px-6 py-3 focus:outline-none focus:border-[#A21414] transition-colors shadow-sm"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                                activeCategory === cat
                                    ? "bg-[#A21414] text-white shadow-md"
                                    : "bg-white text-[#666666] border border-[#E8E2D5] hover:border-[#A21414] hover:text-[#A21414]"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Cakes Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-[#A21414] text-xl font-bold animate-pulse">Loading cakes...</p>
                    </div>
                ) : cakes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-[#E8E2D5]">
                        <p className="text-2xl font-bold text-[#2A2A2A] mb-2">No cakes found</p>
                        <p className="text-[#666666]">Try a different category or search term.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {cakes.map((cake) => {
                            const getImageUrl = (img?: string) => {
                                if (!img) return "/cake/products/fruit-cake.jpg";
                                if (img.startsWith("http")) return img;
                                const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
                                return `${baseUrl}${img}`;
                            };

                            const imgSrc = cake.images && cake.images.length > 0
                                ? getImageUrl(cake.images[0])
                                : "/cake/products/fruit-cake.jpg";

                            return (
                                <div
                                    key={cake._id}
                                    className="group bg-white rounded-[24px] overflow-hidden border border-[#E8E2D5] shadow-sm hover:shadow-[0_20px_40px_rgba(162,20,20,0.08)] hover:-translate-y-2 transition-all duration-500"
                                >
                                    <Link href={`/cake/${cake.slug}`} className="block relative aspect-square overflow-hidden">
                                        <Image
                                            src={imgSrc}
                                            unoptimized
                                            alt={cake.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <span className="absolute top-4 left-4 bg-[#A21414] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                                            {cake.category}
                                        </span>
                                    </Link>

                                    <div className="p-5">
                                        <Link href={`/cake/${cake.slug}`}>
                                            <h3 className="text-lg font-bold text-[#2A2A2A] mb-1 group-hover:text-[#A21414] transition-colors line-clamp-1">
                                                {cake.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-[#666666] line-clamp-2 mb-4 min-h-[2.5rem]">
                                            {cake.description || "Handmade with love"}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-[#A21414] font-black text-xl">₹{cake.price}</p>
                                            <button
                                                onClick={() => handleAddToCart(cake)}
                                                className="w-10 h-10 bg-[#2A2A2A] text-white rounded-full flex items-center justify-center hover:bg-[#A21414] transition-colors shadow-sm active:scale-90"
                                                aria-label="Add to cart"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-12">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-10 h-10 rounded-full bg-white border border-[#E8E2D5] flex items-center justify-center text-[#666666] hover:border-[#A21414] hover:text-[#A21414] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-full font-bold text-sm transition-colors ${
                                    page === p
                                        ? "bg-[#A21414] text-white"
                                        : "bg-white border border-[#E8E2D5] text-[#666666] hover:border-[#A21414] hover:text-[#A21414]"
                                }`}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="w-10 h-10 rounded-full bg-white border border-[#E8E2D5] flex items-center justify-center text-[#666666] hover:border-[#A21414] hover:text-[#A21414] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
