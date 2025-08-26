'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import ShaderBackground from '@/components/ui/shader-background';

import About from '@/components/page/About';
import TechStack from '@/components/page/TechStack';
import Projects from '@/components/page/Projects';
import ContactSection from '@/components/page/ContactSection';
import { useNav } from '@/components/contexts/NavigationContext';

gsap.registerPlugin(ScrollTrigger);

export default function SectionTransitions() {
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const navItemsRef = useRef([]);
  const lenisRef = useRef(null);
  const stRef = useRef(null); 

  const { currentSection, setCurrentSection, toNavigate, setToNavigate, fromHero, setFromHero } = useNav();

  useEffect(() => {
    setCurrentSection("about");
  }, [setCurrentSection]);

  const sections = [
    { id: 'section-1', name: 'about', content: <About /> },
    { id: 'section-2', name: 'tech', content: <TechStack /> },
    { id: 'section-3', name: 'projects', content: <Projects /> },
    { id: 'section-4', name: 'contact', content: <ContactSection /> }
  ];

  useEffect(() => {
    const container = containerRef.current;
    const slides = sectionsRef.current;
    const navItems = navItemsRef.current;

    if (!container || slides.length === 0) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      autoRaf: false,
      syncTouch: true,
      normalizeWheel: true, 
    });

    lenisRef.current = lenis;

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const tl = gsap.timeline();
    const clickHandlers = [];
    gsap.set(slides, { xPercent: 100, opacity: 0, scale: 0.8, zIndex: (i) => i });

    const sectionDuration = 1; 
    const totalDuration = (slides.length - 1) * sectionDuration;
    const st = ScrollTrigger.create({
      animation: tl,
      trigger: container,
      start: 'top top',
      end: `+=${window.innerHeight * totalDuration}`, 
      pin: true,
      scrub: 1,
      snap: {
        snapTo: (progress) => {
          const sectionIndex = Math.round(progress * (slides.length - 1));

          return sectionIndex / (slides.length - 1);
        },
        duration: { min: 0.2, max: 0.6 },
        delay: 0.1,
      },
    });

    stRef.current = st; 
    const setupSectionScrolling = () => {
      const sectionsWithScroll = [2, 3];
      let lenisDisabled = false;
      
      sectionsWithScroll.forEach(index => {
        const section = slides[index];
        if (section) {
          const hasScrollableContent = () => {
            return section.scrollHeight > section.clientHeight;
          };

          section.addEventListener('mouseenter', (e) => {
            if (hasScrollableContent()) {
              lenisDisabled = true;
              lenis.stop();
            }
          });
          
          section.addEventListener('mouseleave', (e) => {
            if (lenisDisabled) {
              lenisDisabled = false;
              lenis.start();
            }
          });

          section.addEventListener('wheel', (e) => {
            if (hasScrollableContent()) {
              e.stopPropagation();
              
              const { scrollTop, scrollHeight, clientHeight } = section;
              const isScrollingUp = e.deltaY < 0;
              const isScrollingDown = e.deltaY > 0;
              const isAtTop = scrollTop === 0;
              const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

              if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
                if (lenisDisabled) {
                  lenisDisabled = false;
                  lenis.start();
                }
                return; 
              }

              if (!lenisDisabled) {
                lenisDisabled = true;
                lenis.stop();
              }
            }
          }, { passive: false });

          let touchStartY = 0;
          
          section.addEventListener('touchstart', (e) => {
            if (hasScrollableContent()) {
              touchStartY = e.touches[0].clientY;
              lenisDisabled = true;
              lenis.stop();
            }
          }, { passive: true });
          
          section.addEventListener('touchmove', (e) => {
            if (hasScrollableContent()) {
              const touchY = e.touches[0].clientY;
              const touchDelta = touchStartY - touchY;
              
              const { scrollTop, scrollHeight, clientHeight } = section;
              const isAtTop = scrollTop === 0;
              const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

              if ((isAtTop && touchDelta < 0) || (isAtBottom && touchDelta > 0)) {
                if (lenisDisabled) {
                  lenisDisabled = false;
                  lenis.start();
                }
              }
            }
          }, { passive: true });
          
          section.addEventListener('touchend', () => {
            setTimeout(() => {
              if (lenisDisabled) {
                lenisDisabled = false;
                lenis.start();
              }
            }, 100);
          });
        }
      });
    };

    navItems.forEach((item, i) => {
      const clickHandler = (e) => {
        e.preventDefault();
        const targetId = e.target.dataset.target;
        const sectionIndex = parseInt(targetId.split('-')[1]) - 1;
        const progress = sectionIndex / (slides.length - 1);
        const scrollPos = st.start + (st.end - st.start) * progress;
        
        lenis.scrollTo(scrollPos, {
          duration: 1.5,
          easing: (t) => 1 - Math.pow(1 - t, 3), 
          lock: true,
        });
      };

      clickHandlers.push(clickHandler);
      item.addEventListener('click', clickHandler);

      const prevSlide = slides[i - 1];
      const prevItem = navItems[i - 1];

      if (i === 0) {
        gsap.set(item, { backgroundColor: '#ed3c3c', boxShadow: '0 0 16px #ed3c3c' });
        gsap.set(slides[0], { xPercent: 0, opacity: 1, scale: 1, zIndex: slides.length });
        tl.addLabel('section-1', 0);
      } else {
        const startTime = (i - 1) * sectionDuration;
        const endTime = i * sectionDuration;
        
        tl.to(item, { 
            backgroundColor: '#ed3c3c', 
            boxShadow: '0 0 16px #ed3c3c', 
            ease: 'power2.inOut',
            duration: 0.3
          }, startTime)
          .to(slides[i], { 
            xPercent: 0, 
            opacity: 1, 
            scale: 1, 
            zIndex: slides.length - i + 1, 
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            ease: 'power2.inOut',
            duration: 0.8
          }, startTime + 0.1)
          .to(prevItem, { 
            backgroundColor: '#424b58', 
            boxShadow: 'none', 
            ease: 'power2.inOut',
            duration: 0.3
          }, startTime)
          .to(prevSlide, { 
            xPercent: -100, 
            opacity: 0, 
            scale: 0.8, 
            zIndex: i - 1, 
            boxShadow: 'none',
            ease: 'power2.inOut',
            duration: 0.8
          }, startTime)
          .addLabel(`section-${i + 1}`, endTime);
      }
    });

    setupSectionScrolling();
    const handleResize = () => {
      ScrollTrigger.refresh();
      lenis.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      st.kill();
      tl.kill();
      lenis.destroy();
      window.removeEventListener('resize', handleResize);
      navItems.forEach((item, i) => item.removeEventListener('click', clickHandlers[i]));
    };
  }, []);

  useEffect(() => {
    if (fromHero !== null) {
      
      const checkAndNavigate = () => {
        if (stRef.current && 
            stRef.current.end !== undefined && 
            lenisRef.current) {
          
          const sectionIndex = sections.findIndex(sec => sec.name === fromHero);
          if (sectionIndex !== -1) {
            const progress = sectionIndex / (sections.length - 1);
            const scrollPos = stRef.current.start + (stRef.current.end - stRef.current.start) * progress;
            setTimeout(() => {
              if (lenisRef.current.isStopped) {
                lenisRef.current.start();
              }

              setTimeout(() => {
                
                lenisRef.current.scrollTo(scrollPos, {
                  duration: 1.5,
                  easing: (t) => 1 - Math.pow(1 - t, 3),
                  lock: true,
                  onStart: () => {
                  },
                  onComplete: () => {
                    setCurrentSection(fromHero);
                    setFromHero(null);
                  },
                });
                
              }, 200);
              
            }, 300);
          }
        } else {
          setTimeout(checkAndNavigate, 50);
        }
      };
      
      checkAndNavigate();
    }
  }, [fromHero]);

  useEffect(() => {

    if (toNavigate !== null && currentSection !== "hero" && lenisRef.current && stRef.current) {
      const sectionIndex = sections.findIndex(sec => sec.name === toNavigate);
      
      if (sectionIndex !== -1) {
        const progress = sectionIndex / (sections.length - 1);
        const scrollPos = stRef.current.start + (stRef.current.end - stRef.current.start) * progress;
        lenisRef.current.scrollTo(scrollPos, {
          duration: 1.5,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          lock: true,
          onComplete: () => {
            setCurrentSection(toNavigate);
            setToNavigate(null);
          },
        });
      }
    }
  }, [toNavigate, currentSection, sections]);
  

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
        <div className='absolute top-0 left-0 w-full h-full'>
        <ShaderBackground 
          gradient="radial-gradient(circle, #2d1b69, #000000)"
          color="rgb(255, 250, 194)"
          particleCount={200}
          particleSize={0.2}
          rotationSpeed={0.0005}
        />
        </div>
      {sections.map((sec, i) => (
        <section
          key={sec.id}
          ref={(el) => (sectionsRef.current[i] = el)}
          className={`absolute w-[100dvw] h-full ${i >= 2 ? 'overflow-y-auto' : 'overflow-y-hidden'}`}
          style={{
            pointerEvents: 'auto',
            WebkitOverflowScrolling: i >= 2 ? 'touch' : 'auto',
          }}
        >
          {sec.content}
        </section>
      ))}

      <ul className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 
          md:flex-col md:space-x-0 md:space-y-4 md:right-4 md:left-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2">
        {sections.map((sec, i) => (
          <li
            key={sec.id}
            ref={(el) => (navItemsRef.current[i] = el)}
            className="w-3 h-3 bg-[#424b58] border border-white/20 rounded-full cursor-pointer hover:bg-blue-500 transition-colors"
            data-target={sec.id}
          />
        ))}
      </ul>
    </div>
  );
}
