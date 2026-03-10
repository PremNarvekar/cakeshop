"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Configuration for scattered background elements
const elements = [
    { id: 1, type: "cherry", size: 40, x: "10%", y: "5%", rotate: 15, blur: 1, delay: 0 },
    { id: 2, type: "sprinkle-pink", size: 24, x: "85%", y: "15%", rotate: -45, blur: 2, delay: 0.5 },
    { id: 3, type: "sprinkle-blue", size: 20, x: "15%", y: "35%", rotate: 60, blur: 0, delay: 1 },
    { id: 4, type: "leaf", size: 35, x: "80%", y: "45%", rotate: -20, blur: 3, delay: 1.5 },
    { id: 5, type: "cherry", size: 55, x: "5%", y: "65%", rotate: -10, blur: 2, delay: 2 },
    { id: 6, type: "sprinkle-yellow", size: 18, x: "90%", y: "75%", rotate: 80, blur: 1, delay: 0.2 },
    { id: 7, type: "sprinkle-pink", size: 28, x: "25%", y: "85%", rotate: -80, blur: 3, delay: 0.8 },
    { id: 8, type: "leaf", size: 45, x: "75%", y: "90%", rotate: 45, blur: 0, delay: 1.2 },
    { id: 9, type: "sprinkle-blue", size: 22, x: "40%", y: "25%", rotate: -30, blur: 4, delay: 2.5 },
];

const renderShape = (type: string, size: number) => {
    switch (type) {
        case "cherry":
            return (
                <div className="relative" style={{ width: size, height: size }}>
                    <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-[#D61C4E] rounded-full shadow-inner" />
                    <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-[#A21414] rounded-full shadow-inner" />
                    <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-[#444444] origin-bottom -rotate-12" />
                    <div className="absolute top-0 right-1/2 w-0.5 h-1/2 bg-[#444444] origin-bottom rotate-12" />
                </div>
            );
        case "sprinkle-pink":
            return <div className="bg-[#E85A71] rounded-full shadow-sm" style={{ width: size / 2, height: size }} />;
        case "sprinkle-blue":
            return <div className="bg-[#4EA8DE] rounded-full shadow-sm" style={{ width: size / 2, height: size }} />;
        case "sprinkle-yellow":
            return <div className="bg-[#F9C74F] rounded-full shadow-sm" style={{ width: size / 2, height: size }} />;
        case "leaf":
            return (
                <div
                    className="bg-[#90BE6D] shadow-sm"
                    style={{
                        width: size,
                        height: size,
                        borderTopLeftRadius: '100%',
                        borderBottomRightRadius: '100%'
                    }}
                />
            );
        default:
            return null;
    }
};

const FloatingElement = ({ el, i, springScroll }: { el: any, i: number, springScroll: any }) => {
    // Generate slightly different parallax speeds for each element based on id
    const yRange = [0, -200 + (el.id * 15)];
    const yMove = useTransform(springScroll, [0, 1], yRange);
    const rotateMove = useTransform(springScroll, [0, 1], [el.rotate, el.rotate + 180]);

    return (
        <motion.div
            className="absolute"
            style={{
                left: el.x,
                top: el.y,
                y: yMove,
                rotate: rotateMove,
                filter: `blur(${el.blur}px)`,
                opacity: 0.8,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 0.8,
                scale: 1,
                // Add a gentle continuous float on top of the scroll parallax
                y: ["-10px", "10px"],
            }}
            transition={{
                opacity: { duration: 1, delay: el.delay },
                scale: { duration: 1, delay: el.delay, type: "spring" },
                y: {
                    duration: 3 + (i % 3), // random float duration
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: el.delay
                }
            }}
        >
            {renderShape(el.type, el.size)}
        </motion.div>
    );
};

const FloatingAssets = () => {
    const { scrollYProgress } = useScroll();
    const [mounted, setMounted] = useState(false);

    // Smooth physics-based scroll response
    const springScroll = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
            {elements.map((el, i) => (
                <FloatingElement key={el.id} el={el} i={i} springScroll={springScroll} />
            ))}
        </div>
    );
};

export default FloatingAssets;
