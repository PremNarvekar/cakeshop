import React from "react";
import NextImage from "next/image";

import Link from "next/link";

interface ProductProps {
    _id: string;
    name: string;
    price: number | string;
    images?: string[];
    slug?: string;
    category?: string;
    description?: string;
}

const ProductCard = ({ product }: { product: ProductProps }) => {
    const getImageUrl = (img?: string) => {
        if (!img) return "/cake/products/fruit-cake.jpg";
        if (img.startsWith("http")) return img;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
        return `${baseUrl}${img}`;
    };

    const defaultImage = product.images && product.images.length > 0 
        ? getImageUrl(product.images[0]) 
        : "/cake/products/fruit-cake.jpg";

    return (
        <div className="group flex flex-col items-center justify-between text-center transition-all duration-300 h-full">
                <Link href={`/cake/${product.slug}`} className="absolute top-0 w-full h-full z-20"></Link>
                <div className="relative w-[90%] md:w-full aspect-[4/3] md:aspect-square mb-6 flex justify-center items-center rounded-[24px] md:rounded-[32px] overflow-hidden drop-shadow-md group-hover:shadow-[0_20px_40px_rgba(162,20,20,0.12)] transition-all duration-500 ease-out transform group-hover:-translate-y-4 group-hover:scale-[1.02]">
                {product.category && (
                    <span className="absolute top-4 left-4 bg-[#A21414] text-white text-[11px] font-bold px-3 py-1.5 rounded-full z-10 shadow-sm whitespace-nowrap">
                        {product.category}
                    </span>
                )}

                <NextImage
                    src={defaultImage}
                    unoptimized
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow items-center">
                <h3 className="text-xl md:text-2xl font-bold text-[#2A2A2A] mb-2 group-hover:text-[#A21414] transition-colors duration-300">
                    {product.name}
                </h3>
                <p className="text-[14px] text-[#666666] leading-relaxed mb-4 flex-grow px-4 line-clamp-2">
                    {product.description || "Handmade with love, always fresh."}
                </p>

                <div className="flex justify-between items-end w-full px-4 mt-2">
                    <div>
                        <p className="text-[#888888] text-xs font-bold uppercase tracking-wider mb-1">Price</p>
                        <p className="text-[#A21414] font-black text-2xl">
                            ₹{product.price}
                        </p>
                    </div>

                    <Link
                        href={`/cake/${product.slug}`}
                        className="w-12 h-12 bg-[#2A2A2A] text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#A21414] shadow-md group-hover:shadow-lg z-30 relative"
                        aria-label="View Details"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
