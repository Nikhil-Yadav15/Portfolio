"use client";
import React from "react";
// import {
//   motion,
//   useMotionValue,
//   useSpring,
//   useTransform,
//   useMotionTemplate,
// } from "motion/react";
// import { cn } from "@/lib/utils";

export const CometCard = ({
    rotateDepth = 17.5,
    translateDepth = 20,
    className,
    children
  }) => {
    const ref = React.useRef(null);
    const x = React.useRef({ current: 0 });
    const y = React.useRef({ current: 0 });
  
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      
      // Apply transforms directly
      const rotateX = -yPct * rotateDepth;
      const rotateY = xPct * rotateDepth;
      const translateX = xPct * translateDepth;
      const translateY = -yPct * translateDepth;
      
      ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${translateX}px) translateY(${translateY}px)`;
    };
  
    const handleMouseLeave = () => {
      if (ref.current) {
        ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px)';
      }
    };
  
    return (
      <div className={`perspective-distant transform-3d ${className || ''}`}>
        <div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative rounded-2xl transition-all duration-200 hover:scale-105"
          style={{
            boxShadow: "rgba(0, 0, 0, 0.01) 0px 520px 146px 0px, rgba(0, 0, 0, 0.04) 0px 333px 133px 0px, rgba(0, 0, 0, 0.26) 0px 83px 83px 0px, rgba(0, 0, 0, 0.29) 0px 21px 46px 0px",
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px)"
          }}
        >
          {children}
        </div>
      </div>
    );
  };
