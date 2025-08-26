"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, ExternalLink, Github } from "lucide-react";
import { LinkPreview } from "@/components/ui/link-preview";

export function OptimizedModal({ isOpen, onClose, expandedCard, id }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('keydown', handleKeyDown);
    
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!expandedCard) return null;

  return (
    <dialog 
      ref={dialogRef}
      className="backdrop:bg-black/80 backdrop:backdrop-blur-sm bg-transparent border-none p-0 max-w-none max-h-none w-screen h-screen overflow-visible focus:outline-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <button
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 border border-purple-700/50 rounded-full text-purple-200 hover:text-white hover:bg-purple-900/50 transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <motion.div
          layoutId={`card-${expandedCard.title}-${id}`}
          className="w-full max-w-4xl max-h-[90vh] bg-gray-900 border border-purple-800/50 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="overflow-y-auto max-h-[90vh]">
            <motion.div 
              layoutId={`image-${expandedCard.title}-${id}`} 
              className="relative h-64 md:h-80 overflow-hidden"
            >
              <img
                src={expandedCard.src}
                alt={expandedCard.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
            </motion.div>

            <div className="p-6 md:p-8">
              <div className="mb-6">
                <motion.h2
                  layoutId={`title-${expandedCard.title}-${id}`}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  {expandedCard.title}
                </motion.h2>
                <motion.p
                  layoutId={`description-${expandedCard.description}-${id}`}
                  className="text-purple-300 text-lg font-medium"
                >
                  {expandedCard.description}
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
                  {typeof expandedCard.content === "function" ? expandedCard.content() : expandedCard.content}
                </motion.div>
              </div>

              {expandedCard.tech && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {expandedCard.tech.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-3 py-1.5 bg-purple-900/30 border border-purple-700/50 rounded-full text-sm text-purple-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {expandedCard.ctaLink && (
                  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <LinkPreview
                      url={expandedCard.ctaLink}
                      imageSrc={expandedCard.imageSrc}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      <ExternalLink size={18} />
                      {expandedCard.ctaText || "Visit Project"}
                    </LinkPreview>
                  </motion.div>
                )}
                
                {expandedCard.githubLink && (
                  <motion.a
                    href={expandedCard.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-purple-700/50 text-purple-200 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    <Github size={18} />
                    View Source Code
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </dialog>
  );
}
