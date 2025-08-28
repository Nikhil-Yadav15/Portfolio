"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";

export const TextRevealCard = ({
  text,
  revealText,
  children,
  className,
  fontSize = 'text-base sm:text-lg md:text-xl lg:text-2xl',
}) => {
  const [widthPercentage, setWidthPercentage] = useState(0);
  const cardRef = useRef(null);
  const [left, setLeft] = useState(0);
  const [localWidth, setLocalWidth] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      const { left, width: localWidth } =
        cardRef.current.getBoundingClientRect();
      setLeft(left);
      setLocalWidth(localWidth);
    }
  }, []);

  function mouseMoveHandler(event) {
    event.preventDefault();
    const { clientX } = event;
    if (cardRef.current) {
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    }
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false);
    setWidthPercentage(0);
  }
  function mouseEnterHandler() {
    setIsMouseOver(true);
  }
  function touchMoveHandler(event) {
    event.preventDefault();
    const clientX = event.touches[0].clientX;
    if (cardRef.current) {
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    }
  }

  const rotateDeg = (widthPercentage - 50) * 0.1;
  return (
    <div
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onMouseMove={mouseMoveHandler}
      onTouchStart={mouseEnterHandler}
      onTouchEnd={mouseLeaveHandler}
      onTouchMove={touchMoveHandler}
      ref={cardRef}
      className={cn(
        "w-full max-w-[50rem] relative overflow-hidden",
        className
      )}>
      {children}
      <div className="relative flex justify-center items-center overflow-hidden">
        <motion.div
          style={{
            width: "100%",
          }}
          animate={
            isMouseOver
              ? {
                  opacity: widthPercentage > 0 ? 1 : 0,
                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                }
              : {
                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                }
          }
          transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
          className="absolute bg-gradient-to-bl from-slate-950 via-slate-950 to-black z-20 will-change-transform">
          <p
            className={cn(
              "py-4 mx-2 sm:py-6 md:py-8 lg:py-10 font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-200",
              "whitespace-normal break-words sm:text-lg md:text-xl lg:text-2xl", 
              fontSize 
            )}>
            {revealText}
          </p>
        </motion.div>
        <motion.div
          animate={{
            left: `${widthPercentage}%`,
            rotate: `${rotateDeg}deg`,
            opacity: widthPercentage > 0 ? 1 : 0,
          }}
          transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
          className="absolute z-50 will-change-transform"></motion.div>

        <div className="overflow-hidden">
          <p
            className={cn(
              "py-4 mx-2 sm:py-6 md:py-8 lg:py-10 font-bold text-gray-300", 
              "whitespace-normal break-words", 
              fontSize 
            )}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export const TextRevealCardTitle = ({
  children,
  className
}) => {
  return (
    <h2 className={twMerge("text-white", className)}>
      {children}
    </h2>
  );
};

export const TextRevealCardDescription = ({
  children,
  className
}) => {
  return (<p className={twMerge("text-[#a9a9a9] text-sm", className)}>{children}</p>);
};


