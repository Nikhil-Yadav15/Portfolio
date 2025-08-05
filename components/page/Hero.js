'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlurText from '@/components/ui/BlurText';
import GradientText from '@/components/ui/GradientText';
import RotatingText from '@/components/ui/RotatingText';
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei'

function RobotModel({ ...props }) {
  const group = useRef()
  const gltf = useGLTF('/robot_compress.glb')
  const { actions, names } = useAnimations(gltf.animations, group)
  const [isPlaying, setIsPlaying] = useState(false)

  // Function to play animation
  const playAnimation = () => {
    if (names.length > 0) {
      names.forEach((name) => {
        if (actions[name]) {
          const action = actions[name]
          
          action
            .reset()
            .setLoop(2201, 1)
            .fadeIn(0.5)
          
          // Set the animation to start at 2 seconds
          action.time = 2
          action.play()
          setIsPlaying(true)
          
          // Stop animation at 80% to prevent model disappearing
          const duration = action.getClip().duration
          const stopTime = (duration - 2) * 0.8 // 80% of remaining duration after 2 sec start
          
          setTimeout(() => {
            action.paused = true
            setIsPlaying(false)
            console.log(`Animation ${name} stopped before disappearing`)
          }, stopTime * 1000)
        }
      })
    }
  }

  // Handle click event
  const handleClick = (event) => {
    event.stopPropagation()
    if (!isPlaying) {
      playAnimation()
    }
  }

  // Play animation on component mount
  useEffect(() => {
    playAnimation()
  }, [actions, names])

  // **NEW: Add mouse interactivity for larger screens**
  useFrame(({ mouse }) => {
    if (!group.current) return;

    // Only apply mouse tracking on larger screens
    if (window.innerWidth >= 768) {
      // Calculate target rotation based on mouse position
      const targetX = mouse.y * 0.3; // Vertical mouse movement affects X rotation
      const targetY = mouse.x * 0.3; // Horizontal mouse movement affects Y rotation

      // Smoothly interpolate to target rotation for natural movement
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={group} {...props}>
      <primitive 
        object={gltf.scene} 
        onClick={handleClick}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'default'
        }}
      />
    </group>
  )
}

useGLTF.preload('/robot_compress.glb')

