"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const overlays = [
    "MAGICAL IS ABOUT TO HAPPEN",
    "CRAFTED IN THE CANDY UNIVERSE",
    "EXPLOSION OF TEXTURES",
    "WELCOME TO THE SWEET SIDE"
];

const CakeTextOverlays = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // The parent has 800vh scroll space.
        // We want these texts to sequence one after another across that space.
        if (!containerRef.current) return;

        const texts = gsap.utils.toArray(".hero-text-overlay");

        // Create a master timeline locked to the parent's scroll
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current, // Pin is on the parent, this just follows the scroll context
                start: "top top",
                end: "+=800%",
                scrub: 1,
            }
        });

        texts.forEach((text: any, i) => {
            // Fade in, scale down slightly
            tl.fromTo(text,
                { opacity: 0, scale: 1.2, y: 50 },
                { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" }
            );
            // Hold
            tl.to(text, { opacity: 1, duration: 0.5 });
            // Fade out
            tl.to(text, { opacity: 0, scale: 0.9, y: -50, duration: 1, ease: "power2.in" });
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
            {overlays.map((text, index) => (
                <h2
                    key={index}
                    className="hero-text-overlay absolute text-4xl md:text-6xl lg:text-8xl font-black text-white leading-[1] tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-w-5xl uppercase text-center opacity-0 pointer-events-none will-change-transform italic italic-black px-4"
                >
                    {text}
                </h2>
            ))}
        </div>
    );
};

export default CakeTextOverlays;
