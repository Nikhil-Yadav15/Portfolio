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
  const rafRef = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const resizeTimeoutRef = useRef(null);
  const [hasHovered, setHasHovered] = useState(false);

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
    
    const debouncedResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(updateDimensions, 300);
    };
    
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [children]);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    const newX = clientX - left;
    const newY = clientY - top;
    
    // Throttle updates using RAF and threshold
    const deltaX = Math.abs(newX - lastMousePos.current.x);
    const deltaY = Math.abs(newY - lastMousePos.current.y);
    
    if (deltaX > 10 || deltaY > 10) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        mouseX.set(newX);
        mouseY.set(newY);
        lastMousePos.current = { x: newX, y: newY };
      });
    }
  }

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (!hasHovered) setHasHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

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
        willChange: isHovering ? 'transform' : 'auto',
      }}
      className={cn(
        "relative",
        "before:absolute before:inset-0 before:-z-20 before:content-['']",
        "before:rounded-[var(--border-radius)]",
        "before:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))]",
        "before:bg-[length:100%_200%]",
        isHovering && "before:animate-background-position-spin",
        "after:absolute after:inset-0 after:-z-30 after:content-['']",
        "after:rounded-[var(--border-radius)]",
        "after:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))]",
        "after:bg-[length:100%_200%] after:opacity-60",
        isHovering && "after:animate-background-position-spin",
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
          {hasHovered && isHovering && (
            <CanvasRevealEffect
              animationSpeed={3}
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
