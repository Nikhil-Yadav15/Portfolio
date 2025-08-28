'use client';
import { useEffect, useRef, useState } from "react";

const ScrambledText = ({
  radius = 100,
  duration = 1200,
  speed = 0.5,
  scrambleChars = ".:",
  className = "",
  style = {},
  children,
}) => {
  const rootRef = useRef(null);
  const [chars, setChars] = useState([]);

  useEffect(() => {
    if (!rootRef.current || !children) return;

    const text = children.toString();
    const charElements = text.split('').map((char, index) => ({
      original: char,
      current: char,
      isScrambling: false,
      scrambleTimeout: null,
      index
    }));

    setChars(charElements);
  }, [children]);

  const scrambleChar = (charIndex, intensity) => {
    if (!chars[charIndex]) return;

    const char = chars[charIndex];
    const scrambleDuration = duration * intensity;
    const scrambleInterval = Math.max(50, scrambleDuration * speed / 10);
    
    if (char.scrambleTimeout) {
      clearTimeout(char.scrambleTimeout);
    }

    char.isScrambling = true;
    char.lastActiveTime = Date.now();
    
    const startTime = Date.now();
    
    const scrambleStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / scrambleDuration;
      
      if (progress >= 1) {
        setChars(prev => prev.map((c, i) => 
          i === charIndex 
            ? { ...c, current: c.original, isScrambling: false }
            : c
        ));
        return;
      }
      
      const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      
      setChars(prev => prev.map((c, i) => 
        i === charIndex 
          ? { ...c, current: Math.random() < 0.7 ? randomChar : c.original }
          : c
      ));
      
      char.scrambleTimeout = setTimeout(scrambleStep, scrambleInterval);
    };
    
    scrambleStep();
  };

  const restoreChar = (charIndex) => {
    if (!chars[charIndex]) return;
    
    const char = chars[charIndex];
    
    if (char.scrambleTimeout) {
      clearTimeout(char.scrambleTimeout);
    }
    
    setChars(prev => prev.map((c, i) => 
      i === charIndex 
        ? { ...c, current: c.original, isScrambling: false }
        : c
    ));
  };

  const handleMouseMove = (e) => {
    if (!rootRef.current) return;

    const rect = rootRef.current.getBoundingClientRect();
    const charElements = rootRef.current.querySelectorAll('.char');
    
    charElements.forEach((charEl, index) => {
      const charRect = charEl.getBoundingClientRect();
      const charCenterX = charRect.left + charRect.width / 2;
      const charCenterY = charRect.top + charRect.height / 2;
      
      const dx = e.clientX - charCenterX;
      const dy = e.clientY - charCenterY;
      const distance = Math.hypot(dx, dy);
      
      if (distance < radius) {
        const intensity = 1 - (distance / radius);
        scrambleChar(index, intensity);
      } else {
        restoreChar(index);
      }
    });
  };

  const handleMouseLeave = () => {
    chars.forEach((char, index) => {
      restoreChar(index);
    });
  };

  useEffect(() => {
    return () => {
      chars.forEach(char => {
        if (char.scrambleTimeout) {
          clearTimeout(char.scrambleTimeout);
        }
      });
    };
  }, [chars]);

  return (
    <div
      ref={rootRef}
      className={`cursor-text select-none `}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <p className="leading-relaxed">
        {chars.map((char, index) => (
          <span
            key={index}
            className={` ${className} char inline-block transition-transform duration-75 ${
              char.current === ' ' ? 'w-[0.5ch]' : ''
            }`}
            style={{
              transform: char.isScrambling ? `translateY(${Math.random() * 2 - 1}px)` : 'translateY(0)',
            }}
          >
            {char.current === ' ' ? '\u00A0' : char.current}
          </span>
        ))}
      </p>
    </div>
  );
};

export default ScrambledText;
