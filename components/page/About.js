'use client'
import { useEffect, useState, lazy, Suspense } from "react";
import BlurText from "@/components/ui/BlurText";
import { Cover } from "@/components/ui/cover";
import DecryptedText from '@/components/ui/DecryptedText';
import { VideoText } from '@/components/ui/VideoTextMask';
import {TextRevealCard} from "@/components/ui/text-reveal-card";
import {motion} from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
const LazySpline = lazy(() => import('@splinetool/react-spline'));

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  // !
  const [forceTextAnimation, setForceTextAnimation] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // !
    setForceTextAnimation(true);
    // !
  }, []);

  if (isMobile === undefined) {
    return null;
  }

  return (
    <div className="min-h-screen w-[100dvw] flex flex-col bg-gradient-to-br from-black-800 via-gray-900 to-black lg:flex-row">
      {/* About Me Section - Full width on mobile, 50% on desktop */}
      <div className="w-full lg:w-[55dvw] flex items-center justify-center p-4 md:p-8  min-h-screen lg:min-h-auto">
        <div 
          className={`max-w-2xl space-y-8 transition-all duration-1000 transform text-center ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <BlurText
                  text="About Me"
                  delay={150}
                  animateBy="chars"
                  direction="top"
                  // !changed applied to all blurtext with hover
                  forceStart={forceTextAnimation}
                  // !
                  className="cursor-pointer text-6xl md:text-7xl lg:text-8xl font-bold flex justify-center text-blue-100"
                />

          {/* Sub-heading with animated words */}
          <div className="space-y-4">

            <BlurText
                  text="I am"
                  delay={150}
                  forceStart={forceTextAnimation}
                  animateBy="chars"
                  direction="top"
                  className="cursor-pointer text-2xl md:text-3xl text-purple-200 font-light flex justify-center"
                />
            
            <div className="space-y-3">
              {/* Engineer - Cosmic Blue Theme */}
              <div 
                className="group cursor-pointer transition-all duration-300 hover:scale-105"
              >
                  <Cover className="text-5xl md:text-6xl drop-shadow-2xl lg:text-7xl pb-2 font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Engineer</Cover>
                {/* </span> */}
              </div>

              {/* Developer - Purple Cosmic Theme */}
              <div 
                className="group cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-pink-300 group-hover:to-red-300 transition-all duration-300 drop-shadow-lg">
                <DecryptedText
                    text="Developer"
                    speed={100}
                    maxIterations={10}
                    characters="terabaap"
                    className="revealed"
                    animatedOn="hover"
                    parentClassName="all-letters"
                    encryptedClassName="encrypted"
                  />
                </span>
              </div>

              {/* Creator - Golden Starlight Theme */}
              <div 
                className="group cursor-pointer transition-all duration-300 hover:scale-105"
              >
                {/* <span className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:via-orange-200 group-hover:to-pink-200 transition-all duration-300 drop-shadow-lg"> */}
                <VideoText
                    src="/creator.mp4"
                    maintainAspectRatio={true}
                    fontSize="7rem"
                    className=""
                  >
                    Creator
                  </VideoText>
                {/* </span> */}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="">
            <div className="">
                      <TextRevealCard
                      text="With a passion for cutting-edge technology and elegant design, I craft digital experiences that push the boundaries of what's possible."
                      revealText="From concept to deployment, I believe in building products that not only function flawlessly but also inspire and delight."
                      // fontSize = 'text-2xl lg:text-3xl sm:text-[3rem]'
                      className=""
                      >
                    </TextRevealCard>
            </div>

            <BlurText
                  text="Building AI-powered web products that work seamlessly and spark curiosity."
                  delay={20}
                  animateBy="chars"
                  forceStart={forceTextAnimation}
                  direction="top"
                  className="text-xl md:text-2xl text-purple-100 leading-relaxed font-light"
                />
          </div>

          {/* Subtle decorative elements */}
          <div className="flex space-x-4 pt-8">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>

        {!isMobile && (
        <div className="w-full lg:w-[45dvw] relative overflow-hidden min-h-[50vh] hide-spline-watermark lg:min-h-screen">
            <Suspense fallback={<div>Loading 3D model...</div>}>
            <LazySpline scene="https://prod.spline.design/7qYwf6Jlk5mgmiyp/scene.splinecode" />
            </Suspense>
        </div>
        )}
                                                                
    </div>
  );
};

export default About;
