"use client";

import React, { ElementType, ReactNode, useEffect, useState, forwardRef, useRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

const cn = (...classes) => classes.filter(Boolean).join(' ');

const VideoText = forwardRef(({
  src,
  videoSources,
  children,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "auto",
  fontSize = "3rem",
  fontWeight = "bold",
  textAnchor = "middle",
  dominantBaseline = "middle",
  fontFamily = "sans-serif",
  as: Component = "span",
  width = "auto",
  height = "auto",
  maxWidth,
  maxHeight,
  maintainAspectRatio = true,
  onVideoLoad,
  onVideoError,
  ...motionProps
}, ref) => {
  const [svgMask, setSvgMask] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [textDimensions, setTextDimensions] = useState({ width: 0, height: 0 });
  const measureRef = useRef(null);
  
  const content = React.Children.toArray(children).join("");

  // Measures text using a hidden DOM node so responsive font sizes (e.g., clamp) are respected.
  const measureText = (text, fontSize, fontWeight, fontFamily) => {
    if (typeof document === 'undefined') {
      return { width: 0, height: 0, fontSizePx: 0, fontFamily, fontWeight };
    }

    const measureEl = document.createElement('span');
    measureEl.textContent = text;
    measureEl.style.position = 'absolute';
    measureEl.style.visibility = 'hidden';
    measureEl.style.whiteSpace = 'nowrap';
    measureEl.style.fontSize = typeof fontSize === 'string' ? fontSize : `${fontSize}px`;
    measureEl.style.fontWeight = fontWeight;
    measureEl.style.fontFamily = fontFamily;
    measureEl.style.lineHeight = '1';

    document.body.appendChild(measureEl);

    const rect = measureEl.getBoundingClientRect();
    const computed = window.getComputedStyle(measureEl);
    const fontSizePx = parseFloat(computed.fontSize) || 0;
    const resolvedFontFamily = computed.fontFamily || fontFamily;
    const resolvedFontWeight = computed.fontWeight || fontWeight;

    document.body.removeChild(measureEl);

    return {
      width: rect.width,
      height: rect.height || fontSizePx * 0.85,
      fontSizePx,
      fontFamily: resolvedFontFamily,
      fontWeight: resolvedFontWeight,
    };
  };

  useEffect(() => {
    if (!content) return;

    const dimensions = measureText(content, fontSize, fontWeight, fontFamily);
    setTextDimensions(dimensions);

    const padding = dimensions.height * 0.2;
    const svgWidth = dimensions.width + (padding * 2);
    const svgHeight = dimensions.height + (padding * 2);
    
    const getFontSizeForSVG = (fontSize) => {
      if (typeof fontSize === 'number') return fontSize;
      if (typeof fontSize === 'string') {
        if (fontSize.includes('rem')) {
          return parseFloat(fontSize) * 16;
        } else if (fontSize.includes('em')) {
          return parseFloat(fontSize) * 16;
        } else if (fontSize.includes('px')) {
          return parseFloat(fontSize);
        } else {
          const match = fontSize.match(/^(\d*\.?\d+)/);
          return match ? parseFloat(match[1]) * 16 : 48;
        }
      }
      return 48;
    };

    const svgFontSize = dimensions.fontSizePx;

    const newSvgMask = `<svg xmlns='http://www.w3.org/2000/svg' width='${svgWidth}' height='${svgHeight}' viewBox='0 0 ${svgWidth} ${svgHeight}'>
      <text x='50%' y='50%'
            font-size='${svgFontSize}'
            font-weight='${fontWeight}'
            text-anchor='${textAnchor}'
            dominant-baseline='${dominantBaseline}'
            font-family='${fontFamily}'
            fill='black'>${content}</text>
    </svg>`;
    
    setSvgMask(newSvgMask);
  }, [content, fontSize, fontWeight, textAnchor, dominantBaseline, fontFamily]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    setVideoError(false);
    onVideoLoad?.();
  };

  const handleVideoError = (e) => {
    setVideoError(true);
    setVideoLoaded(false);
    onVideoError?.(e);
  };

  const renderVideoSources = () => {
    if (videoSources && videoSources.length > 0) {
      return videoSources.map((source, index) => (
        <source key={index} src={source.src} type={source.type} />
      ));
    }
    if (src) {
      return <source src={src} type="video/mp4" />;
    }
    return null;
  };

  let MotionComponent;
  if (typeof Component === 'string') {
    MotionComponent = motion[Component] ?? motion.span;
  } else {
    MotionComponent = motion(Component);
  }

  if (!svgMask) {
    return (
      <MotionComponent
        ref={ref}
        className={cn("relative inline-block", className)}
        style={{ 
          fontSize,
          fontWeight,
          fontFamily,
          width: width !== "auto" ? width : undefined,
          height: height !== "auto" ? height : undefined,
          maxWidth,
          maxHeight
        }}
        {...motionProps}
      >
        <span className="sr-only">{content}</span>
      </MotionComponent>
    );
  }

  const dataUrlMask = `url("data:image/svg+xml,${encodeURIComponent(svgMask)}")`;

  const getContainerStyle = () => {
    const baseStyle = {
      fontSize,
      fontWeight,
      fontFamily,
      maxWidth,
      maxHeight
    };

    if (width !== "auto") {
      baseStyle.width = width;
    } else if (textDimensions.width > 0) {
      baseStyle.width = `${textDimensions.width}px`;
    }

    if (height !== "auto") {
      baseStyle.height = height;
    } else if (textDimensions.height > 0) {
      baseStyle.height = `${textDimensions.height}px`;
    }

    if (!baseStyle.width) {
      baseStyle.minWidth = "1em";
    }
    if (!baseStyle.height) {
      baseStyle.minHeight = "1.2em";
    }

    return baseStyle;
  };

  return (
    <MotionComponent
      ref={ref}
      className={cn("relative inline-block overflow-hidden", className)}
      style={getContainerStyle()}
      {...motionProps}
    >
      <span
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none whitespace-nowrap"
        style={{
          fontSize,
          fontWeight,
          fontFamily,
          left: '-9999px',
          top: '-9999px'
        }}
        aria-hidden="true"
      >
        {content}
      </span>

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          maskImage: dataUrlMask,
          WebkitMaskImage: dataUrlMask,
          maskSize: maintainAspectRatio ? "contain" : "100% 100%",
          WebkitMaskSize: maintainAspectRatio ? "contain" : "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      >
        <video
          className="w-full h-full object-cover"
          style={{ 
            minWidth: '100%', 
            minHeight: '100%',
            width: '100%',
            height: '100%'
          }}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          playsInline
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
        >
          {renderVideoSources()}
          Your browser does not support the video tag.
        </video>
      </div>

      <span className="sr-only" aria-label={`Video content masked with text: ${content}`}>
        {content}
      </span>

      {!videoLoaded && !videoError && (
        <div 
          className="absolute inset-0 flex items-center justify-center text-gray-400"
          style={{
            fontSize,
            fontWeight,
            fontFamily,
          }}
        >
          {content}
        </div>
      )}

      {videoError && (
        <div 
          className="absolute inset-0 flex items-center justify-center text-red-400"
          style={{
            fontSize,
            fontWeight,
            fontFamily,
          }}
        >
          {content}
        </div>
      )}
    </MotionComponent>
  );
});

VideoText.displayName = 'VideoText';

export { VideoText };
