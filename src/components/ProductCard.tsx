import React from "react";
import NextImage from "next/image";

interface ProductProps {
    id: number;
    name: string;
    price: string;
    image: string;
    tag?: string;
    shortDescription?: string;
}

const ProductCard = ({ product }: { product: ProductProps }) => {
    return (
        <div className="group flex flex-col items-center justify-between text-center transition-all duration-300 h-full">
            {/* Image Container - Modern rounded card style */}
            <div className="relative w-[90%] md:w-full aspect-[4/3] md:aspect-square mb-6 flex justify-center items-center rounded-[24px] md:rounded-[32px] overflow-hidden drop-shadow-md group-hover:shadow-[0_20px_40px_rgba(162,20,20,0.12)] transition-all duration-500 ease-out transform group-hover:-translate-y-4 group-hover:scale-[1.02]">
                {product.tag && (
                    <span className="absolute top-4 left-4 bg-[#A21414] text-white text-[11px] font-bold px-3 py-1.5 rounded-full z-10 shadow-sm whitespace-nowrap">
                        {product.tag}
                    </span>
                )}

                <NextImage
                    src={product.image}
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
                <p className="text-[14px] text-[#666666] leading-relaxed mb-4 flex-grow px-4">
                    {product.shortDescription || "Handmade with love, always fresh."}
                </p>

                <div className="flex justify-between items-end w-full px-4 mt-2">
                    <div>
                        <p className="text-[#888888] text-xs font-bold uppercase tracking-wider mb-1">Price</p>
                        <p className="text-[#A21414] font-black text-2xl">
                            {product.price}
                        </p>
                    </div>

                    <a
                        href={`https://wa.me/1234567890?text=I'm interested in ordering the ${product.name} (${product.price})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-[#2A2A2A] text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#A21414] shadow-md group-hover:shadow-lg"
                        aria-label="Add to cart"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
