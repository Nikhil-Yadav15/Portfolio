"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "./use-outside-click";
import { CardDemo } from "./background_overlay_card";
import { LinkPreview } from "@/components/ui/link-preview";
import { ExternalLink, Github, X } from 'lucide-react';

export function ExpandableCardDemo() {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 h-full w-full z-10 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 border border-purple-700/50 rounded-full text-purple-200 hover:text-white hover:bg-purple-900/50 transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 lg:hidden"
              onClick={() => setActive(null)}
            >
              
              <X size={20} />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-4xl max-h-[90dvh] bg-gray-900 border border-purple-800/50 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 flex flex-col"
            >
              <div className="overflow-y-auto max-h-[90dvh]">
                <motion.div layoutId={`image-${active.title}-${id}`} className="relative h-64 md:h-80 overflow-hidden">
                  <img
                  src={active.src}
                  alt={active.title}
                  className="w-full h-full object-cover"
                />
                
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                </motion.div>

                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <motion.h2
                      layoutId={`title-${active.title}-${id}`}
                      className="text-3xl md:text-4xl font-bold text-white mb-2"
                    >
                      {active.title}
                    </motion.h2>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-purple-300 text-lg font-medium"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <div className="mb-6">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-gray-300 leading-relaxed text-base md:text-lg"
                    >
                      {typeof active.content === "function" ? active.content() : active.content}
                    </motion.div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {active.tech?.map((tech, index) => (
                        <TechIconButton key={tech} tech={tech} index={index} />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <LinkPreview
                        url={active.ctaLink}
                        imageSrc={active.imageSrc}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        <ExternalLink size={18} />
                        {active.ctaText}
                      </LinkPreview>
                    </motion.div>
                    <motion.a
                      href={active.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-purple-700/50 text-purple-200 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      <Github size={18} />
                      View Source Code
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-start gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black rounded-2xl"
          >
            <div className="bg-gray-900/50 border border-purple-800/30 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-purple-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20">
              <div className="relative aspect-video overflow-hidden">
                <motion.div layoutId={`image-${card.title}-${id}`}>
                  <CardDemo
                    src={card.src}
                    alt={card.title}
                    containerClassName=""
                    cardClassName=""
                    overlayClassName=""
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <div className="mb-3">
                  <motion.h3
                    layoutId={`title-${card.title}-${id}`}
                    className="text-xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors"
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${card.description}-${id}`}
                    className="text-purple-300 text-sm font-medium"
                  >
                    {card.description}
                  </motion.p>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                  {card.short || card.content().props.children[0]} 
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {card.tech?.slice(0, 3).map((tech, index) => (
                    <TechIconButton key={tech} tech={tech} index={index} />
                  ))}
                  {card.tech?.length > 3 && (
                    <div className="inline-flex items-center px-3 py-1.5 bg-purple-900/20 border border-purple-700/30 rounded-full text-xs text-purple-300">
                      +{card.tech.length - 3} more
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1 text-xs text-purple-400">
                    <ExternalLink size={12} />
                    <span>View Project</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-purple-400">
                    <Github size={12} />
                    <span>Source</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

