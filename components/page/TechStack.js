'use client';
import { motion } from 'motion/react';
import { GoogleGeminiEffect } from '@/components/ui/AuroraScrollWave';
import InfiniteMenu from '@/components/ui/infinite_menu';
import { techItems } from '@/data/Techs';
import { TextAnimate } from "@/components/ui/text-animate";
import { useIsMobile } from '@/hooks/use-mobile';

export default function TechStack() {
  const isMobile = useIsMobile();
  return (
    <div 
      className="min-h-screen text-white relative"
      style={{ width: '100dvw', height: '100dvh' }}
    >

      <header className="text-center pt-5 pb-4 z-20 relative">
        <TextAnimate animation="blurInUp"  delay={1} className={"cursor-text font-lora text-5xl md:text-6xl lg:text-7xl font-bold flex justify-center-safe text-blue-100"} by="character">  Tech Stack</TextAnimate>
        <motion.p
          className="text-neutral-400 font-lora italic mt-10"
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
      {!isMobile && <GoogleGeminiEffect className="absolute inset-0" />}
    </div>
  );
}
