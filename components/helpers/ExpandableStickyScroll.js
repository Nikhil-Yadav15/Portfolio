"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useOutsideClick } from "./use-outside-click";
import { ExternalLink, Github } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { CardDemo } from "./BackgroundOverlayCard";
import { OptimizedModal } from "./Modal";

gsap.registerPlugin && gsap.registerPlugin(ScrollTrigger);
const MOBILE_BREAKPOINT = 850;

export function CombinedExpandableStickyScroll({ sections = [], contentClassName = "" }) {
  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const id = useId();

  const containerRef = useRef(null);
  const modalRef = useRef(null);
  const scrollerRef = useRef(null);

  const desktopSectionRefs = useRef([]);  
  const mobileSectionRefs = useRef([]);

  const backgroundColors = [
    "rgba(0,0,0,0)",
    "rgba(0,0,0,0)",
    "rgba(0,0,0,0)",
    "rgba(0,0,0,0)",
    "rgba(0,0,0,0)",
  ];

  const isMobile = typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

  useEffect(() => {
    desktopSectionRefs.current = desktopSectionRefs.current.slice(0, sections.length);
    mobileSectionRefs.current = mobileSectionRefs.current.slice(0, sections.length);
  }, [sections.length]);

  const setActiveSectionSafe = (index) => {
    if (index === activeSectionRef.current) return;
    activeSectionRef.current = index;
    setActiveSection(index);
  };

  const getScrollContainer = () => {
    if (!scrollerRef.current) return window;
    const closest = scrollerRef.current.closest && scrollerRef.current.closest(".overflow-y-auto");
    return closest || scrollerRef.current || window;
  };

  useEffect(() => {
    if (isMobile) return;

    try {
      if (ScrollTrigger && ScrollTrigger.getAll) {
        const old = ScrollTrigger.getAll();
        if (old && old.length) {
          old.forEach((t) => t && t.kill && t.kill());
          ScrollTrigger.clearMatchMedia && ScrollTrigger.clearMatchMedia();
        }
      }
    } catch (e) {
      console.log()
    }

    const scroller = getScrollContainer();
    if (!scroller) return;

    let ticking = false;
    let rafId = null;

    const computeAndSetActive = () => {
      const refs = desktopSectionRefs.current;
      if (!refs || refs.length === 0) return;

      let scrollerTop = 0;
      let scrollerHeight = 0;
      let centerY = 0;

      if (scroller === window) {
        scrollerTop = 0;
        scrollerHeight = window.innerHeight;
        centerY = scrollerHeight / 2;
      } else {
        const sRect = scroller.getBoundingClientRect();
        scrollerTop = sRect.top;
        scrollerHeight = sRect.height || scroller.clientHeight;
        centerY = scrollerTop + scrollerHeight / 2;
      }

      let closestIndex = -1;
      let minDistance = Infinity;

      refs.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - centerY);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex >= 0) {
        setActiveSectionSafe(closestIndex);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(() => {
          computeAndSetActive();
          ticking = false;
        });
      }
    };

    const onResize = () => {
      computeAndSetActive();
    };

    if (scroller === window) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      scroller.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    computeAndSetActive();
    setTimeout(() => computeAndSetActive(), 120);

    return () => {
      if (scroller === window) {
        window.removeEventListener("scroll", onScroll);
      } else if (scroller && scroller.removeEventListener) {
        scroller.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [sections.length, isMobile]);

  useEffect(() => {
    if (!containerRef.current) return;
    const idx = Math.max(0, Math.min(sections.length - 1, activeSection));
    containerRef.current.style.backgroundColor = backgroundColors[idx % backgroundColors.length];
  }, [activeSection, sections.length]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setExpandedCard(null);
      }
    }

    if (expandedCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expandedCard]);

  useOutsideClick(modalRef, () => setExpandedCard(null));

  const currentCard = sections[activeSection]?.card;

  const renderDesktop = () => {
    return (
      <>
        <div className={cn("lg:sticky lg:top-60 h-fit w-[40dvw]", contentClassName)}>
          {currentCard ? (
            <motion.div
              layoutId={`card-${currentCard.title}-${id}`}
              onClick={() => setExpandedCard(currentCard)}
              className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black rounded-2xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-gray-900/50 border border-purple-800/30 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-purple-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20">
                <CardDemo
                  src={currentCard.src}
                  alt={currentCard.title}
                  hoverGifUrl={currentCard.hoverGifUrl}
                  containerClassName="relative rounded-t-2xl"
                  cardClassName=""
                  overlayClassName=""
                />
                <div className="p-6">
                  <div className="mb-3">
                    <motion.h3
                      layoutId={`title-${currentCard.title}-${id}`}
                      className="text-xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors"
                    >
                      {currentCard.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${currentCard.description}-${id}`}
                      className="text-purple-300 text-sm font-medium"
                    >
                      {currentCard.description}
                    </motion.p>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                    {currentCard.short || "Click to view full details..."}
                  </p>
                  {currentCard.tech && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {currentCard.tech.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center px-2 py-1 bg-purple-900/20 border border-purple-700/30 rounded-full text-xs text-purple-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {currentCard.tech.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-purple-900 border border-purple-700/30 rounded-full text-xs text-purple-300">
                          +{currentCard.tech.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-1 text-xs text-purple-400">
                      <ExternalLink size={12} />
                      <span>View Project</span>
                    </div>
                    {currentCard.githubLink && (
                      <div className="flex items-center gap-1 text-xs text-purple-400">
                        <Github size={12} />
                        <span>Source</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-64 text-white/40 border border-dashed border-gray-700 rounded-2xl">
              <p>No project available</p>
            </div>
          )}
        </div>

        <div className="relative flex items-start px-4">
          <div className="max-w-2xl">
            {sections.map((section, index) => (
              <div
                key={section.title + index}
                className="min-h-screen flex flex-col justify-center py-20"
                ref={(el) => (desktopSectionRefs.current[index] = el)}
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: activeSection === index ? 1 : 0.35,
                    y: activeSection === index ? 0 : 20,
                  }}
                  transition={{ duration: 0.45 }}
                  className="text-3xl md:text-4xl font-bold text-slate-100 mb-6"
                >
                  {section.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: activeSection === index ? 1 : 0.35,
                    y: activeSection === index ? 0 : 20,
                  }}
                  transition={{ duration: 0.45, delay: 0.05 }}
                  className="text-lg md:text-xl max-w-lg text-slate-300 leading-relaxed"
                >
                  {section.description}
                </motion.p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: activeSection === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.6, delay: 0.08 }}
                  className="h-1 bg-purple-500 rounded mt-8 origin-left max-w-xs"
                />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderMobile = () => {
    return (
      <div className="flex flex-col space-y-8 w-full max-w-lg mx-auto">
        {sections.map((section, index) => (
          <div
            key={`mobile-${section.title}-${index}`}
            className="flex flex-col justify-center items-center py-6"
            ref={(el) => (mobileSectionRefs.current[index] = el)}
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
                {section.title}
              </h2>
              <p className="text-base text-slate-300 leading-relaxed px-4 max-w-md">
                {section.description}
              </p>
            </div>

            {section.card && (
              <div
                onClick={() => setExpandedCard(section.card)}
                className="cursor-pointer w-full max-w-sm rounded-2xl overflow-hidden bg-gray-900 border border-purple-800/30 backdrop-blur-sm hover:border-purple-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
              >
                <CardDemo
                  src={section.card.src}
                  alt={section.card.title}
                  hoverGifUrl={section.card.hoverGifUrl}
                  containerClassName="relative aspect-video overflow-hidden rounded-t-2xl"
                  cardClassName=""
                  overlayClassName=""
                />
                <div className="p-4">
                  <h4 className="text-lg font-bold text-white mb-2">{section.card.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {section.card.short || "Tap to view full details..."}
                  </p>
                  {section.card.tech && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {section.card.tech.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center px-2 py-1 bg-purple-900/20 border border-purple-700/30 rounded-full text-xs text-purple-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-purple-400">
                    <div className="flex items-center gap-1">
                      <ExternalLink size={12} />
                      <span>Tap to explore</span>
                    </div>
                    {section.card.githubLink && (
                      <div className="flex items-center gap-1">
                        <Github size={12} />
                        <span>Source</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <OptimizedModal
        isOpen={!!expandedCard}
        onClose={() => setExpandedCard(null)}
        expandedCard={expandedCard}
        id={id}
      />

      <div ref={scrollerRef} className="h-full" data-lenis-prevent>
        <div
          ref={containerRef}
          className="relative flex justify-center rounded-md p-4 lg:p-10 transition-colors duration-700"
          style={{ backgroundColor: backgroundColors[activeSection % backgroundColors.length] }}
        >
          {isMobile ? renderMobile() : renderDesktop()}
        </div>
      </div>
    </>
  );
}
