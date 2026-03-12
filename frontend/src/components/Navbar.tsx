"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Cakes", href: "/cakes" },
    { name: "Menu", href: "/menu" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

// Stagger definitions for Mobile Menu
const menuVars: any = {
    initial: { scaleY: 0 },
    animate: {
        scaleY: 1,
        transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
        scaleY: 0,
        transition: { delay: 0.5, duration: 0.5, ease: "easeInOut" },
    },
};

const containerVars: any = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: {
        transition: { delayChildren: 0.3, staggerChildren: 0.09, staggerDirection: 1 },
    },
};

const mobileLinkVars: any = {
    initial: { y: "30vh", transition: { duration: 0.5, ease: "easeOut" } },
    open: { y: 0, transition: { ease: "easeOut", duration: 0.7 } },
};

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Attempt useCart, handle SSR gracefully if context not loaded immediately
    let totalItems = 0;
    try {
        const cartData = useCart();
        totalItems = cartData.totalItems;
    } catch (e) {}

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                    "fixed left-0 right-0 z-[60] flex justify-center px-4 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none",
                    isScrolled ? "top-4 md:top-6" : "top-0 md:top-6"
                )}
            >
                {/* Dynamic Island Container */}
                <div
                    className={cn(
                        "w-full flex items-center justify-between pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                        isScrolled
                            ? "max-w-4xl bg-white/70 backdrop-blur-2xl py-3 px-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/50 rounded-full"
                            : "max-w-7xl bg-transparent py-4 px-2 md:px-8 border-transparent rounded-none"
                    )}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className={cn(
                            "text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 hover:opacity-70 transition-opacity",
                            isScrolled ? "text-[#2A2A2A]" : "text-white"
                        )}
                    >
                        Candy<span className={cn(isScrolled ? "text-[#A21414]" : "text-[#FF4D6D]")}>Cake</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 lg:gap-2 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-[14px] font-semibold transition-all rounded-full px-5 py-2",
                                    isScrolled
                                        ? "text-[#444444] hover:bg-black/5 hover:text-[#A21414]"
                                        : "text-white/90 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Cart Button - Expanding Island Style */}
                    <div className="hidden md:block">
                        <Link
                            href="/cart"
                            className={cn(
                                "flex items-center justify-center rounded-full overflow-hidden group shadow-md",
                                isScrolled ? "bg-[#2A2A2A] text-white" : "bg-white/20 backdrop-blur-md text-white shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/30 hover:bg-white/30"
                            )}
                        >
                            <motion.div
                                initial={{ width: 44, height: 44 }}
                                whileHover={{ width: 110 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="flex items-center h-full"
                            >
                                <div className="flex items-center justify-center h-full w-[44px] shrink-0 relative">
                                    <ShoppingCart size={18} strokeWidth={2.5} className="group-hover:text-[#FFF0F2] transition-colors" />
                                    {totalItems > 0 && (
                                        <span className="absolute top-[8px] right-[6px] bg-[#A21414] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                            {totalItems}
                                        </span>
                                    )}
                                </div>
                                <motion.span
                                    className="font-bold text-[14px] whitespace-nowrap overflow-hidden pr-4"
                                    initial={{ opacity: 0, width: 0 }}
                                    whileHover={{ opacity: 1, width: "auto" }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Cart
                                </motion.span>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Mobile Controls (Menu & Cart icons side-by-side) */}
                    <div className="md:hidden flex items-center gap-2">
                        <Link
                            href="/cart"
                            className={cn(
                                "relative flex items-center justify-center h-10 w-10 rounded-full transition-colors",
                                isScrolled ? "bg-[#2A2A2A] text-white" : "bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-md"
                            )}
                            aria-label="View Cart"
                        >
                            <ShoppingCart size={18} strokeWidth={2.5} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#A21414] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={cn(
                                "flex items-center justify-center h-10 w-10 rounded-full transition-colors",
                                isScrolled ? "bg-black/5 text-[#2A2A2A]" : "bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-md"
                            )}
                            aria-label="Open menu"
                        >
                            <Menu size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Premium Fullscreen Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        variants={menuVars}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed inset-0 bg-[#FDFBF7] z-[100] origin-top flex flex-col items-center justify-center overflow-hidden"
                    >
                        <div className="absolute top-6 px-6 w-full flex justify-between items-center max-w-7xl mx-auto z-10">
                            <span className="text-xl font-black tracking-tighter text-[#2A2A2A]">
                                Candy<span className="text-[#A21414]">Cake</span>
                            </span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-3 bg-black/5 text-[#2A2A2A] rounded-full hover:bg-black/10 transition-colors"
                                aria-label="Close menu"
                            >
                                <X size={24} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Staggered Navigation Links */}
                        <motion.div
                            variants={containerVars}
                            initial="initial"
                            animate="open"
                            exit="initial"
                            className="flex flex-col gap-6 flex-1 items-center justify-center text-center w-full px-8 mt-16"
                        >
                            {navLinks.map((link) => (
                                <div key={link.name} className="overflow-hidden py-1">
                                    <motion.div variants={mobileLinkVars}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-4xl sm:text-5xl font-black text-[#2A2A2A] hover:text-[#A21414] transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="w-full p-8 pb-12 text-center"
                        >
                            <Link
                                href="/cart"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="inline-flex items-center justify-center gap-3 bg-[#2A2A2A] text-white w-full max-w-[300px] py-4 rounded-full text-lg font-bold shadow-2xl hover:bg-black transition duration-300 transform hover:-translate-y-1"
                            >
                                <ShoppingCart size={22} />
                                View Cart {totalItems > 0 && `(${totalItems})`}
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
