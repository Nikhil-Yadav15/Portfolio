'use client';
import { motion } from 'motion/react';
import { GoogleGeminiEffect } from '@/components/ui/AuroraScrollWave';
import InfiniteMenu from '@/components/ui/infinite_menu';
import BlurText from "@/components/ui/BlurText";
import { techItems } from '@/data/Techs';

export default function TechStack() {
  return (
    <div 
      className="min-h-screen text-white relative"
      style={{ width: '100dvw', height: '100dvh' }}
    >
      <header className="text-center pt-5 pb-4 z-20 relative">
        <BlurText
                  text="Tech Stack"
                  delay={150}
                  animateBy="chars"
                  direction="top"
                  className="cursor-pointer text-5xl md:text-6xl lg:text-7xl font-bold flex justify-center-safe text-blue-100"/>
        <motion.p
          className="text-neutral-400 italic mt-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: 'easeInOut',
            repeatType: 'reverse'
          }}
        >
          Drag to see the full set of my tech constellation
        </motion.p>
      </header>

      {/* Content Box Above the Animation */}
      <div className="absolute md:top-[60%] top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
        <div 
          className="bg-white/10 backdrop-blur-md rounded-2xl p-1 md:p-2 border border-white/20 shadow-2xl flex flex-col justify-center items-center"
          style={{ 
            width: 'min(90dvw, 700px)', 
            height: 'min(90dvw, 500px)',
            aspectRatio: '1/1'
          }}
        >
          <InfiniteMenu items={techItems} />
         
        </div>
      </div>

      {/* Background Animation */}
      <GoogleGeminiEffect className="absolute inset-0" />
    </div>
  );
}