const HeroSection = () => {
  // ... (all your existing state and effects remain exactly the same)
  const [currentInterestIndex, setCurrentInterestIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const interests = [
    "Web Development",
    "Machine Learning", 
    "Data Science",
    "UI/UX Design",
    "Automation",
    "Mobile Apps"
  ];

  useEffect(() => {
    setIsClient(true);
    setIsVisible(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInterestIndex((prev) => (prev + 1) % interests.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [interests.length]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleTouch = () => {
    if (isMobile) {
      setIsHovering(!isHovering);
    }
  };

  // All your animation variants remain the same...
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const avatarVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.8 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { delay: 0.2, duration: 0.8, ease: 'easeOut', type: 'spring', bounce: 0.3 }
    }
  };

  const greetingVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.5, duration: 1.0, ease: 'easeOut' } }
  };

  const nameVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.6, duration: 1.0, ease: 'easeOut' } }
  };

  const developerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.7, duration: 1.0, ease: 'easeOut' } }
  };

  const interestSectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.9, duration: 1.0, ease: 'easeOut' } }
  };

  const placeholderVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { delay: 1.2, duration: 0.6, ease: 'easeOut' } }
  };

  const textRevealVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  if (!isClient) {
    return null;
  }

  return (
    <motion.section 
      className="min-h-screen w-full flex items-center justify-center overflow-hidden "
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop & Tablet Layout */}
        <div className="hidden md:flex md:h-screen md:items-center md:justify-between">
          <motion.div 
            className="w-full lg:w-3/5 h-full flex flex-col justify-center items-center space-y-6"
            variants={containerVariants}
          >
            <motion.div 
              className="flex-[0.35] flex items-center justify-center relative"
              variants={avatarVariants}
            >
              <UniqueAvatarShape 
                isHovering={isHovering}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouch={handleTouch}
                size="large"
                isMobile={isMobile}
              />
            </motion.div>

            {/* All other JSX sections remain exactly the same... */}
            <motion.div 
              className="flex-[0.2] flex flex-col items-center justify-center text-center space-y-4"
              variants={containerVariants}
            >
              <div className="flex items-center space-x-4 text-4xl lg:text-5xl">
                <motion.span 
                  className="text-gray-300 font-light"
                  variants={greetingVariants}
                >
                  <BlurText
                  text="Hi, I am"
                  delay={150}
                  animateBy="chars"
                  direction="top"
                  className="text-4xl"
                />
                </motion.span>
                <motion.span 
                  className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold"
                  variants={nameVariants}
                >
                  <GradientText
                    colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                    animationSpeed={3}
                    showBorder={false}
                    className="custom-class"
                  >
                    Nikhil Yadav  
                  </GradientText>
                </motion.span>
              </div>
            </motion.div>

            <motion.div 
              className="flex-[0.2] flex items-center justify-center text-center"
              variants={developerVariants}
            >
              <div className="text-gray-300 text-2xl font-medium leading-relaxed">
                  <BlurText
                    as="span"
                    text="I am "
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="text-gray-300"
                  />
                  <BlurText
                  as="span"
                  text="Full Stack Developer"
                  delay={150}
                  animateBy="chars"
                  direction="top"
                  className="font-semibold"
                  gradientClass="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
                />
                  <BlurText
                    as="span"
                    text=" | Advancing in "
                    delay={170}
                    animateBy="chars"
                    direction="top"
                    className="text-gray-300"
                  />
                  <BlurText
                    as="span"
                    text="Machine Learning"
                    delay={170}
                    animateBy="chars"
                    direction="top"
                    gradientClass="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold"
                  />
                  <BlurText
                    as="span"
                    text=" | Strengthening "
                    delay={180}
                    animateBy="chars"
                    direction="top"
                    className="text-gray-300"
                  />
                  <BlurText
                    as="span"
                    text="DSA"
                    delay={180}
                    animateBy="chars"
                    direction="top"
                    gradientClass="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold"
                  />
                  <BlurText
                    as="span"
                    text=" | Targeting "
                    delay={190}
                    animateBy="chars"
                    direction="top"
                    className="text-gray-300"
                  />
                  <BlurText
                    as="span"
                    text="AI/ML specialization"
                    delay={185}
                    animateBy="chars"
                    direction="top"
                    gradientClass="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-semibold"
                  />
                </div>

            </motion.div>

            <motion.div 
              className="flex-[0.25] flex flex-col items-center justify-center text-center"
              variants={interestSectionVariants}
            >
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 text-2xl lg:text-3xl">
                <span className="text-gray-400"><BlurText
                                                          text="I am interested in"
                                                          delay={110}
                                                          animateBy="chars"
                                                          direction="top"
                                                          className="text-2xl"
                                                        /></span>
                <div className="h-12 flex items-center">
                  <motion.span 
                  className="text-gray-300 font-light"
                  variants={greetingVariants}
                >
                  <RotatingText
                      texts={interests}
                      mainClassName="px-2 sm:px-2 md:px-3 bg-gradient-to-r from-emerald-400 to-blue-400  font-semibold overflow-hidden text-white py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                      staggerFrom={"last"}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-120%" }}
                      staggerDuration={0.05}
                      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                      rotationInterval={3000}
                    /></motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
  className="hidden lg:flex lg:w-3/5 h-full items-center justify-center"
  variants={placeholderVariants}
  style={{ overflow: 'hidden' }} // Prevent any overflow issues
