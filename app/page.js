'use client';
import { useRef, useEffect, useState, Suspense, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { BlackHoleModel } from '@/components/scenes/BlackHoleModel';
import { SpacedriveModel } from '@/components/scenes/SpacedriveModel';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import MainContent from '@/components/page/MainContent';
import Hero from '@/components/page/Hero';
import ShaderBackground from '@/components/ui/shader-background';
import Loader from '@/components/ui/StartingLoader';
// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Preload models
useGLTF.preload('/blackhole_compress.glb');
useGLTF.preload('/spacedrive_fab_compress.glb');

export default function GlassBreakPage() {
  // Core Refs
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const fragmentsRef = useRef([]);
  const crackOverlayRef = useRef(null);
  const audioRef = useRef(null);
  const blackHoleCanvasRef = useRef(null);
  const mainScrollTrigger = useRef(null);
  // !
  // Add these new states after your existing state declarations
const [blackHoleCompleted, setBlackHoleCompleted] = useState(false);
const [autoTransitionTriggered, setAutoTransitionTriggered] = useState(false);
const [soundPlayed, setSoundPlayed] = useState(false);
  // !
  
  // System States
  const [isHydrated, setIsHydrated] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  
  // Scene States
  const [sceneState, setSceneState] = useState({
    current: 'glass',
    transitioning: false,
    modelsLoaded: false,
    gpuWarmedUp: false
  });
  
  // Animation States
  const [heroMounted, setHeroMounted] = useState(true);
  const [contentFragments, setContentFragments] = useState([]);
  const [fragmentsGenerated, setFragmentsGenerated] = useState(false); // ✅ NEW: Track if fragments are ready
  const [showBlackHole, setShowBlackHole] = useState(false);
  const [startBlackHoleAutoScale, setStartBlackHoleAutoScale] = useState(false);
  const [showSpacedrive, setShowSpacedrive] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [isMainContentActive, setIsMainContentActive] = useState(false);

  // User Interaction Tracking
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      console.log('✅ User interaction detected - audio enabled');
      
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

    // !
    // ✅ MODIFY: Update your emergency cleanup useEffect
useEffect(() => {
  return () => {
    if (!isMainContentActive) {
      console.log('🚨 Emergency cleanup on abnormal unmount');
      deleteAllFragments();
      setHeroMounted(false);
      setBlackHoleCompleted(false);        // ✅ Reset new state
      setAutoTransitionTriggered(false);   // ✅ Reset new state
    }
  };
}, []);

    // !
  // Component Initialization
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // GPU Warmup
  useEffect(() => {
    if (!isHydrated) return;

    const warmupGPU = async () => {
      const warmupCanvas = document.createElement('canvas');
      warmupCanvas.width = 256;
      warmupCanvas.height = 256;
      warmupCanvas.style.position = 'absolute';
      warmupCanvas.style.top = '-1000px';
      document.body.appendChild(warmupCanvas);

      const warmupRenderer = new THREE.WebGLRenderer({ 
        canvas: warmupCanvas, 
        antialias: false 
      });
      const warmupScene = new THREE.Scene();
      const warmupCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

      const warmupGeometry = new THREE.SphereGeometry(1, 32, 32);
      const warmupMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        metalness: 0.8,
        roughness: 0.2
      });
      const warmupMesh = new THREE.Mesh(warmupGeometry, warmupMaterial);
      warmupScene.add(warmupMesh);

      warmupScene.add(new THREE.AmbientLight(0x404040, 0.5));
      warmupScene.add(new THREE.DirectionalLight(0xffffff, 1));

      for (let i = 0; i < 10; i++) {
        warmupMesh.rotation.y += 0.1;
        warmupRenderer.render(warmupScene, warmupCamera);
      }

      warmupGeometry.dispose();
      warmupMaterial.dispose();
      warmupRenderer.dispose();
      document.body.removeChild(warmupCanvas);

      console.log('✅ GPU warmup completed');
      
      setSceneState(prev => ({ 
        ...prev, 
        gpuWarmedUp: true,
        modelsLoaded: true 
      }));
    };

    const warmupTimeout = setTimeout(warmupGPU, 500);
    return () => clearTimeout(warmupTimeout);
  }, [isHydrated]);

  // Audio Setup
  useEffect(() => {
    if (!isHydrated) return;

    const audio = new Audio('/scatter.mp3');
    audio.preload = 'auto';
    audio.volume = 0.7;
    
    const handleCanPlayThrough = () => {
      setAudioLoaded(true);
      console.log('✅ Audio loaded successfully');
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [isHydrated]);

  // Fragment Deletion Function
  const deleteAllFragments = useCallback(() => {
    console.log('🗑️ Deleting all fragments from DOM and memory...');
    
    fragmentsRef.current.forEach((fragmentEl, index) => {
      if (fragmentEl && fragmentEl.parentNode) {
        gsap.killTweensOf(fragmentEl);
        fragmentEl.parentNode.removeChild(fragmentEl);
        console.log(`🗑️ Deleted fragment ${index} from DOM`);
      }
    });
    
    fragmentsRef.current = [];
    setContentFragments([]);
    setFragmentsGenerated(false); // ✅ Reset generated flag
    
    console.log('✅ All fragments deleted from memory and DOM');
  }, []);

  // ✅ MEMOIZED: Crack Lines (prevent recreation)
  const crackLines = useMemo(() => [
    { start: [50, 50], end: [0, 0], angle: -135 },
    { start: [50, 50], end: [100, 0], angle: -45 },
    { start: [50, 50], end: [100, 100], angle: 45 },
    { start: [50, 50], end: [0, 100], angle: 135 },
    { start: [50, 50], end: [0, 50], angle: 180 },
    { start: [50, 50], end: [100, 50], angle: 0 },
    { start: [50, 50], end: [50, 0], angle: -90 },
    { start: [50, 50], end: [50, 100], angle: 90 },
    { start: [25, 25], end: [0, 10], angle: -155 },
    { start: [75, 25], end: [100, 10], angle: -25 },
    { start: [75, 75], end: [100, 90], angle: 25 },
    { start: [25, 75], end: [0, 90], angle: 155 },
  ], []);

  // ✅ STABLE: Fragment Generation (only run once)
  useEffect(() => {
    if (!isHydrated || !heroMounted || showSpacedrive || showMainContent || fragmentsGenerated) return;

    console.log('🎯 Generating fragments (one time only)...');

    const generateContentFragments = () => {
      const centerX = window.innerWidth / 2 -5;
      const centerY = window.innerHeight / 2 +7;
      const fragments = [];
      let fragmentId = 0;

      crackLines.forEach((crack, crackIndex) => {
        const fragmentsPerLine = crackIndex < 8 ? 3 : 2;
        
        for (let i = 0; i < fragmentsPerLine; i++) {
          const lineProgress = (i + 1) / (fragmentsPerLine + 1) + (Math.random() - 0.5) * 0.2;
          
          const crackStartX = (crack.start[0] / 100) * window.innerWidth;
          const crackStartY = (crack.start[1] / 100) * window.innerHeight;
          const crackEndX = (crack.end[0] / 100) * window.innerWidth;
          const crackEndY = (crack.end[1] / 100) * window.innerHeight;
          
          const fragmentX = crackStartX + (crackEndX - crackStartX) * lineProgress;
          const fragmentY = crackStartY + (crackEndY - crackStartY) * lineProgress;
          
          const perpOffset = (Math.random() - 0.5) * 80;
          const perpAngle = crack.angle + 90;
          const perpX = Math.cos(perpAngle * Math.PI / 180) * perpOffset;
          const perpY = Math.sin(perpAngle * Math.PI / 180) * perpOffset;
          
          const initialX = fragmentX + perpX;
          const initialY = fragmentY + perpY;
          
          const distanceFromCenter = Math.sqrt(
            Math.pow(fragmentX - centerX, 2) + Math.pow(fragmentY - centerY, 2)
          );
          const baseSize = Math.max(60, 180 - distanceFromCenter * 0.3);
          const fragmentWidth = baseSize + Math.random() * 60;
          const fragmentHeight = baseSize * 0.8 + Math.random() * 40;
          
          fragments.push({
            id: fragmentId++,
            initialX: initialX - fragmentWidth/2,
            initialY: initialY - fragmentHeight/2,
            finalX: centerX - fragmentWidth/2,
            finalY: centerY - fragmentHeight/2,
            width: fragmentWidth,
            height: fragmentHeight,
            rotation: crack.angle + (Math.random() - 0.5) * 30,
            finalRotation: crack.angle + (Math.random() - 0.5) * 720,
            clipPath: generateRealisticGlassShape(crack.angle),
            backgroundPosition: `${-(initialX - fragmentWidth/2)}px ${-(initialY - fragmentHeight/2)}px`,
            crackIndex,
            lineProgress,
            scale: 1,
            opacity: 0,
          });
        }
      });

      setContentFragments(fragments);
      setFragmentsGenerated(true); // ✅ Mark as generated to prevent re-runs
      console.log(`✅ Generated ${fragments.length} fragments (FINAL)`);
    };

    generateContentFragments();

    // ✅ REMOVED: Resize listener to prevent regeneration
    
  }, [isHydrated, heroMounted, showSpacedrive, showMainContent, fragmentsGenerated, crackLines]);

  // ✅ OPTIMIZED: Main GSAP Animation with reduced dependencies
  useGSAP(() => {
    // Basic requirements
    if (!isHydrated) {
      console.log('⏳ Waiting for hydration...');
      return;
    }
    
    if (isMainContentActive) {
      console.log('🚫 MainContent active - skipping scroll logic');
      return;
    }
    
    // Check refs directly
    if (!containerRef.current || !contentRef.current || !crackOverlayRef.current) {
      console.log('⏳ DOM refs not ready yet, retrying...');
      return;
    }
    
    // ✅ CHANGED: Use fragmentsGenerated flag instead of contentFragments.length
    if (!fragmentsGenerated) {
      console.log('⏳ Waiting for fragments to be generated...');
      return;
    }
    
    if (!sceneState.modelsLoaded || !heroMounted) {
      console.log('⏳ Waiting for models/hero...');
      return;
    }

    console.log('🎬 All requirements met - starting GSAP animation setup...');

    let previousProgress = 0;
    let soundPlayed = false;

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        refreshPriority: -1,
        // ✅ MODIFY: In your useGSAP hook's masterTimeline scrollTrigger onUpdate
onUpdate: (self) => {
  const currentProgress = self.progress;
  const isScrollingDown = currentProgress > previousProgress;
  
  if (showMainContent && currentProgress < 0.95) {
    return;
  }
  
  // Audio trigger with user interaction check (unchanged)
  if (isScrollingDown && 
      currentProgress >= 0.26 && 
      currentProgress <= 0.28 && 
      !soundPlayed && 
      userInteracted) {
    playGlassBreakSound();
    setSoundPlayed(true);
  }
  
  // Black hole becomes visible at 30% (unchanged)
  if (currentProgress >= 0.3 && !showBlackHole) {
    setShowBlackHole(true);
    setSceneState(prev => ({ ...prev, current: 'blackhole' }));
    
    if (blackHoleCanvasRef.current) {
      gsap.set(blackHoleCanvasRef.current, { opacity: 1 });
    }
  }

  // Start black hole auto-scaling at 70% (unchanged)
  if (currentProgress >= 0.7 && !startBlackHoleAutoScale) {
    setStartBlackHoleAutoScale(true);
  }

  // ✅ MODIFIED: Spacedrive trigger - respect auto-transition
  if (!showSpacedrive && !autoTransitionTriggered) {
    // Only trigger via scroll if auto-transition hasn't happened
    if (currentProgress >= 0.88) {
      console.log('🚀 Spacedrive beginning via scroll - cleaning up fragments and Hero...');
      
      deleteAllFragments();
      setHeroMounted(false);
      
      setShowSpacedrive(true);
      setSceneState(prev => ({ ...prev, current: 'spacedrive', transitioning: true }));
    }
  }

  // ✅ MODIFIED: Reset flags on scroll up - include new states
  if (currentProgress < 0.1 && !showMainContent) {
    setSoundPlayed(false);
    setShowBlackHole(false);
    setStartBlackHoleAutoScale(false);
    setShowSpacedrive(false);
    setBlackHoleCompleted(false);        // Reset new state
    setAutoTransitionTriggered(false);   // Reset new state
    setSceneState(prev => ({ ...prev, current: 'glass', transitioning: false }));
  }
  
  previousProgress = currentProgress;
}

      }
    });

    mainScrollTrigger.current = masterTimeline.scrollTrigger;
    
    // Phase 1: Show cracks (0-20%)
    masterTimeline
      .to(crackOverlayRef.current, {
        opacity: 1,
        duration: 0.12,
        ease: "power2.inOut"
      }, 0.05)
      .to(contentRef.current, {
        scale: 1.01,
        filter: "blur(0.5px)",
        duration: 0.08,
        ease: "power2.inOut"
      }, 0.1);

    // Phase 2: Glass shattering (20-25%)
    masterTimeline
      .to(crackOverlayRef.current, {
        opacity: 0,
        duration: 0.03,
        ease: "power2.out"
      }, 0.2)
      .to(contentRef.current, {
        opacity: 0,
        scale: 1.03,
        filter: "blur(3px)",
        duration: 0.05,
        ease: "power3.inOut"
      }, 0.2);

    // Phase 3: Fragments appear and animate
    const fragmentsByLine = {};
    contentFragments.forEach(fragment => {
      if (!fragmentsByLine[fragment.crackIndex]) {
        fragmentsByLine[fragment.crackIndex] = [];
      }
      fragmentsByLine[fragment.crackIndex].push(fragment);
    });

    contentFragments.forEach((fragmentData) => {
      const fragmentElement = fragmentsRef.current[fragmentData.id];
      if (fragmentElement) {
        gsap.set(fragmentElement, {
          x: fragmentData.initialX,
          y: fragmentData.initialY,
          rotation: fragmentData.rotation,
          transformOrigin: "center center",
          willChange: "transform, opacity",
          scale: 1.1,
          opacity: 0
        });
      }
    });

    Object.keys(fragmentsByLine).forEach((lineIndex, groupIndex) => {
      const lineFragments = fragmentsByLine[lineIndex];
      
      lineFragments.forEach((fragmentData) => {
        const fragmentElement = fragmentsRef.current[fragmentData.id];
        if (!fragmentElement) return;

        const appearDelay = 0.2 + (groupIndex * 0.004) + (fragmentData.lineProgress * 0.008);
        
        masterTimeline.to(fragmentElement, {
          opacity: 1,
          scale: 1,
          duration: 0.02,
          ease: "back.out(2)",
        }, appearDelay);
      });
    });

    // Phase 4: Fragments move to center
    contentFragments.forEach((fragmentData) => {
      const fragmentElement = fragmentsRef.current[fragmentData.id];
      if (!fragmentElement) return;

      const moveStartTime = 0.3 + (fragmentData.lineProgress * 0.08);
      
      masterTimeline.to(fragmentElement, {
        x: fragmentData.finalX,
        y: fragmentData.finalY,
        rotation: fragmentData.finalRotation,
        scale: 0.1,
        duration: 0.2,
        ease: "power2.inOut",
      }, moveStartTime);
    });

    // Phase 5: Fragments fade out
    const existingFragments = fragmentsRef.current.filter(el => el !== null && el !== undefined);
    
    if (existingFragments.length > 0) {
      masterTimeline.to(existingFragments, {
        opacity: 0,
        scale: 0.02,
        duration: 0.1,
        ease: "power3.in",
        stagger: {
          amount: 0.05,
          from: "center"
        }
      }, 0.6);
    }

    // Black hole canvas visibility
    if (blackHoleCanvasRef.current) {
      masterTimeline.to(blackHoleCanvasRef.current, {
        opacity: 1,
        duration: 0.05,
        ease: "power2.out"
      }, 0.3);
    }

    console.log('✅ GSAP animation setup complete');

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      masterTimeline.kill();
    };

  }, { 
    scope: containerRef,
    dependencies: [
      isHydrated, 
      fragmentsGenerated,
      sceneState.modelsLoaded, 
      showMainContent, 
      heroMounted, 
      userInteracted,
      isMainContentActive,
      blackHoleCompleted,      // ✅ NEW dependency
      autoTransitionTriggered  // ✅ NEW dependency
    ],
    revertOnUpdate: true
  });

  // ScrollTrigger Management
  useEffect(() => {
    if (showMainContent && mainScrollTrigger.current) {
      mainScrollTrigger.current.kill();
      
      gsap.set(containerRef.current, {
        position: 'relative',
        height: 'auto',
        overflow: 'visible'
      });
      
      gsap.set(document.body, {
        overflow: 'auto'
      });
    }
  }, [showMainContent]);

  // Emergency Cleanup
  useEffect(() => {
    return () => {
      if (!isMainContentActive) {
        console.log('🚨 Emergency cleanup on abnormal unmount');
        deleteAllFragments();
        setHeroMounted(false);
      }
    };
  }, []);

  // Audio Function
  const playGlassBreakSound = () => {
    if (!audioRef.current || !audioLoaded || !userInteracted) {
      console.warn('⚠️ Audio not ready or user hasn\'t interacted yet');
      return;
    }

    try {
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('🔊 Glass break sound played successfully');
          })
          .catch(error => {
            console.warn('⚠️ Audio play failed:', error.name, error.message);
          });
      }
    } catch (error) {
      console.warn('⚠️ Audio playback error:', error);
    }
  };

  // Event Handlers
  const handleSpacedriveComplete = () => {
    console.log('🎭 Spacedrive complete - transitioning to MainContent...');
    
    if (blackHoleCanvasRef.current) {
      blackHoleCanvasRef.current.style.display = 'none';
    }
    
    setSceneState(prev => ({ ...prev, current: 'mainContent' }));
    window.scrollTo(0, 0);
    setShowBlackHole(false);
    setShowSpacedrive(false);
    setShowMainContent(true);
    setIsMainContentActive(true);
    
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  // !
  // ✅ REPLACE: Your existing handleBlackHoleEngulf function with this
const handleBlackHoleEngulf = () => {
  console.log('🌌 Black hole has completely engulfed the screen!');
  
  // Mark blackhole as completed
  setBlackHoleCompleted(true);
  
  // Prevent multiple triggers
  if (autoTransitionTriggered) {
    console.log('⚠️ Auto-transition already triggered, skipping...');
    return;
  }
  
  setAutoTransitionTriggered(true);
  
  // Auto-transition to spacedrive with smooth timing
  setTimeout(() => {
    console.log('🚀 Auto-triggering Spacedrive after BlackHole completion');
    
    // Clean up fragments and hero
    deleteAllFragments();
    setHeroMounted(false);
    
    // Show spacedrive immediately
    setShowSpacedrive(true);
    setSceneState(prev => ({ 
      ...prev, 
      current: 'spacedrive', 
      transitioning: true 
    }));
    
    console.log('✅ Auto-transition to Spacedrive completed');
    
  }, 200); // 400ms delay for smooth visual transition
};

  // !

  const generateRealisticGlassShape = (crackAngle) => {
    const points = [];
    const numPoints = 5 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numPoints; i++) {
      const baseAngle = (i / numPoints) * 360;
      const angleBias = Math.sin((baseAngle - crackAngle) * Math.PI / 180) * 10;
      const variance = 15 + Math.random() * 15 + Math.abs(angleBias);
      
      const x = 50 + Math.cos(baseAngle * Math.PI / 180) * variance;
      const y = 50 + Math.sin(baseAngle * Math.PI / 180) * variance;
      points.push(`${Math.max(5, Math.min(95, x))}% ${Math.max(5, Math.min(95, y))}%`);
    }
    
    return `polygon(${points.join(', ')})`;
  };

  // Loading State
  if (!isHydrated || !sceneState.gpuWarmedUp) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <Loader/>
      </div>
    );
  }

  return (
      <div 
        ref={containerRef}
        className="relative h-[100dvh] overflow-hidden"
      >
         {/* <ShaderBackground backdropBlurAmount="xl" color="#010974" className="shadow-lg" /> */}
         {!showMainContent && <ShaderBackground 
  gradient="radial-gradient(circle, #2d1b69, #000000)"
  color="rgb(255, 250, 194)"
  particleCount={200}
  particleSize={0.2}
  rotationSpeed={0.0005}
/>}
        {/* Hero Component */}
        {heroMounted && sceneState.current === 'glass' && !showMainContent && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div ref={contentRef}>
              <Hero />
            </div>
          </div>
        )}

        {/* Glass Crack Overlay */}
        {heroMounted && !showMainContent && (
          <EnhancedGlassCrackOverlay ref={crackOverlayRef} />
        )}

        {/* Glass Fragments */}
        {/* Glass Fragments - FIXED IMAGE POSITIONING */}
{heroMounted && !showMainContent && contentFragments.length > 0 && (
  <div className="absolute inset-0 pointer-events-none z-20 fragment-container">
    {contentFragments.map((fragment) => (
      <div
        key={fragment.id}
        ref={el => fragmentsRef.current[fragment.id] = el}
        className="absolute will-change-transform"
        style={{
          width: fragment.width,
          height: fragment.height,
          opacity: 0,
        }}
      >
        <div 
          className="w-full h-full relative overflow-hidden"
          style={{
            clipPath: fragment.clipPath,
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: `
              0 0 25px rgba(255,255,255,0.3),
              inset 0 0 15px rgba(255,255,255,0.1),
              0 2px 10px rgba(0,0,0,0.3)
            `,
            backdropFilter: 'blur(1px)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%)',
          }}
        >
          {/* ✅ FIXED: Proper image positioning */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/crack.png)',
              backgroundSize: '100vw 100vh', // Cover full viewport
              backgroundPosition: fragment.backgroundPosition, // Use original positioning
              backgroundRepeat: 'no-repeat',
              transform: 'scale(0.95)',
            }}
          />
          
          {/* Glass reflection overlays */}
          <div 
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.8) 30%, transparent 60%, rgba(255,255,255,0.4) 100%)',
            }}
          />
          
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom right, rgba(255,255,255,0.6) 0%, transparent 50%)',
            }}
          />
        </div>
      </div>
    ))}
  </div>
)}


        {/* 3D Canvas */}
        {(showBlackHole || showSpacedrive) && !showMainContent && (
          <div 
            ref={blackHoleCanvasRef}
            className="absolute inset-0 z-50"
            id="three-canvas-container"
          >
            <Canvas
              camera={{ 
                position: [0, 0, 5],
                fov: 125,
                near: 0.1,
                far: 1000
              }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
                stencil: false,
                preserveDrawingBuffer: false,
              }}
              dpr={Math.min(window.devicePixelRatio, 2)}
            >
              <Suspense fallback={null}>
                {showSpacedrive && <SceneBackground />}
                
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={2} />
                <pointLight position={[0, 0, -2]} intensity={3} color="#4a90ff" distance={20} />
                
                {showBlackHole && !showSpacedrive && (
                  <>
                    <pointLight position={[3, 0, 0]} intensity={1.5} color="#ffffff" />
                    <pointLight position={[-3, 0, 0]} intensity={1.5} color="#ffffff" />
                    <pointLight position={[0, 3, 0]} intensity={1.5} color="#ffffff" />
                  </>
                )}
                
                {showBlackHole && !showSpacedrive && (
                  <BlackHoleModel 
                    position={[0, -1, -8]}
                    startAutoScale={startBlackHoleAutoScale}
                    onEngulfComplete={handleBlackHoleEngulf}
                  />
                )}
                
                {showSpacedrive && !showMainContent && (
                  <SpacedriveModel 
                    position={[0, 0, 0]}
                    onFlashComplete={handleSpacedriveComplete}
                  />
                )}
              </Suspense>
            </Canvas>
          </div>
        )}

        {/* MainContent */}
        {showMainContent && (
          <div className="inset-0 w-full h-[100dvh] z-50">
      <MainContent />
          </div>
        )}

      </div>
  );
}

