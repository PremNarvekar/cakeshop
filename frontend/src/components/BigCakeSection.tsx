"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, CalendarDays } from "lucide-react";

// Reusable floating animation variant
const floatVariant = (delay: number): any => ({
    animate: {
        y: ["-8px", "8px"],
        x: ["-4px", "4px"],
        transition: {
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay,
        },
    },
});

const BigCakeSection = () => {
    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFF0F2] to-[#FFF5F6] py-24 md:py-32 border-y border-[#FFD8D9]">

            {/* Decorative Floating Elements */}
            <motion.div
                className="absolute top-[10%] left-[10%] w-32 h-32 md:w-64 md:h-64 bg-[#E85A71] rounded-full blur-[80px] opacity-20 z-0 pointer-events-none"
                variants={floatVariant(0)}
                animate="animate"
            />
            <motion.div
                className="absolute bottom-[10%] right-[10%] w-40 h-40 md:w-80 md:h-80 bg-[#FF9A8B] rounded-full blur-[100px] opacity-30 z-0 pointer-events-none"
                variants={floatVariant(1.5)}
                animate="animate"
            />

            <div className="max-width-container px-6 relative z-10 text-center">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/80 px-4 py-2 rounded-full mb-8 shadow-sm"
                >
                    <Sparkles className="text-[#A21414] w-4 h-4" />
                    <span className="text-sm font-bold tracking-wide text-[#A21414] uppercase">Tailor-Made Elegance</span>
                    <Sparkles className="text-[#A21414] w-4 h-4" />
                </motion.div>

                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#A21414] mb-8 uppercase tracking-tighter max-w-4xl mx-auto leading-[1.1]">
                    CRAFT YOUR <br className="hidden md:block" />DREAM CAKE
                </h2>

                <p className="text-[#2A2A2A] font-medium mb-12 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Have a unique idea, dietary requirement, or a massive celebration? Our master bakers will bring your wildest dessert imaginations to life with premium ingredients.
                </p>

                {/* Call To Action */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8">
                    <a
                        href="https://wa.me/1234567890?text=I'd like to place a custom cake order!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center bg-[#A21414] text-white px-10 py-5 rounded-full text-lg font-black tracking-wide overflow-hidden shadow-[0_20px_40px_rgba(162,20,20,0.25)] hover:shadow-[0_20px_50px_rgba(162,20,20,0.4)] hover:-translate-y-1 transition-all duration-300 w-full md:w-auto"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            CUSTOM CAKE ORDER
                        </span>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                    </a>

                    <div className="flex items-center gap-3 text-[#666666] text-sm md:text-base font-semibold bg-white/50 px-6 py-4 rounded-full border border-white/60">
                        <CalendarDays className="w-5 h-5 text-[#A21414]" />
                        <span>Requires 48hrs notice</span>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default BigCakeSection;
