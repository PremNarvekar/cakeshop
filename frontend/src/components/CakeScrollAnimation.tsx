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
    const currentFrameRef = useRef(0);

    // Render logic
    const renderFrame = useCallback((frameIndex: number) => {
        if (!canvasRef.current || !images[frameIndex]) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        const img = images[frameIndex];
        currentFrameRef.current = frameIndex;

        // Cover-fit the image into the canvas
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        context.clearRect(0, 0, canvas.width, canvas.height);
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

        return () => {
            loadedImages.forEach(img => {
                img.src = "";
            });
        }
    }, []);

    // Handle Resize — set canvas to exact CSS pixel dimensions (no devicePixelRatio scaling)
    useEffect(() => {
        const handleResize = () => {
            if (!canvasRef.current) return;
            const w = window.innerWidth;
            const h = window.innerHeight;

            // Set canvas internal resolution to match CSS size exactly
            // This prevents any scaling/blurring
            canvasRef.current.width = w;
            canvasRef.current.height = h;

            if (isLoaded) {
                renderFrame(currentFrameRef.current || 1);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [isLoaded, renderFrame]);

    useGSAP(() => {
        if (!isLoaded || !containerRef.current || !canvasRef.current) return;

        // Force initial frame render immediately
        renderFrame(0);

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "+=400%",
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.max(0, Math.floor(progress * frameCount))
                );
                renderFrame(frameIndex);
            }
        });

    }, { scope: containerRef, dependencies: [isLoaded] });

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-[#FDFBF7] overflow-hidden m-0 p-0 border-0 outline-none flex items-center justify-center">
            <canvas
                ref={canvasRef}
                className="transition-opacity duration-1000"
                style={{ 
                    display: "block", 
                    width: "100%", 
                    height: "100%",
                    opacity: isLoaded ? 1 : 0
                }}
            />
        </div>
    );
};

export default CakeScrollAnimation;