>
  <div className="w-full h-full" style={{ minHeight: '500px' }}>
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35 }} // Moved camera back and increased FOV
      style={{ background: 'transparent' }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={1} />
      {/* <Environment preset="night" /> */}
      <directionalLight position={[1, 1, 1]} intensity={1} />
      
      <RobotModel 
        position={[0, -1, 0]}  // Centered vertically instead of [0, -2, 0]
        scale={[1, 1, 1]}  // Scaled down to fit better
      />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={5}  // Increased minimum distance
        maxDistance={10} // Increased maximum distance
        autoRotate={false}
      />
    </Canvas>
  </div>
</motion.div>

        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col min-h-screen py-8">
          <motion.div 
            className="flex-[0.35] flex items-center justify-center mb-6"
            variants={avatarVariants}
          >
            <UniqueAvatarShape 
              isHovering={isHovering}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouch={handleTouch}
              size="mobile"
              isMobile={isMobile}
            />
          </motion.div>

          <motion.div 
            className="flex-[0.15] flex flex-col items-center justify-center text-center space-y-2 mb-4"
            variants={containerVariants}
          >
            <motion.span 
              className="text-gray-300 text-lg font-light"
              variants={greetingVariants}
            >
              <BlurText
                  text="Hi, I am"
                  delay={150}
                  animateBy="chars"
                  direction="top"

                  className="text-4xl "
                />
            </motion.span>
            <motion.span 
              className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-3xl font-bold"
              variants={nameVariants}
            >
              <GradientText
                    colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                    animationSpeed={3}
                    showBorder={false}
                    className="custom-class"
                  >
                    Nikhil Yadav  
                  </GradientText>
            </motion.span>
          </motion.div>

          <motion.div 
            className="flex-[0.25] flex items-center justify-center text-center px-4 mb-6"
            variants={developerVariants}
          >
            <div className="text-gray-300 text-md font-medium leading-relaxed">
                  <BlurText
                    as="span"
                    text="I am "
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="text-gray-300"
                  />
                  <BlurText
                  as="span"
                  text="Full Stack Developer"
                  delay={150}
                  animateBy="chars"
                  direction="top"
                  className="font-semibold"
                  gradientClass="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
                />
                  <BlurText
                    as="span"
                    text=" | Advancing in "
                    delay={170}
                    animateBy="chars"
                    direction="top"
                    className="text-gray-300"
                  />
                  <BlurText
                    as="span"
                    text="Machine Learning"
                    delay={170}
                    animateBy="chars"
                    direction="top"
                    gradientClass="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold"
                  />
                  <BlurText
                    as="span"
                    text=" | Strengthening "
                    delay={180}
                    animateBy="chars"
                    direction="top"
                    className="text-gray-300"
                  />
                  <BlurText
                    as="span"
                    text="DSA"
                    delay={180}
                    animateBy="chars"
                    direction="top"
                    gradientClass="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold"
                  />
                  <BlurText
                    as="span"
                    text=" | Targeting "
                    delay={190}
                    animateBy="chars"
                    direction="top"
                    className="text-gray-300"
                  />
                  <BlurText
                    as="span"
                    text="AI/ML specialization"
                    delay={185}
                    animateBy="chars"
                    direction="top"
                    gradientClass="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-semibold"
                  />
                </div>

          </motion.div>

          <motion.div 
            className="flex-[0.25] flex flex-col items-center justify-center text-center"
            variants={interestSectionVariants}
          >
            <div className="flex flex-col items-center space-y-3">
              <span className="text-gray-400 text-lg"><BlurText
                                                          text="I am interested in"
                                                          delay={110}
                                                          animateBy="chars"
                                                          direction="top"
                                                          className="text-2xl"
                                                        /></span>
              <div className="h-8 flex items-center">
                {/* <AnimatePresence mode="wait">
                  <motion.span
                    key={currentInterestIndex}
                    className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-xl font-semibold"
                    variants={textRevealVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {interests[currentInterestIndex]}
                  </motion.span>
                </AnimatePresence> */}
                <motion.span 
                  className="text-gray-300 font-light"
                  variants={greetingVariants}
                >
                  <RotatingText
                      texts={interests}
                      mainClassName="px-2 sm:px-2 md:px-3 bg-gradient-to-r from-emerald-400 to-blue-400  font-semibold overflow-hidden text-white py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                      staggerFrom={"last"}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-120%" }}
                      staggerDuration={0.05}
                      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                      rotationInterval={3500}
                    /></motion.span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

