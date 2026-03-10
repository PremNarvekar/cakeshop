"use client";

import { useScroll, useSpring, useTransform } from "framer-motion";
import { RefObject } from "react";

export function useScrollProgress(containerRef: RefObject<HTMLElement>) {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return smoothProgress;
}