const EnhancedGlassCrackOverlay = ({ ref }) => (
  <div
    ref={ref}
    className="absolute inset-0 pointer-events-none opacity-0 z-15"
  >
    <svg 
      className="w-full h-full" 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
      style={{ 
        width: '100vw', 
        height: '100vh' 
      }}
    >
      <defs>
        <filter id="glowEffect">
          <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <g stroke="rgba(255,255,255,0.95)" strokeWidth="0.4" fill="none" filter="url(#glowEffect)">
        <path d="M 50 50 L 0 0" strokeWidth="0.6" />
        <path d="M 50 50 L 100 0" strokeWidth="0.6" />
        <path d="M 50 50 L 100 100" strokeWidth="0.6" />
        <path d="M 50 50 L 0 100" strokeWidth="0.6" />
        <path d="M 50 50 L 0 50" strokeWidth="0.6" />
        <path d="M 50 50 L 100 50" strokeWidth="0.6" />
        <path d="M 50 50 L 50 0" strokeWidth="0.6" />
        <path d="M 50 50 L 50 100" strokeWidth="0.6" />
        
        <path d="M 25 25 L 0 10" strokeWidth="0.4" />
        <path d="M 75 25 L 100 10" strokeWidth="0.4" />
        <path d="M 75 75 L 100 90" strokeWidth="0.4" />
        <path d="M 25 75 L 0 90" strokeWidth="0.4" />
        <path d="M 30 50 L 0 45" strokeWidth="0.4" />
        <path d="M 70 50 L 100 55" strokeWidth="0.4" />
        
        <path d="M 0 25 L 100 30" strokeWidth="0.25" opacity="0.6" />
        <path d="M 0 75 L 100 70" strokeWidth="0.25" opacity="0.6" />
        <path d="M 25 0 L 30 100" strokeWidth="0.25" opacity="0.6" />
        <path d="M 75 0 L 70 100" strokeWidth="0.25" opacity="0.6" />
      </g>
    </svg>
  </div>
);

function SceneBackground() {
  const texture = useLoader(THREE.TextureLoader, '/gemini.png')
  const { scene } = useThree()
  useEffect(() => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
  }, [scene, texture])
  return null
}
