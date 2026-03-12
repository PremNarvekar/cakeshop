import React from "react";
import Link from "next/link";
import { Twitter, Instagram, Facebook } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#FFFFFF] text-[#2A2A2A] py-20 px-6 border-t border-[#E8E2D5]">
            <div className="max-width-container grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                {/* Brand */}
                <div className="col-span-1 md:col-span-1">
                    <Link href="/" className="text-3xl font-black tracking-tighter mb-6 block text-[#2A2A2A]">
                        Candy<span className="text-[#A21414]">Cake</span>
                    </Link>
                    <p className="text-[#666666] text-sm leading-relaxed max-w-xs font-medium">
                        Small-batch. Hand-rolled. Delivered fresh. Bringing warmth to your door — one perfect slice at a time.
                    </p>
                </div>

                {/* Links Column 1 */}
                <div>
                    <h4 className="font-bold text-lg mb-6 text-[#A21414]">About</h4>
                    <ul className="space-y-4">
                        <li><Link href="/about" className="text-[#666666] hover:text-[#A21414] transition-colors text-sm font-semibold">Our Story</Link></li>
                        <li><Link href="/about" className="text-[#666666] hover:text-[#A21414] transition-colors text-sm font-semibold">How It's Made</Link></li>
                        <li><Link href="/about" className="text-[#666666] hover:text-[#A21414] transition-colors text-sm font-semibold">Ingredients</Link></li>
                        <li><Link href="/about" className="text-[#666666] hover:text-[#A21414] transition-colors text-sm font-semibold">Meet the Team</Link></li>
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div>
                    <h4 className="font-bold text-lg mb-6 text-[#A21414]">Shop</h4>
                    <ul className="space-y-4">
                        <li><Link href="/menu" className="text-[#666666] hover:text-[#A21414] transition-colors text-sm font-semibold">All Cakes</Link></li>
                        <li><Link href="/cakes" className="text-[#666666] hover:text-[#A21414] transition-colors text-sm font-semibold">Gift Boxes</Link></li>
                        <li><Link href="/cakes" className="text-[#666666] hover:text-[#A21414] transition-colors text-sm font-semibold">Sweet & Savory</Link></li>
                        <li><Link href="/menu" className="text-[#666666] hover:text-[#A21414] transition-colors text-sm font-semibold">Build Your Box</Link></li>
                    </ul>
                </div>

                {/* Links Column 3 */}
                <div>
                    <h4 className="font-bold text-lg mb-6 text-[#A21414]">Help</h4>
                    <ul className="space-y-4">
                        <li><Link href="/contact" className="text-[#666666] hover:text-[#A21414] transition-colors text-sm font-semibold">FAQs</Link></li>
                        <li><Link href="/contact" className="text-[#666666] hover:text-[#A21414] transition-colors text-sm font-semibold">Shipping Info</Link></li>
                        <li><Link href="/contact" className="text-[#666666] hover:text-[#A21414] transition-colors text-sm font-semibold">Contact Us</Link></li>
                        <li><Link href="/contact" className="text-[#666666] hover:text-[#A21414] transition-colors text-sm font-semibold">Return Policy</Link></li>
                    </ul>
                </div>

            </div>

            {/* Social & Legal */}
            <div className="max-width-container pt-8 border-t border-[#E8E2D5] flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[#888888] text-xs font-medium">
                    © {new Date().getFullYear()} CandyCake Studios. All rights reserved.
                </p>

                <div className="flex gap-6">
                    <a href="#" className="p-3 bg-[#FFF0F2] text-[#A21414] rounded-full hover:bg-[#A21414] hover:text-white transition-all duration-300" aria-label="Twitter">
                        <Twitter size={18} strokeWidth={2.5} />
                    </a>
                    <a href="#" className="p-3 bg-[#FFF0F2] text-[#A21414] rounded-full hover:bg-[#A21414] hover:text-white transition-all duration-300" aria-label="Instagram">
                        <Instagram size={18} strokeWidth={2.5} />
                    </a>
                    <a href="#" className="p-3 bg-[#FFF0F2] text-[#A21414] rounded-full hover:bg-[#A21414] hover:text-white transition-all duration-300" aria-label="Facebook">
                        <Facebook size={18} strokeWidth={2.5} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
