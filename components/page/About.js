'use client'
import { useEffect, useState, lazy, Suspense } from "react";
import BlurText from "@/components/ui/BlurText";
import { Cover } from "@/components/ui/cover";
import DecryptedText from '@/components/ui/DecryptedText';
import { VideoText } from '@/components/ui/VideoTextMask';
import {TextRevealCard} from "@/components/ui/text-reveal-card";
import {motion} from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import ScrambledText from '@/components/ui/ScrambledText';

const LazySpline = lazy(() => import('@splinetool/react-spline'));

const fadeInVariants = {
  hidden: { 
    opacity: 0, 
    y: 15,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6, 
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
  const [forceTextAnimation, setForceTextAnimation] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsVisible(true);
      setForceTextAnimation(true);
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
          <motion.div variants={fadeInVariants}>
            <BlurText
              text="About Me"
              delay={150}
              animateBy="chars"
              direction="top"
              forceStart={forceTextAnimation}
              className="cursor-pointer font-lora text-6xl md:text-7xl lg:text-8xl font-bold flex justify-center text-blue-100"
            />
          </motion.div>

          <motion.div className="space-y-4" variants={fadeInVariants}>
            <motion.div variants={fadeInVariants}>
              <BlurText
                text="I am"
                delay={150}
                forceStart={forceTextAnimation}
                animateBy="chars"
                direction="top"
                className="cursor-pointer font-lora text-2xl md:text-3xl text-purple-200 font-light flex justify-center"
              />
            </motion.div>
            
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
                  fontSize="7rem"
                >
                  Creator
                </VideoText>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="max-[350px]:w-[87dvw] max-[350px]:ml-[3rem] flex items-center justify-center"
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
          <Suspense fallback={<div>Loading 3D model...</div>}>
            <LazySpline scene="https://prod.spline.design/7qYwf6Jlk5mgmiyp/scene.splinecode" />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default About;
