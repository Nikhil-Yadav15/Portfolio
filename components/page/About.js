'use client'
import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import DecryptedText from '@/components/ui/DecryptedText';
import { VideoText } from '@/components/ui/VideoTextMask';
import {TextRevealCard} from "@/components/ui/text-reveal-card";
import {motion} from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import ScrambledText from '@/components/ui/ScrambledText';

// const LazySpline = lazy(() => import('@splinetool/react-spline'));
import Spline from '@splinetool/react-spline';

// Modern 3D Model Loading Skeleton with Ripple Effect
const SplineLoadingSkeleton = () => {
  const containerRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const rippleIdRef = useRef(0);
  const lastRippleTime = useRef(0);

  // Trigger ripple on mouse move (throttled)
  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastRippleTime.current < 400) return; // Throttle to every 400ms
    
    lastRippleTime.current = now;
    const rippleId = rippleIdRef.current++;
    setRipples(prev => [...prev, rippleId]);
    
    // Auto-remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(id => id !== rippleId));
    }, 1000);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full min-h-[50dvh] lg:min-h-[100dvh] flex items-center justify-center relative overflow-hidden cursor-default"
      onMouseMove={handleMouseMove}
    >
      {/* Large pulsing glow */}
      <motion.div 
        className="absolute w-[25dvw] h-[25dvw] rounded-full bg-purple-500/10 blur-[8dvw]"
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Loader container */}
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-[8dvw] h-[8dvw] min-w-[60px] min-h-[60px] max-w-[120px] max-h-[120px]">
          {/* Water ripple effects */}
          {ripples.map((id) => (
            <motion.div
              key={id}
              className="absolute inset-0 rounded-full border-2 border-purple-400/60"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 8, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          ))}
          
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500/60 border-r-purple-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner counter-rotating ring */}
          <motion.div
            className="absolute inset-[12%] rounded-full border-2 border-transparent border-b-blue-400/50 border-l-blue-400/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Pulsing center orb */}
          <motion.div
            className="absolute inset-[25%] rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30"
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 0.9, 0.4]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        {/* Floating loading text */}
        <motion.p
          className="text-neutral-400 font-lora italic text-sm"
          animate={{ y: [0, -6, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: 'easeInOut',
            repeatType: 'reverse'
          }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
};

// Custom component for character-by-character blur animation without re-render
const BlurInText = ({ children, className, delay = 0 }) => {
  const characters = children.split('');
  
  const characterVariants = {
    hidden: { 
      opacity: 0, 
      filter: "blur(10px)", 
      y: 20 
    },
    visible: (i) => ({
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        delay: delay + i * 0.03,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <span className={className}>
      {characters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          custom={i}
          variants={characterVariants}
          initial="hidden"
          animate="visible"
          className="inline-block whitespace-pre"
          style={{ display: 'inline-block' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const fadeInVariants = {
  hidden: { 
    opacity: 0, 
    y: 15,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8, 
      delay: 1,
      ease: "easeOut",
      type: "tween" 
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, 
      delayChildren: 0.05,  
      type: "tween"
    }
  }
};

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  // const [forceTextAnimation, setForceTextAnimation] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsVisible(true);
      // setForceTextAnimation(true);
    });
    
    return () => cancelAnimationFrame(timer);
  }, []);

  if (isMobile === undefined) {
    return null;
  }

  return (
    <div className="h-[100dvh] w-[100dvw] overflow-hidden flex flex-col lg:flex-row bg-black/50">
      <div className="w-full lg:w-[55dvw] h-[100dvh] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          className="max-w-2xl space-y-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.h2 variants={fadeInVariants} className="cursor-text font-lora text-6xl md:text-7xl lg:text-8xl font-bold flex justify-center text-blue-100">
            <BlurInText delay={1.5}>About Me</BlurInText>
          </motion.h2>

          <motion.div className="space-y-4" variants={fadeInVariants}>
            <motion.p variants={fadeInVariants} className="cursor-text font-lora text-2xl md:text-3xl text-purple-200 font-light flex justify-center">
              <BlurInText delay={1.7}>I am</BlurInText>
            </motion.p>
            
            <div className="space-y-3">
              <motion.div 
                className="group cursor-pointer transition-all duration-300 hover:scale-105"
                variants={fadeInVariants}
              >
                <ScrambledText
                  radius={120}
                  duration={800}
                  speed={0.6}
                  scrambleChars="!@#$%^&*()_+-=[]{}|;:,.<>?"
                  className="text-5xl md:text-6xl drop-shadow-2xl lg:text-7xl pb-2 font-bold bg-gradient-to-bl from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  Engineer
                </ScrambledText>
              </motion.div>

              <motion.div 
                className="group cursor-text transition-all duration-300 hover:scale-105"
                variants={fadeInVariants}
              >
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-pink-300 group-hover:to-red-300 transition-all duration-300 drop-shadow-lg">
                  <DecryptedText
                    text="Developer"
                    speed={100}
                    maxIterations={10}
                    characters="PYTHONCSSJAVASCRIPT"
                    className="revealed"
                    animatedOn="hover"
                    parentClassName="all-letters"
                    encryptedClassName="encrypted"
                  />
                </span>
              </motion.div>

              <motion.div variants={fadeInVariants}>
                <VideoText
                  src="/creator.mp4"
                  maintainAspectRatio={true}
                  fontSize="clamp(6rem, 8vw, 7rem)"
                >
                  Creator
                </VideoText>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            // className="max-[350px]:w-[87dvw] max-[350px]:ml-[3rem] flex items-center justify-center"
            className="w-full px-4 sm:px-6 md:px-8 flex items-center justify-center"
            variants={fadeInVariants}
          >
            <TextRevealCard
              text="With a passion for cutting-edge technology and elegant design, I craft digital experiences that push the boundaries of what's possible."
              revealText="From concept to deployment, I believe in building products that not only function flawlessly but also inspire and delight."
              className="font-lora text-wrap"
            />
          </motion.div>
        </motion.div>
      </div>

      {!isMobile && (
        <div className="w-full lg:w-[45dvw] flex items-start justify-center relative overflow-hidden min-h-[50vh] hide-spline-watermark lg:min-h-screen">
          <Suspense fallback={<SplineLoadingSkeleton />}>
            <Spline scene="https://prod.spline.design/WCl3Q-TO45nDydSB/scene.splinecode" />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default About;
