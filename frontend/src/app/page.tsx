"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, Heart, ShieldCheck } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Loader from "@/components/Loader";
import Image from "next/image";
import CakeScrollAnimation from "@/components/CakeScrollAnimation";
import IcingDrip from "@/components/IcingDrip";
import BigCakeSection from "@/components/BigCakeSection";
import FloatingAssets from "@/components/FloatingAssets";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Removed static products

export default function Home() {
    const [assetsReady, setAssetsReady] = useState(false);
    const [loaderFinished, setLoaderFinished] = useState(false);
    const [cakes, setCakes] = useState<any[]>([]);
    const [loadingCakes, setLoadingCakes] = useState(true);
    const [hasMounted, setHasMounted] = useState(false);
    
    const showLoader = !assetsReady || !loaderFinished;

    useEffect(() => {
        setHasMounted(true);
        console.log("HOME: Component mounted");
    }, []);

    useEffect(() => {
        console.log("HOME: State Update", { assetsReady, loaderFinished, showLoader });
    }, [assetsReady, loaderFinished, showLoader]);

    useEffect(() => {
        const fetchCakes = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                console.warn("HOME: NEXT_PUBLIC_API_URL is not defined. Skipping fetch.");
                setLoadingCakes(false);
                return;
            }

            try {
                const res = await fetch(`${apiUrl}/cakes?limit=6`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new TypeError("Oops, we haven't got JSON!");
                }

                const data = await res.json();
                if (data.success) {
                    setCakes(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch cakes", err);
            } finally {
                setLoadingCakes(false);
            }
        };
        fetchCakes();
    }, []);

    const mainRef = useRef<HTMLElement>(null);

    // Lock scroll during loading
    useEffect(() => {
        if (!hasMounted) return;
        if (showLoader) {
            document.body.style.overflow = "hidden";
            window.scrollTo(0, 0); // Force top
        } else {
            document.body.style.overflow = "";
        }
    }, [showLoader, hasMounted]);

    if (!hasMounted) return null;

    // Setup scroll triggers and marquee
    useGSAP(() => {
        if (showLoader) return;

        // Smooth infinite horizontal marquee for features row
        gsap.to(".features-marquee-inner", {
            x: "-50%", // Use exact pixel/percentage tracking for seamless loop
            repeat: -1,
            duration: 15,
            ease: "none", // Must be "none" for linear constant-speed marquee
        });

        const sections = gsap.utils.toArray(".reveal-section");
        sections.forEach((section: any) => {
            gsap.fromTo(section,
                { opacity: 0, y: 80 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }, { scope: mainRef, dependencies: [showLoader] });

    return (
        <main ref={mainRef} className="relative min-h-screen bg-[#FFFFFF] overflow-x-hidden">
            <AnimatePresence mode="wait">
                {showLoader && (
                    <Loader key="main-loader" onComplete={() => {
                        console.log("HOME: Loader animation complete");
                        setLoaderFinished(true);
                    }} />
                )}
            </AnimatePresence>

            <Navbar />

            {/* Hero Section Auto-Scrubs on Scroll via ScrollTrigger */}
            <div className="relative z-10 bg-[#FDFBF7] overflow-hidden">
                <CakeScrollAnimation onLoadComplete={() => setAssetsReady(true)} />
            </div>

            {/* Main Website Content */}
            <div className="relative z-20 bg-[#FFFFFF] text-[#444444] pt-8 md:pt-16 -mt-8 md:-mt-16">

                {/* Global scattered floating assets */}
                <FloatingAssets />

                {/* Dripping Icing Transition pulled up cleanly into hero */}
                <div className="absolute top-0 left-0 right-0 w-full z-30 -translate-y-[99%] pointer-events-none">
                    <IcingDrip fill="#FFFFFF" />
                </div>

                {/* Features Marquee Row */}
                <section className="w-full mb-16 md:mb-24 overflow-hidden reveal-section py-4 md:py-6 border-b border-[#E8E2D5] bg-white">
                    {/* The container needs to be exactly exactly 200% width so that when it scrolls 50%, it perfectly loops the duplicated content */}
                    <div className="features-marquee-inner flex w-[200%] sm:w-[200%] md:w-[200%] min-w-max">
                        {/* Double the content to create a seamless infinite loop */}
                        {[...Array(2)].map((_, index) => (
                            <div key={index} className="flex justify-around items-center w-[50%] shrink-0">
                                <div className="flex flex-col items-center w-[200px] md:w-[300px] text-center px-4">
                                    <Leaf className="w-8 h-8 md:w-12 md:h-12 text-[#A21414] mb-3" strokeWidth={1.5} />
                                    <h4 className="font-bold text-[#2A2A2A] mb-1 leading-tight text-[13px] md:text-base whitespace-normal">100% Natural Ingredients</h4>
                                    <p className="text-[11px] md:text-sm text-[#666666]">Sourced from local farms</p>
                                </div>
                                <div className="flex flex-col items-center w-[200px] md:w-[300px] text-center px-4">
                                    <Heart className="w-8 h-8 md:w-12 md:h-12 text-[#A21414] mb-3" strokeWidth={1.5} />
                                    <h4 className="font-bold text-[#2A2A2A] mb-1 leading-tight text-[13px] md:text-base whitespace-normal">Low Calorie Options</h4>
                                    <p className="text-[11px] md:text-sm text-[#666666]">Healthy and delicious</p>
                                </div>
                                <div className="flex flex-col items-center w-[200px] md:w-[300px] text-center px-4">
                                    <ShieldCheck className="w-8 h-8 md:w-12 md:h-12 text-[#A21414] mb-3" strokeWidth={1.5} />
                                    <h4 className="font-bold text-[#2A2A2A] mb-1 leading-tight text-[13px] md:text-base whitespace-normal">No Artificial Dyes</h4>
                                    <p className="text-[11px] md:text-sm text-[#666666]">Safe for everyone</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Wave Transition (White to Pink) */}
                <div className="w-full relative -mt-1 z-10 pointer-events-none">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[60px] md:h-[120px] block" preserveAspectRatio="none">
                        <path d="M0,0 C320,120 420,120 720,60 C1020,0 1120,0 1440,60 L1440,120 L0,120 Z" fill="#FFF0F2" />
                    </svg>
                </div>

                {/* NEW: Ingredient Spotlight */}
                <section className="bg-[#FFF0F2] py-16 md:py-24 relative z-20 reveal-section overflow-hidden">
                    <div className="max-width-container px-6 flex flex-col md:flex-row items-center gap-12">
                        {/* Visual Graphic */}
                        <div className="w-full md:w-1/2 relative flex justify-center">
                            <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full bg-white/40 border border-white/60 backdrop-blur-md flex items-center justify-center p-8 shadow-[0_20px_40px_rgba(162,20,20,0.05)]">
                                <Image src="/cake/products/fruit-cake.jpg" alt="Natural Ingredients" width={350} height={350} className="rounded-full object-cover shadow-2xl mix-blend-multiply" />
                            </div>
                        </div>
                        {/* Text Content */}
                        <div className="w-full md:w-1/2 text-center md:text-left z-20">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#A21414] mb-6 uppercase tracking-wide leading-tight">
                                Not only delicious, but also healthy
                            </h2>
                            <p className="text-[#666666] text-lg md:text-xl leading-relaxed mb-6">
                                We use only premium, locally-sourced ingredients. Our signature almond recipes and organic accents are packed with natural nutrients, completely replacing artificial flavors and heavy sugars.
                            </p>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 inline-block text-left">
                                <p className="text-[#2A2A2A] font-bold text-lg mb-1">
                                    Did you know?
                                </p>
                                <p className="text-[#A21414] font-medium text-sm md:text-base">
                                    Our fruit compotes hold 100% of their natural vitamins, containing no added preservatives or thickeners.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Wave Transition (Pink to White) */}
                <div className="w-full relative -mb-1 z-10 pointer-events-none">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[60px] md:h-[120px] block" preserveAspectRatio="none">
                        <path d="M0,120 C320,0 420,0 720,60 C1020,120 1120,120 1440,60 L1440,0 L0,0 Z" fill="#FFF0F2" />
                    </svg>
                </div>

                {/* Popular Cakes Section (Cutout Style) */}
                <section id="popular" className="section-padding reveal-section">
                    <div className="max-width-container text-center">

                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#A21414] mb-12 uppercase tracking-wide">
                            Just look at these cakes
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 pt-8 pb-16">
                            {loadingCakes ? (
                                <p className="col-span-3 text-center text-gray-500">Loading exquisite cakes...</p>
                            ) : cakes.length > 0 ? (
                                cakes.map((cake) => (
                                    <ProductCard key={cake._id} product={cake} />
                                ))
                            ) : (
                                <p className="col-span-3 text-center text-gray-500">No cakes available right now.</p>
                            )}
                        </div>

                    </div>
                </section>

                {/* NEW: 4-Step Order Process (Modern Swipeable Cards) */}
                <section className="py-24 md:py-32 bg-[#FFFFFF] relative z-20 reveal-section overflow-hidden">
                    <div className="max-width-container px-6 mb-12">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-extrabold text-[#A21414] uppercase tracking-wide leading-tight">
                                    Can't wait to order?
                                </h2>
                                <p className="text-[#666666] mt-4 max-w-lg text-lg">
                                    Our process is simple, personal, and tailored perfectly to you. Swipe to see how it works.
                                </p>
                            </div>
                            <div className="hidden md:flex gap-2">
                                <span className="bg-[#FFF0F2] text-[#A21414] p-3 rounded-full hover:bg-[#A21414] hover:text-white transition-colors cursor-pointer">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                                <span className="bg-[#FFF0F2] text-[#A21414] p-3 rounded-full hover:bg-[#A21414] hover:text-white transition-colors cursor-pointer">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Scroller Container */}
                    <div className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12 pt-4 px-6 md:px-max-width-container gap-6">
                        {/* Empty spacer to align with container padding on desktop left */}
                        <div className="hidden md:block min-w-[max(0px,calc((100vw-1280px)/2))] shrink-0"></div>

                        {[
                            { step: "01", title: "Select", desc: "Choose your favorite flavor from our premium menu or request a totally custom design tailored to your event." },
                            { step: "02", title: "Confirm", desc: "We personally finalize all the details, dietary needs, and secure your delivery date directly via WhatsApp." },
                            { step: "03", title: "Bake", desc: "Your cake is freshly prepared and baked from scratch in small batches precisely on the morning of your delivery day." },
                            { step: "04", title: "Delivery", desc: "Hand-delivered directly to your door in our signature temperature-controlled pastry boxes to ensure it arrives flawlessly." }
                        ].map((item, i) => (
                            <div key={i} className="min-w-[85vw] md:min-w-[320px] max-w-[400px] shrink-0 snap-start snap-always bg-white rounded-[32px] p-8 border border-[#E8E2D5] shadow-[0_10px_30px_rgba(42,42,42,0.03)] hover:shadow-[0_20px_40px_rgba(162,20,20,0.08)] hover:border-[#F3EFE6] transition-all duration-300 group cursor-grab active:cursor-grabbing">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-14 h-14 rounded-full bg-[#FFF0F2] text-[#A21414] flex items-center justify-center font-black text-xl shadow-inner group-hover:bg-[#A21414] group-hover:text-white transition-colors duration-300">
                                        {item.step}
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-[#E8E2D5] flex items-center justify-center opacity-50">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A21414]"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                                <h4 className="font-extrabold text-[#2A2A2A] text-2xl mb-4 group-hover:text-[#A21414] transition-colors">{item.title}</h4>
                                <p className="text-[#666666] text-sm md:text-base leading-relaxed">{item.desc}</p>
                            </div>
                        ))}

                        {/* Empty spacer to allow scrolling past the last item elegantly */}
                        <div className="min-w-[20px] md:min-w-[max(24px,calc((100vw-1280px)/2))] shrink-0"></div>
                    </div>
                </section>

                {/* Soft Wave Transition (White to Pink) */}
                <div className="w-full relative -mt-1 z-10 pointer-events-none">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[60px] md:h-[120px] block" preserveAspectRatio="none">
                        <path d="M0,0 C320,120 420,120 720,60 C1020,0 1120,0 1440,60 L1440,120 L0,120 Z" fill="#FFF0F2" />
                    </svg>
                </div>

                {/* Interactive Big Cake / Ingredients Section */}
                <div className="reveal-section pb-24 md:pb-32 pt-16 bg-[#FFF0F2]">
                    <BigCakeSection />
                </div>

                {/* Wave Transition (Pink to White) */}
                <div className="w-full relative -mb-1 z-10 pointer-events-none">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[60px] md:h-[120px] block" preserveAspectRatio="none">
                        <path d="M0,120 C320,0 420,0 720,60 C1020,120 1120,120 1440,60 L1440,0 L0,0 Z" fill="#FFF0F2" />
                    </svg>
                </div>

                {/* Customer Reviews Section (Light Theme) */}
                <section id="reviews" className="relative reveal-section section-padding bg-[#FDFBF7] text-[#444444] py-24 md:py-32">
                    <div className="max-width-container text-center relative z-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#A21414] mb-16 uppercase tracking-wide">A little delight</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">

                            {/* Review 1 */}
                            <div className="bg-white text-left p-10 rounded-[32px] shadow-[0_10px_30px_rgba(42,42,42,0.05)] hover:-translate-y-2 transition-transform duration-500 border border-[#E8E2D5]">
                                <div className="w-16 h-16 rounded-full bg-[#FFF0F2] mb-6 flex items-center justify-center shadow-inner">
                                    {/* Placeholder avatar */}
                                    <div className="w-12 h-12 rounded-full border-2 border-white bg-[#E85A71]/20"></div>
                                </div>
                                <h4 className="font-bold text-[#A21414] mb-4">Emma, Warsaw</h4>
                                <p className="text-[#666666] text-sm md:text-[15px] leading-relaxed italic">
                                    "I didn't expect a cake to be this soft and fresh. It tasted like something straight from a bakery — still warm when it arrived. The classic slice has become my weekly ritual."
                                </p>
                            </div>

                            {/* Review 2 */}
                            <div className="bg-white text-left p-10 rounded-[32px] shadow-[0_10px_30px_rgba(42,42,42,0.05)] hover:-translate-y-2 transition-transform duration-500 border border-[#E8E2D5]">
                                <div className="w-16 h-16 rounded-full bg-[#FFF0F2] mb-6 flex items-center justify-center shadow-inner">
                                    <div className="w-12 h-12 rounded-full border-2 border-white bg-[#4EA8DE]/20"></div>
                                </div>
                                <h4 className="font-bold text-[#A21414] mb-4">David, London</h4>
                                <p className="text-[#666666] text-sm md:text-[15px] leading-relaxed italic">
                                    "Absolutely phenomenal. The texture is unmatched and the colors are vibrant but natural. It brought the whole family together for dessert!"
                                </p>
                            </div>

                            {/* Review 3 */}
                            <div className="bg-white text-left p-10 rounded-[32px] shadow-[0_10px_30px_rgba(42,42,42,0.05)] hover:-translate-y-2 transition-transform duration-500 border border-[#E8E2D5]">
                                <div className="w-16 h-16 rounded-full bg-[#FFF0F2] mb-6 flex items-center justify-center shadow-inner">
                                    <div className="w-12 h-12 rounded-full border-2 border-white bg-[#F9C74F]/20"></div>
                                </div>
                                <h4 className="font-bold text-[#A21414] mb-4">Sarah, Berlin</h4>
                                <p className="text-[#666666] text-sm md:text-[15px] leading-relaxed italic">
                                    "The ordering process was incredibly simple. I requested it over WhatsApp, and within hours it was at my door. Best service ever."
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Wave Transition (White to Pink) */}
                <div className="w-full relative -mt-1 z-10 pointer-events-none">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[60px] md:h-[120px] block" preserveAspectRatio="none">
                        <path d="M0,0 C320,120 420,120 720,60 C1020,0 1120,0 1440,60 L1440,120 L0,120 Z" fill="#FFF0F2" />
                    </svg>
                </div>

                {/* FAQs Section */}
                <section id="faq" className="reveal-section bg-[#FFF0F2] py-24 md:py-32">
                    <div className="max-width-container px-6 max-w-3xl border-t border-[#E8E2D5] pt-16">
                        <h2 className="text-4xl font-bold text-[#2A2A2A] mb-4 text-center">FAQs</h2>
                        <p className="text-center text-[#666666] mb-12">From ingredients to delivery, here's everything people ask us most.</p>

                        <div className="space-y-4">
                            <FaqItem
                                question="How fresh are your cakes when they arrive?"
                                answer="Very fresh — always baked the same day we deliver. We make our cakes in small batches each morning and hand-deliver them right to your door."
                            />
                            <FaqItem
                                question="Do you offer gluten-free options?"
                                answer="Yes! We have a dedicated gluten-free menu featuring our famous almond-flour based layers. They are baked in separate facilities to avoid cross-contamination."
                            />
                            <FaqItem
                                question="How does the WhatsApp ordering work?"
                                answer="It's simple. Click the custom order button, text us the flavor, size, and address. We reply instantly to confirm the final detail and send a payment link."
                            />
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="border border-[#E8E2D5] rounded-2xl bg-white overflow-hidden transition-colors duration-500 hover:border-[#A21414] hover:shadow-[0_10px_30px_rgba(162,20,20,0.1)]"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="p-5 md:p-6 cursor-pointer flex justify-between items-center bg-white z-10 relative">
                <h4 className={cn("font-bold text-[15px] md:text-lg transition-colors pr-6", isOpen ? "text-[#A21414]" : "text-[#2A2A2A]")}>
                    {question}
                </h4>
                <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    className="text-3xl font-light text-[#A21414] origin-center leading-none"
                >
                    +
                </motion.span>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <p className="px-5 md:px-6 pb-6 text-[#666666] text-sm md:text-base leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
