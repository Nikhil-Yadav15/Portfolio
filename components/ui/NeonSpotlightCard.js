"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "motion/react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { cn } from "@/lib/utils";

export const NeonSpotlightCard = ({
  children,
  className,
  borderSize = 2,
  borderRadius = 20,
  neonColors = {
    firstColor: "#ff00aa",
    secondColor: "#00FFF1",
  },

  spotlight = {
    radius: 300,
    maskColor: "#111111",
    canvasColors: [
      [59, 130, 246],
      [139, 92, 246], 
    ],
    dotSize: 3,
  },
  contentBg = "rgba(17,17,17,0.8)", 
  ...props
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [children]);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const styleVars = {
    "--border-size": `${borderSize}px`,
    "--border-radius": `${borderRadius}px`,
    "--neon-first-color": neonColors.firstColor,
    "--neon-second-color": neonColors.secondColor,
    "--pseudo-element-width": `${dimensions.width}px`,
    "--pseudo-element-height": `${dimensions.height}px`,
    "--after-blur": `${Math.max(dimensions.width / 3, 8)}px`,
  };

  return (
    <div
      ref={containerRef}
      style={{
        ...styleVars,
        padding: "var(--border-size)",
        borderRadius: "var(--border-radius)",
      }}
      className={cn(
        "relative",
        "before:absolute before:inset-0 before:-z-20 before:content-['']",
        "before:rounded-[var(--border-radius)]",
        "before:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))]",
        "before:bg-[length:100%_200%] before:animate-background-position-spin",
        "after:absolute after:inset-0 after:-z-30 after:content-['']",
        "after:rounded-[var(--border-radius)]",
        "after:blur-[var(--after-blur)]",
        "after:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))]",
        "after:bg-[length:100%_200%] after:opacity-80 after:animate-background-position-spin",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        style={{
          borderRadius: `calc(var(--border-radius) - var(--border-size))`,
          background: contentBg,
        }}
        className="relative z-10 w-full h-full overflow-hidden"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition duration-200"
          style={{
            backgroundColor: spotlight.maskColor,
            maskImage: useMotionTemplate`
              radial-gradient(
                ${spotlight.radius}px circle at ${mouseX}px ${mouseY}px,
                white,
                transparent 80%
              )
            `,
            WebkitMaskImage: useMotionTemplate`
              radial-gradient(
                ${spotlight.radius}px circle at ${mouseX}px ${mouseY}px,
                white,
                transparent 80%
              )
            `,
            opacity: isHovering ? 0.95 : 0,
          }}
        >
          {isHovering && (
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-transparent absolute inset-0 pointer-events-none"
              colors={spotlight.canvasColors}
              dotSize={spotlight.dotSize}
            />
          )}
        </motion.div>

        <div className="relative z-30 p-6 text-white">
          {children}
        </div>
      </div>
    </div>
  );
};
