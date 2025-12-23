"use client";
import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useEffect, useState } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName
}) => {
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });
  
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true });
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    let animationInProgress = false;
    
    const runAnimation = async () => {
      if (animationInProgress || isCancelled) return;
      animationInProgress = true;

      try {
        while (!isCancelled) {
          // Reset all spans to hidden
          await animate("span", {
            opacity: 0,
            display: "none",
          }, { duration: 0 });

          if (isCancelled) break;

          // Type in animation
          setShowCursor(true);
          await animate("span", {
            display: "inline-block",
            opacity: 1,
          }, {
            duration: 0.1,
            delay: stagger(0.1),
            ease: "easeInOut",
          });

          if (isCancelled) break;

          // Hold the text
          await new Promise((resolve) => setTimeout(resolve, 2000));
          
          if (isCancelled) break;

          // Delete animation - smooth reverse
          setShowCursor(false);
          await animate("span", {
            opacity: 0,
          }, {
            duration: 0.05,
            delay: stagger(0.05, { from: "last" }),
            ease: "easeInOut",
          });

          if (isCancelled) break;

          // Hide all spans
          await animate("span", {
            display: "none",
          }, { duration: 0 });

          if (isCancelled) break;

          // Pause before restarting
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
        // Animation was interrupted, cleanup
        console.warn('TypewriterEffect animation interrupted:', error);
      } finally {
        animationInProgress = false;
      }
    };
    
    if (isInView) {
      runAnimation();
    }

    return () => {
      isCancelled = true;
    };
  }, [isInView, animate, scope]);

  const renderWords = () => {
    return (
      <span ref={scope} className="inline">
        {wordsArray.map((word, idx) => (
          <span key={`word-${idx}`} className="inline-block">
            {word.text.map((char, index) => (
              <motion.span
                initial={{}}
                key={`char-${idx}-${index}`}
                className={cn(
                  `text-white opacity-0 hidden`,
                  word.className
                )}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </span>
        ))}
      </span>
    );
  };

  return (
    <span
      className={cn(
        "text-base sm:text-sm md:text-sm lg:text-sm font-bold",
        className
      )}
    >
      {renderWords()}
      {showCursor && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={cn(
            "inline-block rounded-sm w-[4px] h-[0.7em] bg-blue-500 ml-1",
            cursorClassName
          )}
        ></motion.span>
      )}
    </span>
  );
};
