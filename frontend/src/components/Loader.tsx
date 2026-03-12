"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

const Loader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    // Total animation time before unmounting
    const timer = setTimeout(() => {
      console.log("LOADER: Timer finished");
      onComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Cake Parts Animation Staggers
  const containerVars: any = {
    animate: { transition: { staggerChildren: 0.3 } }
  };

  const dropInBounce: any = {
    initial: { y: -200, opacity: 0, scale: 0.8 },
    animate: {
      y: 0, opacity: 1, scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 15 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        y: "-100%",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
      }}
      className="fixed inset-0 z-[100] bg-[#FDFBF7] flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      <div className="relative flex flex-col items-center justify-center w-64 h-64">

        {/* Assembling Cake */}
        <motion.div
          variants={containerVars}
          initial="initial"
          animate="animate"
          className="relative flex flex-col items-center z-10"
        >
          {/* Cherry */}
          <motion.div variants={dropInBounce} className="relative z-50 -mb-2">
            <div className="w-5 h-5 bg-[#A21414] rounded-full shadow-inner shadow-black/20" />
            {/* Cherry Stem */}
            <div className="absolute -top-3 left-2 w-3 h-4 border-t-2 border-r-2 border-[#820D0D] rounded-tr-full" />
          </motion.div>

          {/* Icing Top */}
          <motion.div variants={dropInBounce} className="relative z-40 -mb-2">
            <div className="w-24 h-8 bg-white rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.05)] border-b-2 border-[#F3EFE6]" />
            {/* Drips */}
            <div className="absolute top-1/2 left-4 w-3 h-6 bg-white rounded-full border-r-2 border-b-2 border-[#F3EFE6]" />
            <div className="absolute top-1/2 right-6 w-3 h-5 bg-white rounded-full border-r-2 border-b-2 border-[#F3EFE6]" />
          </motion.div>

          {/* Cake Layer 1 (Vanilla) */}
          <motion.div variants={dropInBounce} className="relative z-30 -mb-1">
            <div className="w-24 h-10 bg-[#F9E2AF] rounded-xl shadow-inner shadow-[#DEBC7E]/20" />
          </motion.div>

          {/* Filling (Strawberry) */}
          <motion.div variants={dropInBounce} className="relative z-20 -mb-1">
            <div className="w-24 h-3 bg-[#E85A71] rounded-full shadow-inner shadow-[#D61C4E]/40" />
          </motion.div>

          {/* Cake Base (Vanilla) */}
          <motion.div variants={dropInBounce} className="relative z-10 -mb-1">
            <div className="w-24 h-10 bg-[#F9E2AF] rounded-b-xl shadow-inner shadow-[#DEBC7E]/20" />
          </motion.div>

          {/* Cake Stand / Plate */}
          <motion.div variants={dropInBounce} className="relative z-0 mt-2">
            <div className="w-32 h-4 bg-[#E8E2D5] rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.1)] border-b-4 border-[#DCD5C3]" />
            <div className="w-16 h-4 bg-[#DCD5C3] mx-auto rounded-b-lg" />
          </motion.div>

        </motion.div>

        {/* Animated Background Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-radial from-[#F9C74F] to-transparent rounded-full blur-3xl z-0"
        />

        {/* Elegant Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
          className="absolute -bottom-16 text-center w-full"
        >
          <span className="text-xl font-black text-[#2A2A2A] tracking-tighter shadow-sm">
            Baking fresh...
          </span>
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#A21414] rounded-full mx-auto mt-2"
          />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Loader;
