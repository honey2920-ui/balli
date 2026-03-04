import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';

export function DynamicIsland() {
  const { islandMessage, setIslandMessage } = useAppStore();

  useEffect(() => {
    if (islandMessage) {
      console.log("🏝️ Dynamic Island showing:", islandMessage);
      const timer = setTimeout(() => {
        setIslandMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [islandMessage, setIslandMessage]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100000] flex justify-center w-full max-w-[340px] pointer-events-none">
      <AnimatePresence mode="wait">
        {islandMessage && (
          <motion.div
            key={islandMessage}
            initial={{ opacity: 0, y: -60, scale: 0.7, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -60, scale: 0.7, filter: "blur(10px)" }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30,
              mass: 0.8
            }}
            className="bg-black/95 backdrop-blur-2xl text-white px-8 py-4 rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_25px_rgba(107,92,255,0.5)] flex items-center gap-4 border border-white/20 pointer-events-auto ring-1 ring-white/10"
          >
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_12px_#4ade80]" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-40" />
            </div>
            <span className="text-sm font-bold tracking-tight whitespace-nowrap drop-shadow-sm">
              {islandMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}