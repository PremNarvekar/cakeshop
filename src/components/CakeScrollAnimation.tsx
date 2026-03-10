"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface Props {
    onLoadComplete: () => void;
}

const CakeScrollAnimation = ({ onLoadComplete }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const frameCount = 176;

    // Render logic with requestAnimationFrame
    const renderFrame = useCallback((frameIndex: number) => {
        if (!canvasRef.current || !images[frameIndex]) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        const img = images[frameIndex];

        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }, [images]);

    const onLoadCompleteRef = useRef(onLoadComplete);

    useEffect(() => {
        onLoadCompleteRef.current = onLoadComplete;
    }, [onLoadComplete]);

    // Preload frames
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `/cake/frames/${i}.webp`;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setIsLoaded(true);
                    onLoadCompleteRef.current();
                }
            };
            // Fallback for missing frames
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setIsLoaded(true);
                    onLoadCompleteRef.current();
                }
            }
            loadedImages.push(img);
        }
        setImages(loadedImages);

        // Cleanup
        return () => {
            loadedImages.forEach(img => {
                img.src = ""; // Abort pending requests if unmounted
            });
        }
    }, []);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (!canvasRef.current) return;
            canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
            canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
            if (isLoaded) {
                renderFrame(1);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [isLoaded, renderFrame]);

    useGSAP(() => {
        if (!isLoaded || !containerRef.current || !canvasRef.current) return;

        // render initial frame
        renderFrame(1);

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "+=400%", // 4 screens of scrolling for the cake animation
            scrub: 1, // smooth scrubbing
            pin: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.max(1, Math.floor(progress * frameCount))
                );
                renderFrame(frameIndex);
            }
        });

    }, { dependencies: [isLoaded] });

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden m-0 p-0 border-0 outline-none flex">
            <canvas
                ref={canvasRef}
                className="w-full h-full object-cover block"
            />
        </div>
    );
};

export default CakeScrollAnimation;
