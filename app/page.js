'use client';
import { useRef, useEffect, useState, Suspense, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Canvas } from '@react-three/fiber';
import { BlackHoleModel } from '@/components/scenes/BlackHoleModel';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import MainContent from '@/components/page/MainContent';
import Hero from '@/components/page/Hero';
import ShaderBackground from '@/components/ui/shader-background';
import Loader from '@/components/ui/StartingLoader';
import { useNav } from '@/components/contexts/NavigationContext';
import { getAllAssets } from '@/data/Assets';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Only preload blackhole model
useGLTF.preload('/blackhole_compress.glb');

export default function GlassBreakPage() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const fragmentsRef = useRef([]);
  const crackOverlayRef = useRef(null);
  const audioRef = useRef(null);
  const blackHoleCanvasRef = useRef(null);
  const mainScrollTrigger = useRef(null);
  
  // Asset loading states
  const [assetLoadingStage, setAssetLoadingStage] = useState('critical-assets');
  const [assetsProgress, setAssetsProgress] = useState(0);
  const [loadedAssets, setLoadedAssets] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [preloadComplete, setPreloadComplete] = useState(false);

  const [isHydrated, setIsHydrated] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  
  const [sceneState, setSceneState] = useState({
    current: 'glass',
    transitioning: false,
    modelsLoaded: false,
    assetsLoaded: false
  });
  
  const [heroMounted, setHeroMounted] = useState(false);
  const [contentFragments, setContentFragments] = useState([]);
  const [fragmentsGenerated, setFragmentsGenerated] = useState(false);
  const [showBlackHole, setShowBlackHole] = useState(false);
  const [startBlackHoleAutoScale, setStartBlackHoleAutoScale] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [isMainContentActive, setIsMainContentActive] = useState(false);
  const [blackHoleCompleted, setBlackHoleCompleted] = useState(false);
  const [autoTransitionTriggered, setAutoTransitionTriggered] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);

  const { currentSection, setCurrentSection, toNavigate, setToNavigate } = useNav();

  // Asset preloading hook
  const useAssetPreloader = (assets) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [loadedCount, setLoadedCount] = useState(0);

    useEffect(() => {
      if (!assets || assets.length === 0) {
        setIsLoading(false);
        return;
      }

      let loaded = 0;
      const total = assets.length;
      setTotalAssets(total);

      const preloadPromises = assets.map(async (asset) => {
        return new Promise((resolve) => {
          if (asset.type === 'image') {
            const img = new Image();
            img.onload = img.onerror = () => {
              loaded++;
              setLoadedCount(loaded);
              setLoadedAssets(loaded);
              setProgress((loaded / total) * 100);
              setAssetsProgress((loaded / total) * 100);
              resolve();
            };
            img.src = asset.src;
          } 
          else if (asset.type === 'video') {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = video.onerror = () => {
              loaded++;
              setLoadedCount(loaded);
              setLoadedAssets(loaded);
              setProgress((loaded / total) * 100);
              setAssetsProgress((loaded / total) * 100);
              resolve();
            };
            video.src = asset.src;
          }
          else if (asset.type === 'model') {
            fetch(asset.src)
              .then(() => {
                loaded++;
                setLoadedCount(loaded);
                setLoadedAssets(loaded);
                setProgress((loaded / total) * 100);
                setAssetsProgress((loaded / total) * 100);
                resolve();
              })
              .catch(() => {
                loaded++;
                setLoadedCount(loaded);
                setLoadedAssets(loaded);
                setProgress((loaded / total) * 100);
                setAssetsProgress((loaded / total) * 100);
                resolve();
              });
          }
          else if (asset.type === 'audio') {
            const audio = new Audio();
            audio.oncanplaythrough = audio.onerror = () => {
              loaded++;
              setLoadedCount(loaded);
              setLoadedAssets(loaded);
              setProgress((loaded / total) * 100);
              setAssetsProgress((loaded / total) * 100);
              resolve();
            };
            audio.src = asset.src;
          }
        });
      });

      Promise.all(preloadPromises).then(() => {
        setIsLoading(false);
      });
    }, [assets]);

    return { isLoading, progress, loadedCount, totalAssets: assets?.length || 0 };
  };

  // Use the asset preloader
  const allAssets = getAllAssets();
  const { isLoading: assetsLoading } = useAssetPreloader(allAssets);

  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      
      if (document && typeof document.removeEventListener === 'function') {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      }
    };

    if (document && typeof document.addEventListener === 'function') {
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);
      document.addEventListener('keydown', handleUserInteraction);
    }

    return () => {
      if (document && typeof document.removeEventListener === 'function') {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      }
    };
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const deleteAllFragments = useCallback(() => {
    fragmentsRef.current.forEach((fragmentEl, index) => {
      if (fragmentEl && fragmentEl.parentNode) {
        try {
          gsap.killTweensOf(fragmentEl);
        } catch (error) {
          console.warn(`${index}:`);
        }
        
        try {
          fragmentEl.parentNode.removeChild(fragmentEl);
        } catch (error) {
          console.warn(`${index}`);
        }
      }
    });
    
    fragmentsRef.current = [];
    setContentFragments([]);
    setFragmentsGenerated(false);
  }, []);

  const resetAnimationStates = useCallback(() => {
    setShowBlackHole(false);
    setStartBlackHoleAutoScale(false);
    setShowMainContent(false);
    setIsMainContentActive(false);
    setBlackHoleCompleted(false);
    setAutoTransitionTriggered(false);
    setSoundPlayed(false);
    deleteAllFragments();
    setSceneState(prev => ({ ...prev, current: 'glass', transitioning: false }));
  }, [deleteAllFragments]);

  // Asset loading instead of GPU warmup
  useEffect(() => {
    if (!isHydrated) return;
    
    const assetsAlreadyLoaded = localStorage.getItem('assetsalreadyloaded') === 'true';
    
    if (assetsAlreadyLoaded) {
      setSceneState(prev => ({ 
        ...prev, 
        assetsLoaded: true,
        modelsLoaded: true 
      }));
      resetAnimationStates();
      setHeroMounted(true);
      setPreloadComplete(true);
      
      return;
    }

    // Wait for assets to load
    if (!assetsLoading) {
      setTimeout(() => {
        setSceneState(prev => ({ 
          ...prev, 
          assetsLoaded: true,
          modelsLoaded: true 
        }));
        setAssetLoadingStage('glass-break');
        localStorage.setItem('assetsalreadyloaded', 'true');
      }, 500);
    }
  }, [isHydrated, assetsLoading, resetAnimationStates]);

  // Audio setup
  useEffect(() => {
    if (!isHydrated) return;

    const audio = new Audio('/scatter.mp3');
    audio.preload = 'auto';
    audio.volume = 0.7;
    
    const handleCanPlayThrough = () => {
      setAudioLoaded(true);
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audioRef.current = audio;

    return () => {
      if (audio && typeof audio.removeEventListener === 'function') {
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      }
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, [isHydrated]);

  // Navigation effect
  useEffect(() => {
    if (toNavigate !== null && currentSection === "hero") {
      deleteAllFragments();
      setHeroMounted(false);
      
      if (mainScrollTrigger.current) {
        mainScrollTrigger.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      resetAnimationStates();
      
      if (blackHoleCanvasRef.current) {
        blackHoleCanvasRef.current.style.display = 'none';
      }
      
      window.scrollTo(0, 0);
      
      gsap.set(containerRef.current, {
        position: 'relative',
        height: 'auto',
        overflow: 'visible'
      });
      
      gsap.set(document.body, {
        overflow: 'auto'
      });
      
      setSceneState(prev => ({ ...prev, current: 'mainContent' }));
      setShowMainContent(true);
      setIsMainContentActive(true);
      setToNavigate(null);
      
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [toNavigate, currentSection, setCurrentSection, setToNavigate, resetAnimationStates, deleteAllFragments]);

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

  // Fragment generation
  useEffect(() => {
    if (!isHydrated || !heroMounted || showMainContent || fragmentsGenerated) return;

    const generateContentFragments = () => {
      const centerX = window.innerWidth / 2 - 5;
      const centerY = window.innerHeight / 2 + 7;
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
      setFragmentsGenerated(true);
    };

    generateContentFragments();
    
  }, [isHydrated, heroMounted, showMainContent, fragmentsGenerated, crackLines]);

  // GSAP animations
  useGSAP(() => {
    if (toNavigate !== null && currentSection === "hero") {
      return;
    }
    
    if (!isHydrated) {
      return;
    }
    
    if (isMainContentActive) {
      return;
    }
    
    if (!containerRef.current || !contentRef.current || !crackOverlayRef.current) {
      return;
    }
    
    if (!fragmentsGenerated) {
      return;
    }
    
    if (!sceneState.modelsLoaded || !heroMounted) {
      return;
    }

    let previousProgress = 0;

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        refreshPriority: -1,
        onUpdate: (self) => {
          const currentProgress = self.progress;
          const isScrollingDown = currentProgress > previousProgress;
          
          if (showMainContent && currentProgress < 0.95) {
            return;
          }
          
          if (isScrollingDown && 
              currentProgress >= 0.26 && 
              currentProgress <= 0.28 && 
              !soundPlayed && 
              userInteracted) {
            playGlassBreakSound();
            setSoundPlayed(true);
          }
          
          if (currentProgress >= 0.3 && !showBlackHole) {
            setShowBlackHole(true);
            setSceneState(prev => ({ ...prev, current: 'blackhole' }));
            
            if (blackHoleCanvasRef.current) {
              gsap.set(blackHoleCanvasRef.current, { opacity: 1 });
            }
          }

          if (currentProgress >= 0.7 && !startBlackHoleAutoScale) {
            setStartBlackHoleAutoScale(true);
          }

          if (!showMainContent && !autoTransitionTriggered) {
            if (currentProgress >= 0.88) {
              deleteAllFragments();
              setHeroMounted(false);
              setAutoTransitionTriggered(true);
              
              setTimeout(() => {
                if (blackHoleCanvasRef.current) {
                  blackHoleCanvasRef.current.style.display = 'none';
                }
                
                setSceneState(prev => ({ ...prev, current: 'mainContent' }));
                window.scrollTo(0, 0);
                setShowBlackHole(false);
                setShowMainContent(true);
                setIsMainContentActive(true);
                
                setTimeout(() => {
                  ScrollTrigger.refresh();
                }, 100);
              }, 800);
            }
          }

          if (currentProgress < 0.1 && !showMainContent) {
            setSoundPlayed(false);
            setShowBlackHole(false);
            setStartBlackHoleAutoScale(false);
            setBlackHoleCompleted(false);
            setAutoTransitionTriggered(false);
            setSceneState(prev => ({ ...prev, current: 'glass', transitioning: false }));
          }
          
          previousProgress = currentProgress;
        }
      }
    });

    mainScrollTrigger.current = masterTimeline.scrollTrigger;
    
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

    if (blackHoleCanvasRef.current) {
      masterTimeline.to(blackHoleCanvasRef.current, {
        opacity: 1,
        duration: 0.05,
        ease: "power2.out"
      }, 0.3);
    }

    return () => {
      try {
        const triggers = ScrollTrigger.getAll();
        if (triggers && triggers.length > 0) {
          triggers.forEach(trigger => {
            if (trigger && typeof trigger.kill === 'function') {
              trigger.kill();
            }
          });
        }
        if (masterTimeline && typeof masterTimeline.kill === 'function') {
          masterTimeline.kill();
        }
      } catch (error) {
        console.warn(error);
      }
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
      blackHoleCompleted,
      autoTransitionTriggered,
      currentSection,
      toNavigate
    ],
    revertOnUpdate: true
  });

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

  // Audio Function
  const playGlassBreakSound = () => {
    if (!audioRef.current || !audioLoaded || !userInteracted) {
      return;
    }

    try {
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('');
          })
          .catch(error => {
            console.warn(error.name, error.message);
          });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const handleBlackHoleEngulf = () => {
    setBlackHoleCompleted(true);
    
    if (autoTransitionTriggered) {
      return;
    }
    
    setAutoTransitionTriggered(true);
    
    setTimeout(() => {
      deleteAllFragments();
      setHeroMounted(false);
      
      if (blackHoleCanvasRef.current) {
        blackHoleCanvasRef.current.style.display = 'none';
      }
      
      setSceneState(prev => ({ 
        ...prev, 
        current: 'mainContent', 
        transitioning: false 
      }));
      
      window.scrollTo(0, 0);
      setShowBlackHole(false);
      setShowMainContent(true);
      setIsMainContentActive(true);
      
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      
    }, 800);
  };

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

  // Show loading while assets are loading
  if (!preloadComplete || assetsLoading) {
    return (
      <div className="h-[100dvh] z-41 bg-black flex items-center justify-center relative">
        <Loader />
        <div className="absolute bottom-20 text-center text-white">
          <p className="text-lg mb-2">Loading Assets</p>
          <p className="text-sm text-gray-400">
            {loadedAssets}/{totalAssets} assets loaded ({assetsProgress.toFixed(1)}%)
          </p>
        </div>
        {assetLoadingStage !== 'critical-assets' && (
          <div className="absolute inset-0 opacity-0 pointer-events-none">
            <PreloadSequence 
              stage={assetLoadingStage}
              onStageComplete={(nextStage) => {
                if (nextStage === 'complete') {
                  resetAnimationStates();
                  setHeroMounted(true);
                  setPreloadComplete(true);
                } else {
                  setAssetLoadingStage(nextStage);
                }
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative h-[100dvh] overflow-hidden"
    >
      {!showMainContent && <ShaderBackground 
        gradient="radial-gradient(circle, #2d1b69, #000000)"
        color="rgb(255, 250, 194)"
        particleCount={200}
        particleSize={0.2}
        rotationSpeed={0.0005}
      />}
      
      {heroMounted && sceneState.current === 'glass' && !showMainContent && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div ref={contentRef}>
            <Hero />
          </div>
        </div>
      )}

      {heroMounted && !showMainContent && (
        <EnhancedGlassCrackOverlay ref={crackOverlayRef} />
      )}

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
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'url(/crack.png)',
                    backgroundSize: '100vw 100vh',
                    backgroundPosition: fragment.backgroundPosition,
                    backgroundRepeat: 'no-repeat',
                    transform: 'scale(0.95)',
                  }}
                />
                
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

      {showBlackHole && !showMainContent && (
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
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={2} />
              <pointLight position={[0, 0, -2]} intensity={3} color="#4a90ff" distance={20} />
              <pointLight position={[3, 0, 0]} intensity={1.5} color="#ffffff" />
              <pointLight position={[-3, 0, 0]} intensity={1.5} color="#ffffff" />
              <pointLight position={[0, 3, 0]} intensity={1.5} color="#ffffff" />
              
              <BlackHoleModel 
                position={[0, -1, -8]}
                startAutoScale={startBlackHoleAutoScale}
                onEngulfComplete={handleBlackHoleEngulf}
              />
            </Suspense>
          </Canvas>
        </div>
      )}

      {showMainContent && (
        <div className="inset-0 w-full h-[100dvh] z-50">
          <MainContent />
        </div>
      )}
    </div>
  );
}

// Simplified PreloadSequence - only handles glass-break and blackhole stages
function PreloadSequence({ stage, onStageComplete }) {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const crackOverlayRef = useRef(null);
  const fragmentsRef = useRef([]);
  const blackHoleCanvasRef = useRef(null);
  
  const [preloadFragments, setPreloadFragments] = useState([]);
  const [showPreloadBlackHole, setShowPreloadBlackHole] = useState(false);

  useEffect(() => {
    if (stage === 'glass-break' && preloadFragments.length === 0) {
      const generateFragments = () => {
        const centerX = window.innerWidth / 2 - 5;
        const centerY = window.innerHeight / 2 + 7;
        const fragments = [];
        let fragmentId = 0;

        const crackLines = [
          { start: [50, 50], end: [0, 0], angle: -135 },
          { start: [50, 50], end: [100, 0], angle: -45 },
          { start: [50, 50], end: [100, 100], angle: 45 },
          { start: [50, 50], end: [0, 100], angle: 135 },
          { start: [50, 50], end: [0, 50], angle: 180 },
          { start: [50, 50], end: [100, 50], angle: 0 },
          { start: [50, 50], end: [50, 0], angle: -90 },
          { start: [50, 50], end: [50, 100], angle: 90 },
        ];

        crackLines.forEach((crack, crackIndex) => {
          const fragmentsPerLine = 3;
          
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

        setPreloadFragments(fragments);
      };

      generateFragments();
    }
  }, [stage]);

  useEffect(() => {
    if (!containerRef.current) return;

    const runStageAnimation = async () => {
      const tl = gsap.timeline();

      switch (stage) {
        case 'glass-break':
          if (heroRef.current && crackOverlayRef.current) {
            tl.to(crackOverlayRef.current, { opacity: 1, duration: 0.5, ease: "power2.inOut" })
              .to(heroRef.current, { scale: 1.01, filter: "blur(0.5px)", duration: 0.3, ease: "power2.inOut" }, 0.3)
              .to(crackOverlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.out" }, 1)
              .to(heroRef.current, { opacity: 0, scale: 1.03, filter: "blur(3px)", duration: 0.3, ease: "power3.inOut" }, 1);

            preloadFragments.forEach((fragment) => {
              const fragmentElement = fragmentsRef.current[fragment.id];
              if (fragmentElement) {
                gsap.set(fragmentElement, {
                  x: fragment.initialX,
                  y: fragment.initialY,
                  rotation: fragment.rotation,
                  scale: 1.1,
                  opacity: 0
                });

                tl.to(fragmentElement, { opacity: 1, scale: 1, duration: 0.1, ease: "back.out(2)" }, 1.5 + fragment.lineProgress * 0.05)
                  .to(fragmentElement, {
                    x: fragment.finalX,
                    y: fragment.finalY,
                    rotation: fragment.finalRotation,
                    scale: 0.1,
                    duration: 0.4,
                    ease: "power2.inOut"
                  }, 2 + fragment.lineProgress * 0.1)
                  .to(fragmentElement, { opacity: 0, scale: 0.02, duration: 0.2, ease: "power3.in" }, 2.5);
              }
            });
          }

          await new Promise(resolve => setTimeout(resolve, 3000));
          onStageComplete('blackhole');
          break;

        case 'blackhole':
          setShowPreloadBlackHole(true);
          await new Promise(resolve => setTimeout(resolve, 4000));
          localStorage.setItem('assetsalreadyloaded', 'true');
          onStageComplete('complete');
          break;
      }
    };

    runStageAnimation();
  }, [stage, preloadFragments, onStageComplete]);

  useEffect(() => {
    return () => {
      try {
        gsap.killTweensOf("*");
      } catch (error) {
        console.warn(error);
      }
      
      if (fragmentsRef.current) {
        fragmentsRef.current.forEach(fragment => {
          if (fragment && fragment.parentNode) {
            try {
              fragment.parentNode.removeChild(fragment);
            } catch (error) {
              console.warn(error);
            }
          }
        });
        fragmentsRef.current = [];
      }
    };
  }, []);

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

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
      <ShaderBackground 
        gradient="radial-gradient(circle, #2d1b69, #000000)"
        color="rgb(255, 250, 194)"
        particleCount={200}
        particleSize={0.2}
        rotationSpeed={0.0005}
      />

      {stage === 'glass-break' && (
        <>
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div ref={heroRef}>
              <Hero />
            </div>
          </div>
          <EnhancedGlassCrackOverlay ref={crackOverlayRef} />
          
          <div className="absolute inset-0 pointer-events-none z-20">
            {preloadFragments.map((fragment) => (
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
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'url(/crack.png)',
                      backgroundSize: '100vw 100vh',
                      backgroundPosition: fragment.backgroundPosition,
                      backgroundRepeat: 'no-repeat',
                      transform: 'scale(0.95)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showPreloadBlackHole && (
        <div ref={blackHoleCanvasRef} className="absolute inset-0 z-50">
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
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={2} />
              <pointLight position={[0, 0, -2]} intensity={3} color="#4a90ff" distance={20} />
              <pointLight position={[3, 0, 0]} intensity={1.5} color="#ffffff" />
              <pointLight position={[-3, 0, 0]} intensity={1.5} color="#ffffff" />
              <pointLight position={[0, 3, 0]} intensity={1.5} color="#ffffff" />
              
              <BlackHoleModel 
                position={[0, -1, -8]}
                startAutoScale={true}
              />
            </Suspense>
          </Canvas>
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