// FIXED: Using original SVG path morphing with clipPath instead of patterns
const UniqueAvatarShape = ({ isHovering, onMouseEnter, onMouseLeave, onTouch, size, isMobile }) => {
  const svgRef = useRef();
  const [pathData, setPathData] = useState('');
  const [gifKey, setGifKey] = useState(0);

  // YOUR ORIGINAL EXACT PATHS - preserved completely!
  const defaultPath = "M200,50 C280,30 350,80 380,150 C400,220 370,290 320,340 C270,390 200,380 150,350 C100,320 80,250 90,180 C100,110 140,70 200,50 Z";
  const hoverPath = "M200,40 C290,20 360,70 390,140 C410,210 380,280 330,330 C280,380 210,390 160,360 C110,330 70,260 80,190 C90,120 130,60 200,40 Z";

  // Size configurations
  const sizeConfig = {
    large: { 
      container: "w-[24rem] h-[24rem] lg:w-[24rem] lg:h-[24rem]",
      viewBox: "80 46 330 330"
    },
    mobile: { 
      container: "w-[20rem] h-[20rem]",
      viewBox: "0 0 400 400"
    }
  };

  const config = sizeConfig[size] || sizeConfig.large;

  useEffect(() => {
    setPathData(defaultPath);
  }, []);

  useEffect(() => {
    if (isHovering) {
      setGifKey(prev => prev + 1);
    }
  }, [isHovering]);

  // YOUR ORIGINAL SMOOTH PATH MORPHING - preserved completely!
  useEffect(() => {
    if (!svgRef.current) return;

    const targetPath = isHovering ? hoverPath : defaultPath;
    
    let start = Date.now();
    const duration = 800;
    const startPath = pathData;

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 1) {
        setPathData(progress < 0.5 ? startPath : targetPath);
        requestAnimationFrame(animate);
      } else {
        setPathData(targetPath);
      }
    };

    animate();
  }, [isHovering]);

  // Generate unique IDs
  const clipPathId = `avatarClip-${size}`;

  return (
    <div 
      className={`relative cursor-pointer ${config.container}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouch}
      onClick={onTouch}
    >
      {/* Mobile: Simple approach (working fine) */}
      {isMobile ? (
        <MobileAvatarImage 
          isHovering={isHovering}
          pathData={pathData}
          config={config}
          gifKey={gifKey}
        />
      ) : (
        /* FIXED: Desktop SVG with clipPath instead of patterns */
        <svg
          ref={svgRef}
          viewBox={config.viewBox}
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.3))' }}
        >
          <defs>
            <radialGradient id={`avatarGradient-${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8a2be2" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff1493" stopOpacity="0.4" />
            </radialGradient>
            
            <radialGradient id={`hoverGradient-${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff1493" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#00f5ff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8a2be2" stopOpacity="0.5" />
            </radialGradient>

            {/* FIXED: ClipPath with your exact morphing paths */}
            <clipPath id={clipPathId}>
              <path d={pathData} />
            </clipPath>

            <filter id={`glow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background glow layers */}
          <path
            d={pathData}
            fill={isHovering ? `url(#hoverGradient-${size})` : `url(#avatarGradient-${size})`}
            className="opacity-60"
            style={{ filter: 'blur(12px)' }}
          />

          <path
            d={pathData}
            fill={isHovering ? `url(#hoverGradient-${size})` : `url(#avatarGradient-${size})`}
            className="opacity-40"
            style={{ filter: 'blur(6px)' }}
          />

          {/* FIXED: Static Image using clipPath */}
          <image 
            href="/coder.png"
            x="0" y="0" 
            width="400" 
            height="400" 
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipPathId})`}
            className={`transition-opacity duration-500 ${
              isHovering ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          {/* FIXED: GIF Image using clipPath */}
          <image 
            href={`/avatar-animated.gif?${gifKey}`}
            x="0" y="0" 
            width="400" 
            height="400" 
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipPathId})`}
            className={`transition-opacity duration-500 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Border */}
          <path
            d={pathData}
            fill="none"
            stroke={isHovering ? "#ff1493" : "#00f5ff"}
            strokeWidth="2"
            className="drop-shadow-2xl"
            style={{ filter: `url(#glow-${size})` }}
          />
        </svg>
      )}

      {/* Floating Particles */}
      <FloatingParticles isHovering={isHovering} size={size} />

      {/* Energy Rings */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 rounded-full border opacity-30 ${
              isHovering ? "border-pink-400" : "border-cyan-400"
            }`}
            style={{
              borderWidth: '1px',
              scale: 1.1 + i * 0.1,
            }}
            animate={{
              rotate: 360,
              scale: isHovering ? 1.3 + i * 0.1 : 1.1 + i * 0.1
            }}
            transition={{
              rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.8, ease: "easeOut" }
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Mobile component (working fine, unchanged)
const MobileAvatarImage = ({ isHovering, pathData, config, gifKey }) => {
  const maskSvg = `url("data:image/svg+xml,${encodeURIComponent(`
    <svg viewBox="${config.viewBox}" xmlns="http://www.w3.org/2000/svg">
      <path d="${pathData}" fill="white"/>
    </svg>
  `)}")`;

  const maskStyle = {
    WebkitMaskImage: maskSvg,
    maskImage: maskSvg,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  };

  return (
    <div className="relative w-full h-full">
      <div 
        className={`w-full h-full bg-center bg-cover absolute inset-0 transition-opacity duration-500 ${
          isHovering ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          backgroundImage: 'url(/coder.png)',
          filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.3))',
          ...maskStyle
        }}
      />
      
      <div 
        className={`w-full h-full bg-center bg-cover absolute inset-0 transition-opacity duration-500 ${
          isHovering ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(/avatar-animated.gif?${gifKey})`,
          filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.3))',
          ...maskStyle
        }}
      />
      
      <div 
        className="absolute inset-0 flex items-center justify-center bg-gray-700 text-6xl opacity-0 transition-opacity duration-300"
        style={maskStyle}
      >
        👨‍💻
      </div>
    </div>
  );
};

// FloatingParticles component (unchanged)
const FloatingParticles = ({ isHovering, size }) => {
  const particleCount = size === 'mobile' ? 8 : 12;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${
            i % 4 === 0 ? "bg-cyan-400" :
            i % 4 === 1 ? "bg-purple-400" :
            i % 4 === 2 ? "bg-pink-400" : "bg-blue-400"
          }`}
          style={{
            left: `${20 + (i * 8) % 60}%`,
            top: `${25 + (i * 12) % 50}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 20, 0],
            scale: isHovering ? [1, 1.5, 1] : [0.5, 1, 0.5],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
};

const Page = () => {
  return <HeroSection />
}

export default Page;
