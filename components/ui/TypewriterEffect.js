"use client";
import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useEffect } from "react";

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
  const isInView = useInView(scope);

  useEffect(() => {
    let animationLoop;
    
    if (isInView) {
      const runAnimation = async () => {
        while (true) {
          await animate("span", {
            opacity: 0,
            display: "none",
          }, { duration: 0 });

          await animate("span", {
            display: "inline-block",
            opacity: 1,
          }, {
            duration: 0.1,
            delay: stagger(0.1),
            ease: "easeInOut",
          });

          await new Promise((resolve) => setTimeout(resolve, 2000));
          const spans = scope.current.querySelectorAll("span");
          for (let i = spans.length - 1; i >= 0; i--) {
            await animate(spans[i], {
              opacity: 0,
              display: "none",
            }, {
              duration: 0.01,
              ease: "easeInOut",
            });
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      };
      
      animationLoop = runAnimation();
    }

    return () => {
      // if (animationLoop) {
      // }
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
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[3px] h-4 md:h-4 lg:h-4 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </span>
  );
};
